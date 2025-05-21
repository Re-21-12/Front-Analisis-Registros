import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, catchError, map, of } from "rxjs";
import { environment } from "../../../../environments/environment.dev";
import { BaseApiService } from "../interfaces/base-api";
import { Region } from "../../shared/models/region";

@Injectable({
  providedIn: "root",
})
export class RegionService implements BaseApiService<Region> {
  private apiUrl = `${environment.apiUrl}Region`;
  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "application/json",
    }),
  };

  private http = inject(HttpClient);

  /**
   * Obtiene todas las Regions
   */
  getAll(): Observable<Region[]> {
    return this.http
      .get<Region[]>(this.apiUrl)
      .pipe(catchError(this.handleError<Region[]>("getAll", [])));
  }

  /**
   * Obtiene una Region por ID
   */
  getById(id: string): Observable<Region | null> {
    return this.http
      .get<Region>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError<Region>(`getById id=${id}`)));
  }

  /**
   * Crea una nueva Region
   */
  create(Region: Region): Observable<Region> {
    return this.http
      .post<Region>(this.apiUrl, Region, this.httpOptions)
      .pipe(catchError(this.handleError<Region>("create")));
  }

  /**
   * Actualiza una Region existente
   */
  update(id: string, Region: Region): Observable<boolean> {
    return this.http.put(`${this.apiUrl}/${id}`, Region, this.httpOptions).pipe(
      map(() => true),
      catchError(this.handleError<boolean>("update")),
    );
  }

  /**
   * Elimina una Region
   */
  delete(id: string): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.httpOptions).pipe(
      map(() => true),
      catchError(this.handleError<boolean>("delete")),
    );
  }

  /**
   * Manejo de errores centralizado
   */
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Aquí podrías enviar el error a un servicio de logging remoto
      return of(result as T);
    };
  }
}
