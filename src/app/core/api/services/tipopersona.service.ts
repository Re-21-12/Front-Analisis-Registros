import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../../environment';
import { BaseApiService } from '../interfaces/base-api';
import { TipoPersona } from '../../shared/models/tipopersona';

@Injectable({
  providedIn: 'root'
})
export class TipoPersonaService implements BaseApiService<TipoPersona> {
  private apiUrl = `${environment.apiUrl}TipoPersona`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  private http = inject(HttpClient);

  /**
   * Obtiene todas las TipoPersonaes
   */
  getAll(): Observable<TipoPersona[]> {
    return this.http.get<TipoPersona[]>(this.apiUrl).pipe(
      catchError(this.handleError<TipoPersona[]>('getAll', []))
    );
  }

  /**
   * Obtiene una TipoPersona por su código
   */
  getById(id: string): Observable<TipoPersona | null> {
    return this.http.get<TipoPersona>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError<TipoPersona>(`getById id=${id}`))
    );
  }

  /**
   * Crea una nueva TipoPersona
   */
  create(TipoPersona: TipoPersona): Observable<TipoPersona> {
    return this.http.post<TipoPersona>(this.apiUrl, TipoPersona, this.httpOptions).pipe(
      catchError(this.handleError<TipoPersona>('create'))
    );
  }

  /**
   * Actualiza una TipoPersona existente
   */
  update(id: string, TipoPersona: TipoPersona): Observable<boolean> {
    return this.http.put(`${this.apiUrl}/${id}`, TipoPersona, this.httpOptions).pipe(
      map(() => true),
      catchError(this.handleError<boolean>('update'))
    );
  }

  /**
   * Elimina una TipoPersona
   */
  delete(id: string): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.httpOptions).pipe(
      map(() => true),
      catchError(this.handleError<boolean>('delete'))
    );
  }

  /**
   * Manejo de errores centralizado
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Aquí podrías enviar el error a un servicio de logging remoto
      return of(result as T);
    };
  }
}
