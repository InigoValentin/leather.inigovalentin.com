import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectModel } from '../model/project';
import { ProjectImageModel } from '../model/project-image';
import { environment } from '../../environments/environment';
import { LanguageService } from './language-service';

@Injectable({ providedIn: 'root' })

export class ProjectService {
  private apiUrl = environment.apiUrl + '/projects';
  constructor(private http: HttpClient) { }
  private languageService = inject(LanguageService);

  getProjects(images: any): Observable<ProjectModel[]> {
    const lang = this.languageService.getRequestLanguage();
    let url = this.apiUrl + "?lang=" + lang;

    if (images === true || parseInt(images) >= 0) {
      url += "&images=" + images;
    }

    return this.http.get<ProjectModel[]>(url);
  }

  getProject(id: string): Observable<ProjectModel> {
    const lang = this.languageService.getRequestLanguage();
    return this.http.get<ProjectModel>(
      `${this.apiUrl}/${id}` + "?lang=" + lang
    );
  }
  
  getProjectRandomImage(id: string): Observable<ProjectImageModel> {
    const lang = this.languageService.getRequestLanguage();
    return this.http.get<ProjectImageModel>(
      `${this.apiUrl}/${id}/images/random` + "?lang=" + lang
    );
  }
  
}