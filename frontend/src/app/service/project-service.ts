import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ProjectModel } from '../model/project';
import { ProjectImageModel } from '../model/project-image';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })

export class ProjectService {
  private apiUrl = environment.apiUrl + '/projects';
  constructor(private http: HttpClient) { }
  
  private translate = inject(TranslateService);

  getProjects(images: any): Observable<ProjectModel[]> {
    var paramImages: string = "";
    if (images == true || parseInt(images) >= 0)
        paramImages = "&images=" + images;
    return this.http.get<ProjectModel[]>(this.apiUrl + "?lang=" + this.translate.getCurrentLang());
  }

  getProject(id: string): Observable<ProjectModel> {
    return this.http.get<ProjectModel>(
      `${this.apiUrl}/${id}` + "?lang=" + this.translate.getCurrentLang()
    );
  }
  
  getProjectRandomImage(id: string): Observable<ProjectImageModel> {
    return this.http.get<ProjectImageModel>(
      `${this.apiUrl}/${id}/images/random` + "?lang=" + this.translate.getCurrentLang()
    );
  }
  
}