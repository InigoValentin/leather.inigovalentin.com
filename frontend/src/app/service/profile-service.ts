import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileModel } from '../model/profile';
import { environment } from '../../environments/environment';
import { LanguageService } from './language-service';

@Injectable({ providedIn: 'root' })

export class ProfileService {
  private apiUrl = environment.apiUrl + '/profile';
  private languageService = inject(LanguageService);
  constructor(private http: HttpClient) { }

  getProfile(images: any, texts: string): Observable<ProfileModel[]> {
    const lang = this.languageService.getRequestLanguage();
    return this.http.get<ProfileModel[]>(
      this.apiUrl + "?lang=" + lang
      + "&images=" + images + "&texts=" + texts
    );
  }
}