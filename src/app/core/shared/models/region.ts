import { Persona } from "./persona";

export interface Region {
  id: number;
  nombre: string;
  personas: Persona[]; // Asegúrate de que 'Persona' esté importado o definido en el mismo archivo
}
