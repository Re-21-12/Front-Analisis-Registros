import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { LuxonDateAdapter, MAT_LUXON_DATE_ADAPTER_OPTIONS } from '@angular/material-luxon-adapter';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideHttpClient(),
    {
      provide: DateAdapter,
      useClass: LuxonDateAdapter,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue:{
        parse: {
          dateInput: 'dd/MM/yyyy'
        },
        display:{
          dateInput : 'dd/MM/yyyy',
          monthYearLabel: 'LLL yyyy',
          dateA11yLabel: 'dd/MM/yyyy',
          monthYearA11yLabel: 'LLLL yyyy',
        }
      } },
      {provide: MAT_DATE_LOCALE, useValue: 'es-AR'},
  ]
})
  .catch((err) => console.error(err));
