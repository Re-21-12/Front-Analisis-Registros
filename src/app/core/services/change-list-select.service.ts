import { DestroyRef, inject, Injectable, Injector, Type } from '@angular/core';
import { BaseApiService } from '../api/interfaces/base-api';
import { PersonaService } from '../api/services/persona.service';
import { RegionService } from '../api/services/region.service';
import { TipoPersonaService } from '../api/services/tipopersona.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Injectable({
  providedIn: 'root'
})
export class ChangeListSelectService {

private _injector = inject(Injector)
  private destroyRef$ = inject(DestroyRef)

  changeList = new BehaviorSubject<[]>([])

  currentService: any = null;

  private servicesMap: {[key: string]: Type<BaseApiService<any>>} = {
  'persona': PersonaService,
  'regionId': RegionService,
  'tipo-persona': TipoPersonaService,

};




// Step 1
initialize = (listName: string) => {
  try {

    // Obtenemos el servicio dinámicamente
    this.currentService = this.getCurrentService(listName);

    if (this.currentService) {
      // Llamamos al método del servicio
      this.getAll()
    }


  } catch (error) {
    console.error('Error:', error);
  }
}
//Step 2
getCurrentService(listName:string): any {
  // Obtenemos el tipo de servicio del mapa
  const serviceType = this.servicesMap[listName];

  // Si no existe, retornamos null
  if (!serviceType) return null;

  // Pedimos la instancia al injector
  return this._injector.get(serviceType);
}

//Step 3
getAll = () =>{
  this.currentService.getAll().subscribe({
    next: (data:any) => {
      this.changeList.next(data);
    },
    error: (err:any) => console.error('Error loading data', err)
  });
}




}
