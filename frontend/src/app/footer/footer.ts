import { Component, inject } from '@angular/core';
import { version, author, authorURL, sourceSite, sourceURL, license } from '../../../package.json';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../service/language-service';

@Component({
    selector: 'app-footer', templateUrl: './footer.html', styleUrls: ['./footer.scss'],
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
    
    private languageService = inject(LanguageService);
    
    languages = [
        { code: 'es', name: 'Español' },
        { code: 'en', name: 'English' },
        { code: 'eu', name: 'Euskara' },
    ];

    private translate = inject(TranslateService)
    
    constructor(){
        this.currentLanguage = this.languageService.getRequestLanguage();
    }
    
    switchLanguage(languageCode: string): void {
        this.currentLanguage = this.languageService.applyLanguage(languageCode);
        setTimeout(location.reload.bind(location), 100);
    }

}
