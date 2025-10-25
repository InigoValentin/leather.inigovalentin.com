import { Component, OnInit, inject } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService, _, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-profile', templateUrl: './privacy.html', styleUrl: './privacy.scss',
  standalone: true, imports: [TranslatePipe]
})
export class Privacy {
    
    private translate = inject(TranslateService)

    constructor(
      private titleService: Title, private metaService: Meta,
      private platformLocation: PlatformLocation
    ){
        
        // Set meta tags
        const url
          = this.platformLocation.protocol + "//" + this.platformLocation.hostname + "/privacy";
        this.metaService.addTag({ property: 'canonical', content: url });
        this.metaService.addTag({ property: 'og:url', content: url });
        this.metaService.addTag({ property: 'og:image', content: url + '/img/logo/leather.png' });
        this.translate.get(_('PRIVACY.TITLE')).subscribe((resSite: string) => {
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
        this.translate.get(_('PRIVACY.DESCRIPTION')).subscribe((res: string) => {
            this.metaService.addTag({ property: 'og:description', content: res});
            this.metaService.addTag({ property: 'description', content: res});
        });
    }
}
