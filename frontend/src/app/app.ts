import { Component, ViewEncapsulation, inject } from '@angular/core';
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import { TranslateService, TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { Meta } from '@angular/platform-browser';
import { author, languages} from '../../package.json';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { LanguageService } from './service/language-service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class App {
    
    private translate = inject(TranslateService);
    private languageService = inject(LanguageService);
    
    author: string = author;
    private languages: any = languages;

    constructor(private metaService: Meta, private route: ActivatedRoute){
        this.translate.addLangs(this.languages.available.split("|"));
        this.translate.setFallbackLang(this.languages.default);
        // Detect the best language.
        const lang: string = this.languageService.resolveInitialLanguage();
        this.languageService.applyLanguage(lang);
        // Set meta tags
        this.metaService.addTag({ property: 'author', author });

    }
}