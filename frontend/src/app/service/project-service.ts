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

  getProjects(): Observable<ProjectModel[]> {
    console.log("GETTING ALL PROJECTS: " + this.apiUrl);
    return this.http.get<ProjectModel[]>(this.apiUrl);
  }

  getProject(id: string): Observable<ProjectModel> {
    return this.http.get<ProjectModel>(`${this.apiUrl}/${id}`);
  }
  
  getProjectRandomImage(id: string): Observable<ProjectImageModel> {
    return this.http.get<ProjectImageModel>(`${this.apiUrl}/${id}/images/random`);
  }
}