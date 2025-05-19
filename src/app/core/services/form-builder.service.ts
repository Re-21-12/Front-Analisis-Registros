import { inject, Injectable } from '@angular/core';
import { FieldTemplateModel, FormTemplateModel } from '../shared/components/dynamic-form/models/form-template';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormBuilderService {

  private _formBuilder = inject(FormBuilder);

  constructor() { }

  toFormGroup(fields: FieldTemplateModel[], form: FormTemplateModel): FormGroup {

    const group:any = {}

    fields.forEach((field: FieldTemplateModel) => {
      let validators :any = []

      if(field.Rules !== undefined){
        field.Rules.forEach((rule) =>{
          validators.push(rule)
        })
      }

      group[field.Code] = this._formBuilder.control('', validators)

    })

    const formGroup = this._formBuilder.group(group);

    return formGroup;
  }
}
