import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
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
    private platform = inject(PLATFORM_ID)

    constructor(
      private projectService: ProjectService, private profileService: ProfileService,
      private titleService: Title, private metaService: Meta
    ){
        this.utilService = new UtilService();
        
        // Set meta tags
        console.log("TEST");
        //const url: string = this.document.location.protocol + "//" + this.document.location.host;
        const url = "TODO";
        
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

    ngOnInit(): void {
        this.projectService.getProjects(1).subscribe(data => { this.projects = data; });
        this.profileService.getProfile().subscribe(data => { this.profile = data; });
        this.startInterval();
        
    }
  
    private delay(ms: number){ return new Promise(resolve => setTimeout(resolve, ms)); }
  
    startInterval() {
        this.intervalId = setInterval(() => {
            if (!isPlatformBrowser(this.platform)) return;
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
