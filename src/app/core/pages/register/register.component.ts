import { PrimaryLayoutComponent } from "./../../layouts/primary-layout/primary-layout.component";
import {
  DynamicFormComponent,
  DynamicFormStateOptions,
} from "./../../shared/components/dynamic-form/dynamic-form.component";
import {
  Component,
  DestroyRef,
  inject,
  model,
  OnInit,
  signal,
  viewChild,
} from "@angular/core";
import { PersonaService } from "../../api/services/persona.service";
import { FormTemplateModel } from "../../shared/components/dynamic-form/models/form-template";
import { Forms } from "../../shared/components/dynamic-form/models/form-list";
import { ActivatedRoute, Router } from "@angular/router";
import { PersonaRequest, PersonaResponse } from "../../shared/models/persona";
import { BehaviorSubject, Subject } from "rxjs";
import { MatStepper, MatStepperModule } from "@angular/material/stepper";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { NgClass } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CopyClipboardComponent } from "../../shared/components/copy-clipboard/copy-clipboard.component";
import { FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { LocalStorageService } from "../../services/local-storage.service";
import { SelectTemplateModel } from "../../shared/components/dynamic-form/models/select-template";

@Component({
  selector: "app-register",
  imports: [
    PrimaryLayoutComponent,
    DynamicFormComponent,
    MatStepperModule,
    MatIconModule,
    MatButtonModule,
    NgClass,
    MatFormFieldModule,
    CopyClipboardComponent,
    FormsModule,
    MatInputModule,
  ],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.scss",
})
export class RegisterComponent implements OnInit {
  ngOnInit(): void {
    this.getTipoPersona();
    this.confirmData();
    this.configureForm();
    // Initialization logic here
  }
  private _router = inject(Router);
  private _personService = inject(PersonaService);
  private _destroyRef$ = inject(DestroyRef);
  private _activatedRoute$ = inject(ActivatedRoute);
  private _localStorage = inject(LocalStorageService);

  dynamicOptions$ = new BehaviorSubject<SelectTemplateModel>({});
  dynamicOptions: SelectTemplateModel = {};
  form: FormTemplateModel = { ...Forms["persona"] };
  stateForm$ = new BehaviorSubject<DynamicFormStateOptions>({});
  displayForm$ = new BehaviorSubject<FormTemplateModel>(
    {} as FormTemplateModel,
  );
  defaultFormData$ = new BehaviorSubject<any>({});
  listName$ = new BehaviorSubject<string>("");

  AADHAAR = model<string>("");
  stepper = viewChild<MatStepper>("stepper");
  titleForm = signal<string>("Registrar Datos");
  //Esto va a depender de con que cuenta se loguee la persona
  idTipoPersona: number = 2;
  status_create!: string;
  idFromUrl = signal<string>("");
  tipoPersonaNombre: string | undefined;
  idPersona: string | undefined;

  configureForm = () => {
    this.displayForm$.next(this.form);
    this.listName$.next("regionId");
  };
  getTipoPersona = () => {
    this.tipoPersonaNombre = this._localStorage
      .getItem("tipoPersonaNombre")
      ?.toString()
      .replace(/"/g, "")
      .trim();
    this.idPersona = this._localStorage
      .getItem("id")
      ?.toString()
      .replace(/"/g, "")
      .trim();
  };
  confirmData = () => {
    // 1. Primero esperas ambos: data y params
    this._activatedRoute$.data
      .pipe(takeUntilDestroyed(this._destroyRef$))
      .subscribe((data) => {
        if (data["type"]) {
          this.idTipoPersona =
            data["type"]["agent"] || data["type"]["admin"] || 2;
          this.titleForm.set(
            `${
              this.idTipoPersona === 1
                ? "Registrar Agente"
                : this.idTipoPersona === 3
                  ? "Registrar Administrador"
                  : "Registrar Persona"
            }`,
          );
        }

        if (data["status_create"]) {
          this.status_create = data["status_create"];
          this.status_create == "Confirmado"
            ? this.stateForm$.next({ invalid: false, disabled: true })
            : undefined;
        }

        this._activatedRoute$.params
          .pipe(takeUntilDestroyed(this._destroyRef$))
          .subscribe((params) => {
            this.idFromUrl.set(params["id"]);

            // Ahora que tienes status_create e idFromUrl, modificas los campos
            this.form.Fields.forEach((field) => {
              if (field.Name === "Estado") {
                field.Hidden =
                  this.status_create === "Confirmado" ? false : true;
                field.Disabled = true;
              }

              if (field.Name === "AADHAAR") {
                field.Hidden = this.idFromUrl() ? false : true;
                field.DefaultValue = this.idFromUrl();
                field.Disabled = true;
              }

              if (field.Name === "Tipo de Persona") {
                console.log("Agente 1", this.tipoPersonaNombre);
                field.DefaultValue = this.idTipoPersona;
                field.Hidden =
                  this.tipoPersonaNombre === undefined ? true : false;
                if (this.tipoPersonaNombre === "Civil") {
                }
                if (this.tipoPersonaNombre === "Agente") {
                  console.log("Agente 2");
                  this.dynamicOptions[field.Code] = [
                    { name: "Agente", value: "1" },
                    { name: "Civil", value: "2" },
                  ];
                }
                if (this.tipoPersonaNombre === "Administrador") {
                  console.log("Agente 3");
                  this.dynamicOptions[field.Code] = [
                    { name: "Agente", value: "1" },
                    { name: "Civil", value: "2" },
                    { name: "Administrador", value: "3" },
                  ];
                }
                this.dynamicOptions$.next(this.dynamicOptions);
              }
            });

            // Si viene con ID => modo edición
            if (this.idFromUrl()) {
              this.titleForm.set("Confirmar Datos");

              this._personService
                .getById(this.idFromUrl())
                .subscribe((data: PersonaResponse | null) => {
                  console.log("data:", data);
                  data?.estado === "Confirmado"
                    ? this.stateForm$.next({ invalid: true, disabled: true })
                    : undefined;
                  this.defaultFormData$.next(data);
                });
            }
          });
      });

    this.displayForm$.next(this.form);
    console.log("form:", this.form);
    this.listName$.next("regionId");
  };

  goConfirmData = () => {
    this._router.navigate(["personas/new-persona-by-user", this.AADHAAR()]);
  };
  goHome = () => {
    this._router.navigate([""]);
  };
  checkEstado = () => {
    return this.status_create === "Confirmado" ? false : true;
  };
  listenSubmit = ($event: string) => {
    // ! El valor se cambia aca por que hay que intervenir antes de mandar al backend
    const persona: PersonaRequest = JSON.parse($event);
    console.log("estado:", this.status_create);
    const newPersona: PersonaRequest = {
      ...persona,
      estado: this.status_create,
    };

    console.log("persona:", persona);
    if (this.idFromUrl()) {
      this._personService
        .update(this.idFromUrl(), newPersona)
        .pipe(takeUntilDestroyed(this._destroyRef$))
        .subscribe({
          next: (data: boolean) => {
            if (!data) return;
            this.AADHAAR.set(this.idFromUrl());
            this.stepper()!.next();
          },
          error: (error) => {
            console.error("Error updating persona:", error);
          },
        });
    } else {
      this._personService
        .create(newPersona)
        .pipe(takeUntilDestroyed(this._destroyRef$))
        .subscribe({
          next: (data: PersonaRequest) => {
            if (!data) return;
            this.AADHAAR.set(data.id!);
            this.stepper()!.next();
          },
          error: (error) => {
            console.error("Error creating persona:", error);
          },
        });
    }
  };
}
