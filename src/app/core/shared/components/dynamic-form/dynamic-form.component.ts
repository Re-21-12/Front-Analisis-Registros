import { DateTime } from 'luxon';

import { Component, DestroyRef, ElementRef, EventEmitter, inject, Input, input, model, OnInit, output, signal, viewChild } from '@angular/core';

import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { MatButtonModule } from '@angular/material/button';

import { MatCardModule } from '@angular/material/card';

import { MatOptionModule } from '@angular/material/core';

import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatFormFieldModule, MatPrefix } from '@angular/material/form-field';

import { MatIconModule } from '@angular/material/icon';

import { MatInputModule } from '@angular/material/input';

import { MatRadioModule } from '@angular/material/radio';

import { MatSelectModule } from '@angular/material/select';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { FormBuilderService } from '../../../services/form-builder.service';

import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';


import { CommonModule, NgSwitchDefault, NgClass, AsyncPipe } from '@angular/common';


import { Observable, map } from 'rxjs';

import { MatStepperModule } from '@angular/material/stepper';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormTemplateModel } from './models/form-template';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CameraComponent } from '../camera/camera.component';
import { Router } from '@angular/router';
import { ChangeListSelectService } from '../../../services/change-list-select.service';


const MATERIAL_IMPORT = [

  MatFormFieldModule,

  MatRadioModule,

  MatButtonModule,

  MatCardModule,

  MatDatepickerModule,

  MatInputModule,

  MatIconModule,

  MatOptionModule,

  MatAutocompleteModule,

  MatSelectModule,

  MatSlideToggleModule,

  MatStepperModule,

  MatCheckboxModule,

]



@Component({

  selector: 'app-dynamic-form',

  standalone: true,

  imports: [FormsModule, ReactiveFormsModule, CommonModule, NgClass, MATERIAL_IMPORT, CameraComponent],

  templateUrl: './dynamic-form.component.html',

  styleUrl: './dynamic-form.component.scss',

  providers: [FormBuilderService]



})

export class DynamicFormComponent implements OnInit {

  private _destroyRef$ = inject(DestroyRef)
  private _fieldControlService = inject(FormBuilderService)
  private _router = inject(Router)
  private _changeListSelectService = inject(ChangeListSelectService)

  @Input() inputForm : Observable<FormTemplateModel> | undefined
  @Input() defaultData : Observable<any> | undefined
  @Input() listName : Observable<string> | undefined



  formData = signal<FormTemplateModel>({} as FormTemplateModel)

  formSubmit = output<string>()
  PrimaryButtonText = input<string>()
  SecondaryButtonText = input<string>()
  TercearyButtonText = input<string>()

  form: FormGroup = new FormGroup({});
  maxDateValidation: DateTime = DateTime.now()






  ngOnInit(): void {
    this.initializeSubscribe()
  }

  initializeSubscribe() {
    this.inputForm?.pipe(
      takeUntilDestroyed(this._destroyRef$)
    ).subscribe({
      next: (data: FormTemplateModel) => {
        this.formData.set(data);
        this.configureForm();
      },
      error: (err) => console.error('Error loading form data', err)
    });

    this.defaultData?.pipe(
      takeUntilDestroyed(this._destroyRef$)
    ).subscribe({
      next: (data: any) => {
        console.log('defaultData', data)
          this.form.patchValue(data);
      }
    });
    this.listName?.pipe(
      takeUntilDestroyed(this._destroyRef$)
    ).subscribe({
      next: (listName: string) => {
        this._changeListSelectService.initialize(listName)
        this.setOptions(listName)
      }
    })


  }
setOptions = (listName: string) => {
  this._changeListSelectService.changeList.pipe(
    takeUntilDestroyed(this._destroyRef$)
  ).subscribe({
    next: (data: any) => {
      console.log('llego')
      const mappedData = data.map((dato: any) => {
        const [key, value] = Object.values(dato);
        return { id: key, name: value };
      });

      this.formData().Fields.forEach((field) => {
      console.log('fieldCode', field.Code)

        if (field.Code === listName) {
      console.log('listName', listName)

          field.Options = mappedData;
        }
      });
    }
  });
}





  configureForm = () => {
    console.log(this.formData().Fields)
    this.form = this._fieldControlService.toFormGroup(this.formData().Fields, this.formData());




  }





  numberOnly(event: any): boolean {

    const charCode = event.which ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {

      // Prevents keypress if it's not a number

      return false;

    }

    return true;

  }





  handlePasteDecimal(e: any) {

    var regex = new RegExp(/^\d*(\.\d{0,2})?$/g);

    if (regex.test(e)) {

      return true;

    }

    return false;

  }







  shouldShowLabel = (code: string): boolean => {

    return !['checkbox', 'image', 'video'].includes(code)

  }



  checkForm = (): boolean => {

    /*     const approvedRange = this.form.controls['DateRangeApproved']

        const dateRange = this.form.controls['DateRange'] */



    /*     if (dateRange && approvedRange) {

          return this.range.invalid || this.ApprovedDateRange.invalid

        }



        if (approvedRange) {

          return this.ApprovedDateRange.invalid

        }



        if (dateRange) {

          return this.range.invalid

        }

     */



    // return this.form.invalid || this.range.invalid || this.ApprovedDateRange.invalid

    return this.form.invalid

  }







  onSubmit() {





    this.formSubmit.emit(JSON.stringify({ form: this.form.getRawValue() }));

    console.log(this.form.getRawValue())



  }
  cleanForm = () =>{
    this.form.reset()
  }
  goToIndex = ( ) =>{
    this._router.navigate(['home'])
  }

}

