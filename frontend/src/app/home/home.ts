import { Component, OnInit, inject } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService, _ } from '@ngx-translate/core';
import { ProjectService } from '../service/project-service';
import { ProfileService } from '../service/profile-service';
import { UtilService } from '../service/util-service';
import { ProjectModel } from '../model/project';
import { environment } from '../../environments/environment';

@Component({ selector: 'app-home', templateUrl: './home.html', styleUrl: './home.scss'})
export class Home implements OnInit {
    projects: ProjectModel[] = [];
    profile: any;
    apiURL: string = environment.apiUrl;
    utilService: UtilService;
    
    private translate = inject(TranslateService)
    

    constructor(
      private projectService: ProjectService, private profileService: ProfileService,
      private titleService: Title, private metaService: Meta,
      private platformLocation: PlatformLocation
    ){
        this.utilService = new UtilService();
        
        // Set meta tags
        const url = this.platformLocation.protocol + "//" + this.platformLocation.hostname;
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
    }
}
