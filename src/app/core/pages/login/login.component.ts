import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import {
  DynamicFormComponent,
  DynamicFormStateOptions,
} from "../../shared/components/dynamic-form/dynamic-form.component";
import { FormTemplateModel } from "../../shared/components/dynamic-form/models/form-template";
import { Forms } from "../../shared/components/dynamic-form/models/form-list";
import { Router } from "@angular/router";
import { PersonaService } from "../../api/services/persona.service";
import { PersonaResponse } from "../../shared/models/persona";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { LocalStorageService } from "../../services/local-storage.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    DynamicFormComponent,
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  private _router = inject(Router);
  private _personService = inject(PersonaService);
  private _destroyRef = inject(DestroyRef);
  private _localStorage = inject(LocalStorageService);

  form: FormTemplateModel = { ...Forms["login"] };
  displayForm$ = new BehaviorSubject<FormTemplateModel>(this.form);
  stateForm$ = new BehaviorSubject<DynamicFormStateOptions>({});
  // Propiedades para las animaciones
  titleLetters: string[] = [];
  particles: any[] = [];
  id: string = "";

  ngOnInit(): void {
    this.configureForm();
    this.initializeAnimations();
  }

  configureForm(): void {
    this.displayForm$.next(this.form);
  }

  private initializeAnimations(): void {
    // Separar el título en letras para la animación
    const title = "Bienvenido";
    this.titleLetters = title.split("");

    // Generar partículas aleatorias
    this.generateParticles();
  }

  private generateParticles(): void {
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: Math.random() * 100,
        delay: Math.random() * 6,
      });
    }
  }

  listenSubmit($event: string): void {
    const formData = JSON.parse($event);
    const { id } = formData;
    if (!id) return;
    this.id = id;
    this._personService
      .getById(id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response: PersonaResponse | null) => {
          if (!response) return;
          this._localStorage.setItem(
            "tipoPersonaNombre",
            JSON.stringify(response.tipoPersonaNombre),
          );
          this._localStorage.setItem("id", JSON.stringify(response.id));
          this._router.navigate(["/personas"]);
        },
      });
  }

  preregister(): void {
    this._router.navigate(["personas/new-persona-by-user"]);
  }

  confirm(): void {
    this.stateForm$.next({
      submit: true,
    });

    this._router.navigate(["personas/new-persona-by-user", this.id]);
  }
}
// TODO: Falta colocar registro de registrador
