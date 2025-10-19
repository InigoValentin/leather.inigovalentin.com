import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileModel } from '../model/profile';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })

export class ProfileService {
  private apiUrl = environment.apiUrl + '/profile';
  constructor(private http: HttpClient) { }

  getProfile(): Observable<ProfileModel[]> {
    return this.http.get<ProfileModel[]>(this.apiUrl + "?lang=" + localStorage.getItem('language'));
  }
}