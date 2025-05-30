import { DateTime } from "luxon";

import {
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  input,
  model,
  OnChanges,
  OnInit,
  output,
  signal,
  SimpleChanges,
  ViewChild,
  viewChild,
} from "@angular/core";

import { MatAutocompleteModule } from "@angular/material/autocomplete";

import { MatButtonModule } from "@angular/material/button";

import { MatCardModule } from "@angular/material/card";

import { MatOptionModule } from "@angular/material/core";

import { MatDatepickerModule } from "@angular/material/datepicker";

import { MatFormFieldModule, MatPrefix } from "@angular/material/form-field";

import { MatIconModule } from "@angular/material/icon";

import { MatInputModule } from "@angular/material/input";

import { MatRadioModule } from "@angular/material/radio";

import { MatSelectModule } from "@angular/material/select";

import { MatSlideToggleModule } from "@angular/material/slide-toggle";

import { FormBuilderService } from "../../../services/form-builder.service";

import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";

import {
  CommonModule,
  NgSwitchDefault,
  NgClass,
  AsyncPipe,
} from "@angular/common";

import { Observable, map } from "rxjs";

import { MatStepperModule } from "@angular/material/stepper";

import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormTemplateModel } from "./models/form-template";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CameraComponent } from "../camera/camera.component";
import { Router } from "@angular/router";
import { ChangeListSelectService } from "../../../services/change-list-select.service";
import { SelectTemplateModel } from "./models/select-template";

export interface DynamicFormStateOptions {
  disabled?: boolean;
  enabled?: boolean;
  reset?: boolean;
  invalid?: boolean;
  submit?: boolean;
}

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
];

@Component({
  selector: "app-dynamic-form",

  standalone: true,

  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgClass,
    MATERIAL_IMPORT,
    CameraComponent,
  ],

  templateUrl: "./dynamic-form.component.html",

  styleUrl: "./dynamic-form.component.scss",

  providers: [FormBuilderService],
})
export class DynamicFormComponent implements OnInit {
  private _destroyRef$ = inject(DestroyRef);
  private _fieldControlService = inject(FormBuilderService);
  private _router = inject(Router);
  private _changeListSelectService = inject(ChangeListSelectService);

  @Input() inputForm: Observable<FormTemplateModel> | undefined;
  @Input() defaultData: Observable<any> | undefined;
  @Input() listName: Observable<string> | undefined;
  @Input() stateForm: Observable<DynamicFormStateOptions> | undefined;
  @Input() dynamicOptions: Observable<SelectTemplateModel> | undefined;
  @Input() horizontalLayout: boolean = false; // Flag para diseño horizontal

  @ViewChild(CameraComponent) cameraComponent!: CameraComponent;

  formData = signal<FormTemplateModel>({} as FormTemplateModel);

  formSubmit = output<string>();
  PrimaryButtonText = input<string>();
  SecondaryButtonText = input<string>();
  TercearyButtonText = input<string>();
  cameraField: any;
  form: FormGroup = new FormGroup({});
  maxDateValidation: DateTime = DateTime.now();
  disabledButton = signal<boolean>(false);

  ngOnInit(): void {
    this.initializeSubscribe();
  }

  initializeSubscribe() {
    this.inputForm?.pipe(takeUntilDestroyed(this._destroyRef$)).subscribe({
      next: (data: FormTemplateModel) => {
        this.formData.set(data);
        this.configureForm();
      },
      error: (err) => console.error("Error loading form data", err),
    });

    this.defaultData?.pipe(takeUntilDestroyed(this._destroyRef$)).subscribe({
      next: (data: any) => {
        this.form.patchValue(data);
      },
    });
    this.listName?.pipe(takeUntilDestroyed(this._destroyRef$)).subscribe({
      next: (listName: string) => {
        this._changeListSelectService.initialize(listName);
        this.setOptions(listName);
      },
    });
    this.stateForm?.pipe(takeUntilDestroyed(this._destroyRef$)).subscribe({
      next: (state: DynamicFormStateOptions) => {
        if (state.disabled) {
          this.form.disable();
        }
        if (state.enabled) {
          this.form.enable();
        }
        if (state.reset) {
          this.form.reset();
        }
        if (state.invalid) {
          this.disabledButton.set(true);
        }
        if (state.submit) {
          this.onSubmit();
        }
      },
    });
    this.dynamicOptions?.pipe(takeUntilDestroyed(this._destroyRef$)).subscribe({
      next: (data: SelectTemplateModel) => {
        Object.keys(data).forEach((fieldCode) => {
          const field = this.formData().Fields.find(
            (f) => f.Code === fieldCode,
          );
          if (field) {
            field.Options = data[fieldCode];
          }
        });
      },
    });
  }

  onImageCaptured(base64Image: string | null) {
    if (this.cameraField && this.form) {
      this.form.get(this.cameraField.Code)?.setValue(base64Image);

      // Si necesitas el base64 puro (sin el prefijo data:image/jpeg;base64,)
      if (base64Image) {
        const pureBase64 = base64Image.split(",")[1];
        console.log("Base64 puro:", pureBase64);
        this.form.get("foto")?.setValue(pureBase64);
      }
    }
  }

  setOptions = (listName: string) => {
    this._changeListSelectService.changeList
      .pipe(takeUntilDestroyed(this._destroyRef$))
      .subscribe({
        next: (data: any) => {
          const mappedData = data.map((dato: any) => {
            const [key, value] = Object.values(dato);
            return { id: key, name: value };
          });

          this.formData().Fields.forEach((field) => {
            if (field.Code === listName) {
              field.Options = mappedData;
            }
          });
        },
      });
  };

  configureForm = () => {
    this.form = this._fieldControlService.toFormGroup(
      this.formData().Fields,
      this.formData(),
    );

    this.formData().Fields.forEach((field) => {
      if (field.Disabled) this.form.get(field.Code)?.disable();
    });
    // Buscar el campo de tipo cámara
    this.cameraField = this.formData().Fields.find(
      (field) => field.TypeField === "image",
    );

    // Si hay un campo de cámara, inicializarlo con null
    if (this.cameraField) {
      this.form.get(this.cameraField.Code)?.setValue(null);
    }
    this.formData().Fields.forEach((field) => {
      this.form.get(field.Code)?.patchValue(field.DefaultValue);
    });

    this.disabledFields();
  };

  disabledFields = () => {
    this.formData().Fields.forEach((field) => {
      if (field.Disabled) {
        this.form.get(field.Code)?.disable();
      }
    });
  };

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
  countFieldsWithoutCamera(): number {
    return this.formData().Fields.filter(
      (f) => f.TypeField !== "image" && !f.Hidden,
    ).length;
  }

  shouldShowLabel = (code: string): boolean => {
    return !["checkbox", "image", "video"].includes(code);
  };

  checkForm = (): boolean => {
    return this.form.invalid;
  };

  // ...existing code...

  onSubmit(): void {
    if (this.form.invalid) return;

    // Formatear fechas si es necesario
    const formValues = this.form.value;
    const formattedValues = { ...formValues };

    this.formData().Fields.forEach((field) => {
      if (field.TypeField === "date" && formValues[field.Code]) {
        const dateValue = formValues[field.Code];
        const parsedDate = DateTime.fromJSDate(new Date(dateValue));
        formattedValues[field.Code] = parsedDate.toFormat("yyyy-MM-dd"); // o .toISO()
        this.form.get(field.Code)?.setValue(formattedValues[field.Code]); // Actualiza el formulario con el valor formateado
      }
    });

    // Establecer la imagen si existe componente de cámara
    if (this.cameraComponent && this.cameraField) {
      const currentImage = this.cameraComponent.getPureBase64();
      if (currentImage) {
        this.form.get(this.cameraField.Code)?.setValue(currentImage);
      }
    }

    const formData = this.form.getRawValue();
    this.formSubmit.emit(JSON.stringify(formData));
    console.log("formData", formData);
  }

  cleanForm = () => {
    this.form.reset();
  };
  goToIndex = () => {
    this._router.navigate([""]);
  };
}
