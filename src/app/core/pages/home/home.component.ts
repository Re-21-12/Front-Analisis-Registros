import { Component, inject, OnInit } from '@angular/core';
import { PrimaryLayoutComponent } from '../../layouts/primary-layout/primary-layout.component';
import { FormComponent } from "../form/form.component";
import { DynamicTableComponent } from "../../shared/components/dynamic-table/dynamic-table.component";
import { PersonaService } from '../../api/services/persona.service';
import { Persona } from '../../shared/models/persona';
import { DynamicCardComponent } from '../../shared/components/dynamic-card/dynamic-card.component';

@Component({
  selector: 'app-home',
  imports: [PrimaryLayoutComponent,  DynamicTableComponent, DynamicCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
 private personService = inject(PersonaService)

  data:Persona[] = []

ngOnInit(): void {
this.getPersonalData()
}

  getPersonalData = () => {

this.personService.getAll().subscribe((data: Persona[]) => {
  this.data = data
})

}

}
