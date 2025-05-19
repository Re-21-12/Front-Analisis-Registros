import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: DateAdapter,
      useClass: LuxonDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'dd/MM/yyyy',
        },
        display: {
          dateInput: 'dd/MM/yyyy',
          monthYearLabel: 'LLL yyyy',
          dateA11yLabel: 'dd/MM/yyyy',
          monthYearA11yLabel: 'LLLL yyyy',
        }
      }
    },
    { provide: MAT_DATE_LOCALE, useValue: 'es-AR' },
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}
  ]
};
