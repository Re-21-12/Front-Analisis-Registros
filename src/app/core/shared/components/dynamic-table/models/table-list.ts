import { TableTemplateModel } from "./table-template";

export type TTableList = {
  [key: string]: TableTemplateModel;
};

export const table_list: TTableList = {
  aerolinea: {
    title: 'Aerolinea',
    columns: ['id_aerolinea', 'nombre'],

  },
  avion: {
    title: 'Avion',
    columns: ['id_avion', 'modelo', 'matricula', 'capacidad_total', 'id_aerolinea'],
  },
  aeropuerto: {
    title: 'Aeropuerto',
    columns: ['nombre', 'id_aeropuerto', 'codigo_pais', 'codigo_ciudad'],
  },
  ciudad: {
    title: 'Ciudad',
    columns: ['nombre_ciudad', 'codigo_ciudad', 'codigo_pais'],
  },
  correo_electronico: {
    title: 'Correo Electronico',
    columns: ['correo', 'id_pasajero'],
  },
  pais: {
    title: 'Pais',
    columns: ['nombre_pais', 'codigo_pais'],
  },
  pasajero: {
    title: 'Pasajero',
    columns: [
      'primer_nombre', 'segundo_nombre', 'tercer_nombre',
      'primer_apellido', 'segundo_apellido', 'id_pasajero',
      'pasaporte', 'codigo_pais', 'codigo_ciudad'
    ],
  },
  plaza: {
    title: 'Plaza',
    columns: ['letra_fila', 'numero_plaza'],
  },
  reserva: {
    title: 'Reserva',
    columns: [
      'id_reserva', 'letra_fila', 'numero_plaza',
      'fecha_reserva', 'estado', 'numero_vuelo'
    ],
  },
  telefono: {
    title: 'Telefono',
    columns: ['numero_telefono', 'id_pasajero'],
  },
  vuelo: {
    title: 'Vuelo',
    columns: [
      'numero_vuelo', 'hora_salida', 'hora_llegada',
      'aeropuerto_origen', 'aeropuerto_destino', 'id_avion'
    ],
  }
};
