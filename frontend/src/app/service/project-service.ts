import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectModel } from '../model/project';
import { ProjectImageModel } from '../model/project-image';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })

export class ProjectService {
  private apiUrl = environment.apiUrl + '/projects';
  constructor(private http: HttpClient) { }

  getProjects(images: any): Observable<ProjectModel[]> {
    var paramImages: string = "";
    if (images == true || parseInt(images) >= 0)
        paramImages = "&images=" + images;
    return this.http.get<ProjectModel[]>(
      this.apiUrl + "?lang=" + 'es'/* TODO: localStorage.getItem('language')*/ + paramImages
    );
  }

  getProject(id: string): Observable<ProjectModel> {
    return this.http.get<ProjectModel>(
      `${this.apiUrl}/${id}` + "?lang=" + 'es'/* TODO: localStorage.getItem('language')*/
    );
  }
  
  getProjectRandomImage(id: string): Observable<ProjectImageModel> {
    return this.http.get<ProjectImageModel>(
      `${this.apiUrl}/${id}/images/random` + "?lang=" + 'es'/* TODO: localStorage.getItem('language')*/
    );
  }
  
}