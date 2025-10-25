import { Component, OnInit, inject } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService, _ } from '@ngx-translate/core';
import { ProfileService } from '../service/profile-service';
import { UtilService } from '../service/util-service';
import { environment } from '../../environments/environment';

@Component({ selector: 'app-profile', templateUrl: './profile.html', styleUrl: './profile.scss'})
export class Profile implements OnInit {
    profile: any;
    apiURL: string = environment.apiUrl;
    utilService: UtilService;
    
    private translate = inject(TranslateService)
    

    constructor(
      private profileService: ProfileService, private titleService: Title,
      private metaService: Meta, private platformLocation: PlatformLocation
    ){
        this.utilService = new UtilService();
        
        // Set meta tags
        const url
          = this.platformLocation.protocol + "//" + this.platformLocation.hostname + "/profile";
        this.metaService.addTag({ property: 'canonical', content: url });
        this.metaService.addTag({ property: 'og:url', content: url });
        this.metaService.addTag({ property: 'og:image', content: url + '/img/logo/leather.png' });
        this.translate.get(_('SITE.TITLE')).subscribe((resSite: string) => {
            this.translate.get(_('PROFILE.TITLE')).subscribe((resProfile: string) => {
                this.titleService.setTitle(resProfile + " - " + resSite);
                this.metaService.addTag({
                  property: 'og:title', content: resProfile + " - " + resSite
                });
                this.metaService.addTag({
                  property: 'title', content: resProfile + " - " + resSite
                });
            });
        });
        this.translate.get(_('PROFILE.DESCRIPTION')).subscribe((res: string) => {
            this.metaService.addTag({ property: 'og:description', content: res});
            this.metaService.addTag({ property: 'description', content: res});
        });
    }

    ngOnInit(): void {
        this.profileService.getProfile(true, "profile").subscribe(data => { this.profile = data; });
    }
}
