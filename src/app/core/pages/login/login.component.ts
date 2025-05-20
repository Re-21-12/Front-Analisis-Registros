import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DynamicFormComponent } from "../../shared/components/dynamic-form/dynamic-form.component";
import { FormTemplateModel } from '../../shared/components/dynamic-form/models/form-template';
import { Forms } from '../../shared/components/dynamic-form/models/form-list';
import { Router } from '@angular/router';
import { PersonaService } from '../../api/services/persona.service';
import { PersonaResponse } from '../../shared/models/persona';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    DynamicFormComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private _router = inject(Router);
  private _personService = inject(PersonaService);
  private _destroyRef = inject(DestroyRef);

  form: FormTemplateModel = { ...Forms["login"] };
  displayForm$ = new BehaviorSubject<FormTemplateModel>(this.form);

  ngOnInit(): void {
    this.configureForm();
  }

  configureForm(): void {
    this.displayForm$.next(this.form);
  }

  listenSubmit($event: string): void {
        const formData = JSON.parse($event)
    const {id} = formData

    this._personService.getById(id).subscribe({
      next: (response: PersonaResponse | null) => {
        if(!response) return
        this._router.navigate(['/home']);
      }
    });
  }
  preregister() {
    this._router.navigate(['personas/new-persona'])
  }
}
// TODO: Falta colocar registro de registrador
