import { FormTemplateModel } from './form-template';
import {FieldType} from './form-template';
export type TFormList = {
  [key: string]: FormTemplateModel;
}

export const Forms: TFormList = {
  persona: {
    Code: 'persona',
    Title: 'Persona',
    Fields: [
      {
        Id: 13,
        Code: 'id',
        Name: 'AADHAAR',
        IsRequired: false,
        IsEditable: false,
        Hidden: true,
        Disabled: true,
        TypeField: FieldType.Text,
      },
            {
        Id: 12,
        Code: 'estado',
        Name: 'Estado',
        IsRequired: true,
        IsEditable: true,
        Hidden: true,
        Disabled: false,
        TypeField: FieldType.Text,
        DefaultValue: 'Pendiente',
      },
      {
        Id: 1,
        Code: 'primerNombre',
        Name: 'Primer Nombre',
        IsRequired: true,
        IsEditable: true,
        Hidden: false,
        MaxLength: 50,
        MinLength: 2,
        Disabled: false,
        TypeField: FieldType.Text,
      },
      {
        Id: 2,
        Code: 'segundoNombre',
        Name: 'Segundo Nombre',
        IsRequired: true,
        IsEditable: true,
        Hidden: false,
        MaxLength: 50,
        MinLength: 2,
        Disabled: false,
        TypeField: FieldType.Text,
      },
      {
        Id: 3,
        Code: 'primerApellido',
        Name: 'Primer Apellido',
        IsRequired: true,
        IsEditable: true,
        Hidden: false,
        MaxLength: 50,
        MinLength: 2,
        Disabled: false,
        TypeField: FieldType.Text,
      },
      {
        Id: 4,
        Code: 'segundoApellido',
        Name: 'Segundo Apellido',
        IsRequired: true,
        IsEditable: true,
        Hidden: false,
        MaxLength: 50,
        MinLength: 2,
        Disabled: false,
        TypeField: FieldType.Text,
      },
      {
        Id: 5,
        Code: 'fechaDeNacimiento',
        Name: 'Fecha de Nacimiento',
        IsRequired: true,
        IsEditable: true,
        Hidden: false,
        Disabled: false,
        TypeField: FieldType.Date,
      },
      {
        Id: 6,
        Code: 'fechaDeResidencia',
        Name: 'Fecha inicio de Residencia',
        IsRequired: true,
        IsEditable: true,
        Hidden: false,
        Disabled: false,
        TypeField: FieldType.Date,
      },
      {
        Id: 7,
        Code: 'tipoDeSangre',
        Name: 'Tipo de Sangre',
        IsRequired: true,
        IsEditable: true,
        Hidden: false,
        Disabled: false,
        TypeField: FieldType.Select,
        Options: [
          { value: 'A+', name: 'A+' },
          { value: 'A-', name: 'A-' },
          { value: 'B+', name: 'B+' },
          { value: 'B-', name: 'B-' },
          { value: 'AB+', name: 'AB+' },
          { value: 'AB-', name: 'AB-' },
          { value: 'O+', name: 'O+' },
          { value: 'O-', name: 'O-' },
        ]
      },
      {
        Id: 8,
        Code: 'regionId',
        Name: 'Región',
        IsRequired: false,
        IsEditable: true,
        Hidden: false,
        Disabled: false,
        TypeField: FieldType.Select,
        Options: [] // Llenar dinámicamente con las regiones disponibles
      },
      {
        Id: 9,
        Code: 'tipoPersonaId',
        Name: 'Tipo de Persona',
        IsRequired: false,
        IsEditable: true,
        Hidden: true,
        Disabled: false,
        TypeField: FieldType.Select,
        DefaultValue: '2',
        Options: [
          { value: '1', name: 'Agente' },
          { value: '2', name: 'Civil' },
          { value: '3', name: 'Administrador' },
        ]
      },
      {
        Id: 10,
        Code: 'genero',
        Name: 'Género',
        IsRequired: true,
        IsEditable: true,
        Hidden: false,
        Disabled: false,
        TypeField: FieldType.Select,
        Options: [
          { value: 'masculino', name: 'Masculino' },
          { value: 'femenino', name: 'Femenino' },
        ]
      },
      {
        Id: 11,
        Code: 'foto',
        Name: 'Foto',
        IsRequired: true,
        IsEditable: true,
        Hidden: false,
        Disabled: false,
        TypeField: FieldType.Image,
      },

    ]
  },
  region: {
    Code: 'region',
    Title: 'Región',
    Fields: [
      {
        Id: 1,
        Code: 'nombre',
        Name: 'Nombre de la Región',
        IsRequired: true,
        IsEditable: true,
        Hidden: false,
        MaxLength: 100,
        MinLength: 2,
        Disabled: false,
        TypeField: FieldType.Select,
        Options: [
        ]
      }
    ]
  },
  tipopersona: {
    Code: 'tipopersona',
    Title: 'Tipo de Persona',
    Fields: [
      {
        Id: 1,
        Code: 'nombre',
        Name: 'Nombre del Tipo de Persona',
        IsRequired: true,
        IsEditable: true,
        Hidden: false,
        MaxLength: 100,
        MinLength: 2,
        Disabled: false,
        TypeField: FieldType.Select,
        Options: [
          { value: 'civil', name: 'civil' },
          { value: 'registrador', name: 'registrador' },
        ]
      }
    ]
  },
  opciones: {
    Code: 'opciones',
    Title: 'Opciones',
    Fields: [
      {
        Id: 1,
        Code: 'opcion',
        Name: 'Opcion',
        IsRequired: true,
        IsEditable: true,
        Hidden: false,
        MaxLength: 50,
        MinLength: 3,
        Disabled: false,
        TypeField: FieldType.Select,
        Options: [
          { value: 'persona', name: 'persona' },
          { value: 'region', name: 'region' },
        ]
      },
    ]
  },
  login:{
    Code: 'login',
    Title: 'Login',
    Fields: [
      {
        Id: 1,
        Code: 'id',
        Name: 'AADHAAR',
        IsRequired: true,
        IsEditable: true,
        Hidden: false,
        MaxLength: 50,
        MinLength: 2,
        Disabled: false,
        TypeField: FieldType.Text,
      },

    ]
  }
}
