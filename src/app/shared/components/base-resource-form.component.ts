import { OnInit, AfterContentChecked, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { switchMap } from 'rxjs/operators';
import toaster from 'toastr';

import { BaseResourceModel } from './../models/base-resource.model';
import { BaseResourceService } from './../services/base-resource.service';

export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

  currentAction: string;
  resourceForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;

  protected route: ActivatedRoute;
  protected router: Router;
  protected formBuilder: FormBuilder;

  constructor(
    protected injector: Injector,
    public resource: T,
    protected resourceService: BaseResourceService<T>,
    protected jsonDataToResourceFn: (jsonData: any) => T
  ) {
    this.route = this.injector.get(ActivatedRoute);
    this.router = this.injector.get(Router);
    this.formBuilder = this.injector.get(FormBuilder);
  }

  ngOnInit() {
    this.setCurrentAction();
    this.buildResourceForm();
    this.loadResource();
  }

  //metodo invocado apos checar o carregamento de todo o conteudo
  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;
    if (this.currentAction == 'new') {
      this.createResource();
      return;
    }
    this.updateResource();
  }

  protected setCurrentAction() {
    this.currentAction = this.route.snapshot.url[0].path == "new" ? "new" : "edit";
  }

  protected loadResource() {
    if (this.currentAction == "edit") {
      this.route.paramMap.pipe(
        // obtem o valor do id passado como parametro na rota e o usa para obter a categoria
        switchMap(params => this.resourceService.getById(+params.get("id")))
      ).subscribe(resource => {
        this.resource = resource;
        // faz o bind da categoria com o formulario (carrega os dados no formulario)
        this.resourceForm.patchValue(this.resource);
      }, error => {
        alert('Ocorreu um erro no servidor, tente novamente mais tarde');
      })
    }
  }

  protected setPageTitle() {
    this.pageTitle = this.creationPageTitle();
    if (this.currentAction !== 'new') {
      this.pageTitle = this.editionPageTitle();
    }
  }

  protected creationPageTitle(): string {
    return 'Novo';
  }

  protected editionPageTitle(): string {
    return 'Edição';
  }

  protected createResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);
    this.resourceService.create(resource)
    .subscribe(
      resource => this.actionForSuccess(resource),
      error => this.actionForError(error)
    )
  }

  protected updateResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);
    this.resourceService.update(resource)
    .subscribe(
      resource => this.actionForSuccess(resource),
      error => this.actionForError(error)
    )
  }

  protected actionForSuccess(resource: T) {
    toaster.success('Registro processado com sucesso!');

    const baseComponentPath: string = this.route.snapshot.parent.url[0].path;

    this.router.navigateByUrl(baseComponentPath, { skipLocationChange: true }).then(
      () => this.router.navigate([baseComponentPath, resource.id, 'edit'])
    )
  }

  protected actionForError(error) {
    toaster.error('Ocorreu um erro ao processar sua requisição!');

    this.submittingForm = false;

    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
      return;
    }

    this.serverErrorMessages = ['Falha na comunicação com o servidor. Por favor, tente novamente mais tarde'];
  }

  protected abstract buildResourceForm(): void;

}
