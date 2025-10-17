import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../service/project-service';
import { UtilService } from '../service/util-service';
import { ProjectModel } from '../model/project';
import { environment } from '../../environments/environment';

@Component({ selector: 'app-home', templateUrl: './home.html', styleUrl: './home.scss'})
export class Home implements OnInit {
    projects: ProjectModel[] = [];
    private intervalId: any;
    apiURL: string = environment.apiUrl;
    utilService: UtilService;

    constructor(private projectService: ProjectService){
        this.utilService = new UtilService()
    }

    ngOnInit(): void {
        this.projectService.getProjects().subscribe(data => { this.projects = data; });
        this.startInterval()
    }
  
    private delay(ms: number){ return new Promise(resolve => setTimeout(resolve, ms)); }
  
    startInterval() {
        this.intervalId = setInterval(() => {
            const id: number = this.projects[Math.floor(Math.random() * this.projects.length)].id;
            this.projectService.getProjectRandomImage(id.toString()).subscribe(async image => {
                var img: HTMLImageElement
                  = <HTMLImageElement>document.getElementById("img-project-" + id);
                var imgAlt: HTMLImageElement
                  = <HTMLImageElement>document.getElementById("img-project-" + id + "-alt");
                imgAlt.setAttribute("src", this.apiURL + image.path);
                imgAlt.setAttribute(
                  "srcset", this.utilService.generateSrcset(this.apiURL + image.path)
                );
                await this.delay(1000);
                img.style.opacity = '0';
                await this.delay(1000);
                img.setAttribute("src", "" + imgAlt.getAttribute("src"));
                img.setAttribute("srcset", "" + imgAlt.getAttribute("srcset"));
                img.style.opacity = '1';
                await this.delay(1000);
                imgAlt.removeAttribute("src");
                imgAlt.removeAttribute("srcset");
            });
        }, 2000);
    }
}
