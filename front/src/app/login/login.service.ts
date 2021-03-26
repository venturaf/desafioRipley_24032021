import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Login } from './login';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    Authorization: 'my-auth-token'
  })
};

@Injectable()
export class LoginsService {
  loginsUrl = 'api/logins';  // URL to web api http://localhost:8080/health
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('LoginsService');
  }

  /** GET logins from the server */
  getLogins(): Observable<Login[]> {
    return this.http.get<Login[]>(this.loginsUrl)
      .pipe(
        catchError(this.handleError('getLogins', []))
      );
  }
}