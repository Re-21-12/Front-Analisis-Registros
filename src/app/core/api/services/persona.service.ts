import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../../environment';
import { BaseApiService } from '../interfaces/base-api';
import { Persona } from '../../shared/models/persona';
@Injectable({
  providedIn: 'root'
})
export class PersonaService implements BaseApiService<Persona> {
  private apiUrl = `${environment.apiUrl}Persona`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  private http = inject(HttpClient);

  /**
   * Obtiene todas las Personaes
   */
  getAll(): Observable<Persona[]> {
    return this.http.get<Persona[]>(this.apiUrl).pipe(
      catchError(this.handleError<Persona[]>('getAll', []))
    );
  }

  /**
   * Obtiene una Persona por su código
   */
  getById(id: string): Observable<Persona | null> {
    return this.http.get<Persona>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError<Persona>(`getById id=${id}`))
    );
  }

  /**
   * Crea una nueva Persona
   */
  create(Persona: Persona): Observable<Persona> {
    return this.http.post<Persona>(this.apiUrl, Persona, this.httpOptions).pipe(
      catchError(this.handleError<Persona>('create'))
    );
  }

  /**
   * Actualiza una Persona existente
   */
  update(id: string, Persona: Persona): Observable<boolean> {
    return this.http.put(`${this.apiUrl}/${id}`, Persona, this.httpOptions).pipe(
      map(() => true),
      catchError(this.handleError<boolean>('update'))
    );
  }

  /**
   * Elimina una Persona
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
