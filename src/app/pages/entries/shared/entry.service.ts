import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';

import { Entry } from './entry.model';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private apiPath: string = "api/entries";

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<Entry[]> {
    return this.http.get(`${this.apiPath}`).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntries)
    );
  }

  getById(id: number): Observable<Entry> {
    return this.http.get(`${this.apiPath}/${id}`).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntry)
    );
  }

  create(entry: Entry): Observable<Entry> {
    return this.http.post(`${this.apiPath}`, entry).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntry)
    );
  }

  update(entry: Entry): Observable<Entry> {
    return this.http.put(`${this.apiPath}/${entry.id}`, entry).pipe(
      catchError(this.handleError),
      map(() => entry)
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiPath}/${id}`).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }

  private jsonDataToEntries(jsonData: any[]): Entry[] {
    return jsonData.map(element => Object.assign(new Entry(), element));
  }

  private jsonDataToEntry(jsonData: any): Entry {
    return Object.assign(new Entry(), jsonData);
  }

  private handleError(error: any): Observable<any> {
    console.error("ERRO NA REQUISÇÂO => " ,error);
    return throwError(error);
  }
}
