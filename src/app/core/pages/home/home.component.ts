import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { PrimaryLayoutComponent } from "../../layouts/primary-layout/primary-layout.component";
import { DynamicCardComponent } from "../../shared/components/dynamic-card/dynamic-card.component";
import { PersonaService } from "../../api/services/persona.service";
import { PersonaRequest, PersonaResponse } from "../../shared/models/persona";
import { ActivatedRoute } from "@angular/router";
import { LocalStorageService } from "../../services/local-storage.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DynamicFormComponent } from "../../shared/components/dynamic-form/dynamic-form.component";
import { FormTemplateModel } from "../../shared/components/dynamic-form/models/form-template";
import { BehaviorSubject } from "rxjs";
import { Forms } from "../../shared/components/dynamic-form/models/form-list";
import { DateTime } from "luxon";

interface ChildData {
  title: string;
  description: string;
  image: string;
  dataFromPersona: string[];
}

@Component({
  selector: "app-home",
  standalone: true,
  imports: [PrimaryLayoutComponent, DynamicCardComponent, DynamicFormComponent],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  private _personService = inject(PersonaService);
  private _activatedRoute = inject(ActivatedRoute);
  private _localStorage = inject(LocalStorageService);
  private _destroyRef = inject(DestroyRef);

  displayForm$ = new BehaviorSubject<FormTemplateModel>(
    {} as FormTemplateModel,
  );
  form: FormTemplateModel = { ...Forms["search-aadhaar"] };

  data: ChildData[] = [];
  tipoPersona?: string;
  idPersona?: string;
  ngOnInit(): void {
    this.getTipoPersona();
    this.configureForm();
  }

  configureForm() {
    this.displayForm$.next(this.form);
  }

  getTipoPersona(): void {
    this.tipoPersona = this._localStorage
      .getItem("tipoPersonaNombre")
      ?.toString()
      .replace(/"/g, "")
      .trim();
    this.idPersona = this._localStorage
      .getItem("id")
      ?.toString()
      .replace(/"/g, "")
      .trim();

    if (this.tipoPersona === "Administrador") {
      this.getPersonalData();
    }
    if (this.tipoPersona === "Civil") {
      this.getData(this.idPersona!);
    }
    if (this.tipoPersona === "Agente") {
      // A traves de un input debera buscarlo
      // this.getData(this.idPersona!);
    }
  }

  getData(Id: string): void {
    this._personService
      .getById(Id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((data: PersonaResponse | null) => {
        this.data = [
          {
            title: `${data?.id}`.trim(),
            description: `${data?.primerNombre} ${data?.primerApellido}`.trim(),
            dataFromPersona: [
              `Fecha de Nacimiento: ${DateTime.fromFormat(
                data!.fechaDeNacimiento,
                "yyyy-MM-dd",
              ).toFormat("dd/MM/yyyy")}`,
              `Tipo de Sangre: ${data?.tipoDeSangre || "N/A"}`,
              `Genero: ${data?.genero || "N/A"}`,
              `Estado: ${data?.estado || "N/A"}`,
              `Region: ${data?.regionNombre || "N/A"}`,
              `Tipo de Persona: ${data?.tipoPersonaNombre || "N/A"}`,
            ],
            image: `data:image/jpg;base64,${data?.foto}`,
          },
        ];
      });
  }

  getPersonalData(): void {
    this._personService
      .getAll()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((data: PersonaResponse[]) => {
        this.data = data.map((p) => ({
          title: `${p.id}`.trim(),
          description: `${p.primerNombre} ${p.primerApellido}`.trim(),
          dataFromPersona: [
            `Fecha de Nacimiento: ${DateTime.fromFormat(
              p!.fechaDeNacimiento,
              "yyyy-MM-dd",
            ).toFormat("dd/MM/yyyy")}`,
            `Tipo de Sangre: ${p.tipoDeSangre || "N/A"}`,
            `Genero: ${p.genero || "N/A"}`,
            `Estado: ${p.estado || "N/A"}`,
            `Region: ${p.regionNombre || "N/A"}`,
            `Tipo de Persona: ${p.tipoPersonaNombre || "N/A"}`,
          ],
          image: `data:image/jpg;base64,${p.foto}`,
        }));
      });
  }

  listenSubmit = ($event: string) => {
    const data: { id: string } = JSON.parse($event);
    this.getData(data.id!);
  };
}
