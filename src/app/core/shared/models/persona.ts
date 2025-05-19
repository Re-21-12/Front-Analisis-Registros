import { Region } from "./region";

export interface Persona {
  id: number;
  primerNombre: string;
  segundoNombre?: string | null;
  primerApellido: string;
  segundoApellido?: string | null;
  fechaDeNacimiento: string; // Formato ISO, puedes parsear como Date si lo necesitas
  tipoDeSangre?: string | null;
  regionId?: number | null;
  genero?: string | null;
  foto?: Uint8Array | null;
  region?: Region | null;
}

