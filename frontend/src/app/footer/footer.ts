import { Component, inject } from '@angular/core';
import { version, author, authorURL, sourceSite, sourceURL, license } from '../../../package.json';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

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
    
    languages = [
        { code: 'es', name: 'Español' },
        { code: 'en', name: 'English' },
        { code: 'eu', name: 'Euskara' },
    ];

    currentLanguage = localStorage.getItem('language');
    
    private translate = inject(TranslateService)
    
    constructor(){
    }
    
    switchLanguage(languageCode: string): void {
        this.currentLanguage = languageCode;
        localStorage.setItem('language', languageCode);
        this.translate.use(languageCode);
        window.location.reload();
    }

}
