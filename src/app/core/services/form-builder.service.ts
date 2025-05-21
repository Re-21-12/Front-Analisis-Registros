import { Injectable } from '@angular/core';
import { FieldTemplateModel, FormTemplateModel } from '../shared/components/dynamic-form/models/form-template';
import { FormGroup, FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormBuilderService {

  constructor() { }

  toFormGroup(fields: FieldTemplateModel[], form: FormTemplateModel): FormGroup {
    const group: Record<string, FormControl> = {};

    fields.forEach((field: FieldTemplateModel) => {
      let validators: any[] = [];

      if(field.Rules !== undefined){
        field.Rules.forEach((rule) => {
          validators.push(rule);
        });
      }

      group[field.Code] = new FormControl({value: field.DefaultValue||'' ,disabled: field.Disabled }, [...validators]);
    });

    return new FormGroup(group);
  }
}
