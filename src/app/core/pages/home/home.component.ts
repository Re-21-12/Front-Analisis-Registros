import { TipoPersona } from './../../shared/models/tipopersona';
import { Component, inject, OnInit, signal } from '@angular/core';
import { PrimaryLayoutComponent } from '../../layouts/primary-layout/primary-layout.component';
import { FormComponent } from "../form/form.component";
import { DynamicTableComponent } from "../../shared/components/dynamic-table/dynamic-table.component";
import { PersonaService } from '../../api/services/persona.service';
import { PersonaResponse } from '../../shared/models/persona';
import { DynamicCardComponent } from '../../shared/components/dynamic-card/dynamic-card.component';
import { ActivatedRoute } from '@angular/router';

interface ChildData {
  title: string;
  description: string;
  image: string;
  dataFromPersona: string[];
}
@Component({
  selector: 'app-home',
  imports: [PrimaryLayoutComponent, DynamicCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
 private _personService = inject(PersonaService)
  private _activatedRoute$ = inject(ActivatedRoute);

 data:ChildData[] = []

ngOnInit(): void {
this.getPersonalData()
}


getPersonalData = () => {
  this._personService.getAll().subscribe((data: PersonaResponse[]) => {
    this.data = data.map(p => ({
      title: `${p.id}`.trim(),
      description: `${p.primerNombre}${p.primerApellido}`.trim(),
      dataFromPersona: [
        `Fecha de Nacimiento: ${new Date(p.fechaDeNacimiento).toLocaleDateString()}`,
        `Tipo de Sangre: ${p.tipoDeSangre || 'N/A'}`,
        `Genero: ${p.genero || 'N/A'}`,
        `Estado: ${p.estado || 'N/A'} `,
        `Region: ${p.regionNombre || 'N/A'}`,
        `Tipo de Persona: ${p.tipoPersonaNombre || 'N/A'}`,
      ],
      image:  `data:image/jpg;base64,${p.foto}`
    }));
  });
}

}
