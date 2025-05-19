import { Validators } from '@angular/forms';

export interface FormTemplateModel {
  Code: string;
  Title: string;
  Fields: FieldTemplateModel[];

}

export interface  FieldTemplateModel {
  Id: number;
  Code: string;
  Name:string;
  IsRequired: boolean;
  IsEditable: boolean;
  Hidden: boolean;
  MaxLength?: number;
  MinLength?: number;
  Disabled: boolean;
  Placeholder?: string;
  Max?: number;
  Min?: number;
  Rules?: Validators[]
  DefaultValue?: string | boolean | number | Date | [];
  TypeField: FieldType;
  Options?: any;
}
export enum FieldType {
  Text = 'text',
  Number = 'number',
  Date = 'date',
  Time = 'time',
  DateTime = 'datetime',
  Email = 'email',
  Password = 'password',
  Select = 'select',
  Radio = 'radio',
  Checkbox = 'checkbox',
  TextArea = 'textarea',
  File = 'file',
  Color = 'color',
  Range = 'range',
  Tel = 'tel',
  Decimal = 'decimal',
  Slidetoggle = 'slidetoggle',
}
