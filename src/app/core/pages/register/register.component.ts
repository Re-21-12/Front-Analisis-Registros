import { PrimaryLayoutComponent } from './../../layouts/primary-layout/primary-layout.component';
import { DynamicFormComponent } from './../../shared/components/dynamic-form/dynamic-form.component';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { PersonaService } from '../../api/services/persona.service';
import { FormTemplateModel } from '../../shared/components/dynamic-form/models/form-template';
import { Forms } from '../../shared/components/dynamic-form/models/form-list';
import { ActivatedRoute, Router } from '@angular/router';
import { Persona } from '../../shared/models/persona';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [PrimaryLayoutComponent, DynamicFormComponent, ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  ngOnInit(): void {
    this.setListName()
    // Initialization logic here
  }
  private _router = inject(Router);
  private _personService = inject(PersonaService);
  private _destroyRef$  = inject(DestroyRef);
  private _activatedRoute$ = inject(ActivatedRoute);

  displayForm$ = new BehaviorSubject<FormTemplateModel>({...Forms["persona"]})
  defaultFormData$ = new BehaviorSubject<any>({});
  listName$ = new BehaviorSubject<string>("");


  setListName = () => {
    this.listName$.next("region")
  }
  getData = () =>{
    this._activatedRoute$.params.subscribe((params) => {
      const id = params['id']
      if (!id) return
        this._personService.getById(id).subscribe((data) => {
          this.defaultFormData$.next(data)
        })
    })
  }

  listenSubmit = ($event : any) =>{
    this._personService.create($event).subscribe({
      next: (data) => {
        this._router.navigate(['home'])
      },
      error: (error) => {
        console.error('Error creating persona:', error);
      }
    })
  }


}
