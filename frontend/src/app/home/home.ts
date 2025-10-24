import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
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
      private titleService: Title, private metaService: Meta
    ){
        this.utilService = new UtilService()
        this.translate.use("" + localStorage.getItem("language"));
    }

    ngOnInit(): void {
        this.projectService.getProjects(1).subscribe(data => { this.projects = data; });
        this.profileService.getProfile().subscribe(data => { this.profile = data; });
        this.startInterval();
        this.translate.use("" + localStorage.getItem("language"));
        // Set meta tags
        const url: string = window.location.protocol + "//" + window.location.host;
        this.metaService.addTag({ property: 'canonical', content: url });
        this.metaService.addTag({ property: 'og:url', content: url });
        this.metaService.addTag({ property: 'og:image', content: url + '/img/logo/leather.png' });
        this.translate.get(_('SITE.TITLE')).subscribe((res: string) => {
            this.titleService.setTitle(res);
            this.metaService.addTag({ property: 'og:title', content: res});
            this.metaService.addTag({ property: 'title', content: res});
        });
        this.translate.get(_('SITE.DESCRIPTION')).subscribe((res: string) => {
            this.metaService.addTag({ property: 'og:description', content: res});
            this.metaService.addTag({ property: 'description', content: res});
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
                const src = this.apiURL + image.path;
                const srcset = this.utilService.generateSrcset(this.apiURL + image.path)
                imgAlt.setAttribute("src", src);
                imgAlt.setAttribute("srcset", srcset);
                await this.delay(1000);
                while (imgAlt.complete == false) await this.delay(100);
                img.style.opacity = '0';
                await this.delay(1000);
                img.setAttribute("src", "" + src);
                img.setAttribute("srcset", "" + srcset);
                while (img.complete == false) await this.delay(100);
                img.style.opacity = '1';
                await this.delay(1000);
                imgAlt.removeAttribute("src");
                imgAlt.removeAttribute("srcset");
            });
        }, 2000);
    }
}
