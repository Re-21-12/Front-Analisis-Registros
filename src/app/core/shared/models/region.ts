import { PersonaResponse } from "./persona";

export interface Region {
  id: number;
  nombre: string;
  personas: PersonaResponse[]; // Asegúrate de que 'Persona' esté importado o definido en el mismo archivo
}
