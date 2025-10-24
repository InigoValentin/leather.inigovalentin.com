import { Component, inject } from '@angular/core';
import { version, author, authorURL, sourceSite, sourceURL, license } from '../../../package.json';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Component({
    selector: 'app-footer', templateUrl: './footer.html', styleUrl: './footer.scss',
    standalone: true, imports: [TranslatePipe]
 })
export class Footer{
    version: string = version;
    author: string = author;
    authorURL: string = authorURL;
    sourceSite: string = sourceSite;
    sourceURL: string = sourceURL;
    license: string = license;
    currentLanguage: string; 
    
    private cookieService = inject(SsrCookieService)
    
    languages = [
        { code: 'es', name: 'Español' },
        { code: 'en', name: 'English' },
        { code: 'eu', name: 'Euskara' },
    ];

    private translate = inject(TranslateService)
    
    constructor(){
        this.currentLanguage = this.translate.getCurrentLang();
    }
    
    switchLanguage(languageCode: string): void {
        this.currentLanguage = languageCode;
        this.cookieService.set('language', languageCode);
        this.translate.use(languageCode);
        setTimeout(location.reload.bind(location), 100);
    }

}
