import { Region } from "./region";
import { TipoPersona } from "./tipopersona";

export interface PersonaResponse {
  id: string;
  primerNombre: string;
  segundoNombre?: string | null;
  primerApellido: string;
  segundoApellido?: string | null;
  fechaDeNacimiento: string; // ISO string (DateOnly en C#)
  tipoDeSangre?: string | null;
  regionId?: number | null;
  tipoPersonaId?: number | null;
  genero?: string | null;
  foto?: Uint8Array | null; // byte[] en C#
  estado: string;
  regionNombre?: string | null;
  tipoPersonaNombre?: string | null;
}
export interface PersonaRequest {
  id?: string | null;
  primerNombre: string;
  segundoNombre?: string | null;
  primerApellido: string;
  segundoApellido?: string | null;
  fechaDeNacimiento: string; // ISO string (DateOnly en C#)
  fechaDeResidencia: string; // ISO string (DateOnly en C#)
  tipoDeSangre?: string | null;
  regionId?: number | null;
  tipoPersonaId?: number | null;
  genero?: string | null;
  foto?: Uint8Array | null; // byte[] en C#
  estado: string;
}
