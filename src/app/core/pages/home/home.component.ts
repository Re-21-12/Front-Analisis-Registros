import { TipoPersona } from './../../shared/models/tipopersona';
import { Component, inject, OnInit, signal } from '@angular/core';
import { PrimaryLayoutComponent } from '../../layouts/primary-layout/primary-layout.component';
import { FormComponent } from "../form/form.component";
import { DynamicTableComponent } from "../../shared/components/dynamic-table/dynamic-table.component";
import { PersonaService } from '../../api/services/persona.service';
import { Persona } from '../../shared/models/persona';
import { DynamicCardComponent } from '../../shared/components/dynamic-card/dynamic-card.component';

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
 private personService = inject(PersonaService)
  data:ChildData[] = []

ngOnInit(): void {
this.getPersonalData()
}


getPersonalData = () => {
  this.personService.getAll().subscribe((data: Persona[]) => {
    this.data = data.map(p => ({
      title: `${p.primerNombre}${p.primerApellido}`.trim(),
      description: `${p.tipoPersona} ${p.estado}`.trim(),
      dataFromPersona: [
        `Fecha de Nacimiento: ${new Date(p.fechaDeNacimiento).toLocaleDateString()}`,
        `Tipo de Sangre: ${p.tipoDeSangre || 'N/A'}`,
        `Genero: ${p.genero || 'N/A'}`,
        `Estado: ${p.estado || 'N/A'} `,
      ],
      image: p.foto ? `data:image/png;base64,${p.foto}` : "N/A"
    }));
  });
}

}
