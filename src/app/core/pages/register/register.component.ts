import { PrimaryLayoutComponent } from './../../layouts/primary-layout/primary-layout.component';
import { DynamicFormComponent } from './../../shared/components/dynamic-form/dynamic-form.component';
import { Component, DestroyRef, inject, model, OnInit, signal, viewChild } from '@angular/core';
import { PersonaService } from '../../api/services/persona.service';
import { FormTemplateModel } from '../../shared/components/dynamic-form/models/form-template';
import { Forms } from '../../shared/components/dynamic-form/models/form-list';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonaRequest, PersonaResponse } from '../../shared/models/persona';
import { BehaviorSubject } from 'rxjs';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CopyClipboardComponent } from '../../shared/components/copy-clipboard/copy-clipboard.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-register',
  imports: [PrimaryLayoutComponent, DynamicFormComponent,MatStepperModule, MatIconModule, MatButtonModule,NgClass, MatFormFieldModule, CopyClipboardComponent,FormsModule, MatInputModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  ngOnInit(): void {
    this.configureForm()
    this.confirmData()
    // Initialization logic here
  }
  private _router = inject(Router);
  private _personService = inject(PersonaService);
  private _destroyRef$  = inject(DestroyRef);
  private _activatedRoute$ = inject(ActivatedRoute);

  form: FormTemplateModel = {...Forms["persona"]};
  displayForm$ = new BehaviorSubject<FormTemplateModel>({} as FormTemplateModel);
  defaultFormData$ = new BehaviorSubject<any>({});
  listName$ = new BehaviorSubject<string>("");

  AADHAAR = model<string>("");
  stepper = viewChild<MatStepper>('stepper');
  titleForm = signal<string>("Registrar Datos");
  idFromUrl = signal<string>("");
  configureForm = () => {
    this.displayForm$.next(this.form)
    this.listName$.next("regionId")
  }
  confirmData = () =>{

    this.form.Fields.forEach((field) => {
      if(field.Name === "Estado")
        field.DefaultValue = "Confirmado"
      if(field.Name === "AADHAAR"){
        field.Hidden = this.idFromUrl() ? false : true
        field.DefaultValue = this.idFromUrl()
        field.Disabled = true
      }

    })

    this._activatedRoute$.params.subscribe((params) => {
      this.idFromUrl.set (params['id'])
      if (!this.idFromUrl()) return
      this.titleForm.set("Confirmar Datos")
        this._personService.getById(this.idFromUrl()).subscribe((data: PersonaResponse | null) => {
          this.defaultFormData$.next(data)
        })

    })
  }
  goConfirmData = ()=>{
    this._router.navigate(['personas/new-persona', this.AADHAAR()])
  }
goHome = () =>{
        this._router.navigate([''])

}
  listenSubmit = ($event : string) =>{
    const persona: PersonaRequest = JSON.parse($event)
    if(this.idFromUrl()){
      this._personService.update(this.idFromUrl(), persona).subscribe({
        next: (data:boolean) => {
          if  (!data) return
        this.AADHAAR.set(this.idFromUrl())
          this.stepper()!.next();
        },
        error: (error) => {
          console.error('Error updating persona:', error);
        }
      })
    }else{
    this._personService.create(persona).subscribe({
      next: (data:PersonaRequest) => {
       if  (!data) return
        console.log('Persona created successfully:', data);
        this.AADHAAR.set(data.id!)
        this.stepper()!.next();
      },
      error: (error) => {
        console.error('Error creating persona:', error);
      }
    })
    }

  }


}
