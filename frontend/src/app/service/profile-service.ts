import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileModel } from '../model/profile';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })

export class ProfileService {
  private apiUrl = environment.apiUrl + '/profile';
  private translate = inject(TranslateService);
  constructor(private http: HttpClient) { }

  getProfile(images: any, texts: string): Observable<ProfileModel[]> {
    return this.http.get<ProfileModel[]>(
      this.apiUrl + "?lang=" + this.translate.getCurrentLang()
      + "&images=" + images + "&texts=" + texts
    );
  }
}