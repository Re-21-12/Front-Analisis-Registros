import { Region } from "./region";
import { TipoPersona } from "./tipopersona";

export interface Persona {
  id: number;
  primerNombre: string;
  segundoNombre?: string | null;
  primerApellido: string;
  segundoApellido?: string | null;
  fechaDeNacimiento: string; // ISO string, parse as Date if needed
  tipoDeSangre?: string | null;
  regionId?: number | null;
  tipoPersonaId?: number | null;
  genero?: string | null;
  foto?: Uint8Array | null;
  estado: string;
  region?: Region | null;
  tipoPersona?: TipoPersona | null;
}
