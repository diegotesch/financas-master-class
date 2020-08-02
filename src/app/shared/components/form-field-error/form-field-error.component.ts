import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-field-error',
  templateUrl: './form-field-error.component.html',
  styleUrls: ['./form-field-error.component.css']
})
export class FormFieldErrorComponent implements OnInit {

  @Input('form-control') formControl: FormControl;

  constructor() { }

  ngOnInit() {
  }

  public get errorMessage(): string | null {
    if (this.mustShowErrorMessage()) {
      return this.getErrorMessage();
    }
    return null;
  }

  private mustShowErrorMessage(): boolean {
    return this.formControl.invalid && this.formControl.touched
  }

  private getErrorMessage(): string | null {
    if (this.formControl.errors.required)
      return "Campo obrigatório";

    if (this.formControl.errors.email)
      return "Formato de e-mail inválido";

    if (this.formControl.errors.minlength){
      const requiredLength = this.formControl.errors.minlength.requiredLength;
      const actualLength = this.formControl.errors.minlength.actualLength;
      return `Campo deve ter no mínimo ${requiredLength} caracteres. Apenas ${actualLength} foram fornecidos`;
    }

    if (this.formControl.errors.maxlength){
      const requiredLength = this.formControl.errors.maxlength.requiredLength;
      const actualLength = this.formControl.errors.maxlength.actualLength;
      return `Campo deve ter no máximo ${requiredLength} caracteres. Foram fornecidos ${actualLength}.`;
    }

    return null;

  }
}
