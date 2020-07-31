import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from  '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { switchMap } from 'rxjs/operators';
import toaster from 'toastr';

import { Category } from './../shared/category.model';
import { CategoryService } from './../shared/category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  category: Category = new Category();

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  //metodo invocado apos checar o carregamento de todo o conteudo
  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;
    if (this.currentAction == 'new') {
      this.createCategory();
      return;
    }
    this.updateCategory();
  }

  private setCurrentAction() {
    this.currentAction = this.route.snapshot.url[0].path == "new" ? "new" : "edit";
  }

  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    })
  }

  private loadCategory() {
    if (this.currentAction == "edit") {
      this.route.paramMap.pipe(
        // obtem o valor do id passado como parametro na rota e o usa para obter a categoria
        switchMap(params => this.categoryService.getById(+params.get("id")))
      ).subscribe(category => {
        this.category = category;
        // faz o bind da categoria com o formulario (carrega os dados no formulario)
        this.categoryForm.patchValue(this.category);
      }, error => {
        alert('Ocorreu um erro no servidor, tente novamente mais tarde');
      })
    }
  }

  private setPageTitle() {
    this.pageTitle = 'Cadastro de Categoria';
    if (this.currentAction !== 'new') {
      const categoryName = this.category.name || '';
      this.pageTitle = `Editando categoria: ${categoryName}`;
    }
  }

  private createCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.create(category)
    .subscribe(
      category => this.actionForSuccess(category),
      error => this.actionForError(error)
    )
  }

  private updateCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.update(category)
    .subscribe(
      category => this.actionForSuccess(category),
      error => this.actionForError(error)
    )
  }

  private actionForSuccess(category: Category) {
    toaster.success('Registro processado com sucesso!');

    this.router.navigateByUrl('categories', { skipLocationChange: true }).then(
      () => this.router.navigate(['categories', category.id, 'edit'])
    )
  }

  private actionForError(error) {
    toaster.error('Ocorreu um erro ao processar sua requisição!');

    this.submittingForm = false;

    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
      return;
    }

    this.serverErrorMessages = ['Falha na comunicação com o servidor. Por favor, tente novamente mais tarde'];
  }

}
