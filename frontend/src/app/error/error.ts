import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService, _, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-eror', templateUrl: './error.html', styleUrl: './error.scss',
  standalone: true, imports: [TranslatePipe]
})
export class Error {
    
    private translate = inject(TranslateService)
    
    constructor(private titleService: Title, private metaService: Meta){
        
        // Set meta tags
        this.metaService.addTag({ property: 'robots', content: 'noindex, nofollow' });
        this.translate.get(_('ERROR.TITLE')).subscribe((resError: string) => {
            this.translate.get(_('SITE.TITLE')).subscribe((resTitle: string) => {
                this.titleService.setTitle(resError + " - " + resTitle);
                this.metaService.addTag(
                  { property: 'title', content: resError + " - " + resTitle }
                );
                this.metaService.addTag(
                  { property: 'og:title', content: resError + " - " + resTitle }
                );
            });
        });
        this.translate.get(_('ERROR.DESCRIPTION')).subscribe((res: string) => {
            this.metaService.addTag({ property: 'og:description', content: res});
            this.metaService.addTag({ property: 'description', content: res});
        });
    }
}
