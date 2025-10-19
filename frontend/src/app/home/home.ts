import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService, _ } from '@ngx-translate/core';
import { ProjectService } from '../service/project-service';
import { ProfileService } from '../service/profile-service';
import { UtilService } from '../service/util-service';
import { ProjectModel } from '../model/project';
import { ProfileModel } from '../model/profile';
import { environment } from '../../environments/environment';

@Component({ selector: 'app-home', templateUrl: './home.html', styleUrl: './home.scss'})
export class Home implements OnInit {
    projects: ProjectModel[] = [];
    profile: any;
    private intervalId: any;
    apiURL: string = environment.apiUrl;
    utilService: UtilService;
    
    private translate = inject(TranslateService)

    constructor(
      private projectService: ProjectService, private profileService: ProfileService,
      private titleService: Title
    ){
        this.utilService = new UtilService()
        this.translate.use("" + localStorage.getItem("language"));
    }

    ngOnInit(): void {
        this.projectService.getProjects().subscribe(data => { this.projects = data; });
        this.profileService.getProfile().subscribe(data => { this.profile = data; });
        this.startInterval();
        this.translate.use("" + localStorage.getItem("language"));
        //this.translate.use
        console.log("GETTING TITLE IN " + this.translate.getCurrentLang()  + " OF " + localStorage.getItem("language"));
        this.translate.get(_('SITE.TITLE')).subscribe((res: string) => {
            this.titleService.setTitle(res)
        });
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
