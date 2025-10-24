import { Component, ViewEncapsulation, inject } from '@angular/core';
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import { TranslateService, TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Meta } from '@angular/platform-browser';
import { author, languages} from '../../package.json';
import { Header } from './header/header';
import { Footer } from './footer/footer';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  encapsulation: ViewEncapsulation.None,
})
export class App {
    
    private translate = inject(TranslateService);
    
    author: string = author;
    private languages: any = languages;

    /**
     * Selects the best language to serve the page in.
     * 
     * It considers available languages, browser languages, query parameters, local storage...
     * 
     * @return Two letter language code of the language to show the page in.
     */
    private selectLanguage(): string{
        
        let available: String[] = this.languages.available.split("|");
        // If the language is set as a request parameter and its valid, use it.
        const queryLang = new URLSearchParams(window.location.search).get('lang');
        if (queryLang && available.indexOf(queryLang.substring(0, 2).toLowerCase()) != -1)
            return queryLang.substring(0, 2).toLowerCase();

        // If the language has been previously set and a valid one is its in local storage, done.
        if (available.indexOf("" + localStorage.getItem('language')) != -1)
            return "" + localStorage.getItem('language');
        
        // If the language is not set, loop the browser accepted languages.
        // When there is a match with the app available languages, return it.
        for (let l of navigator.languages){
            if ( l.length >= 2 && available.indexOf(l.substring(0, 2).toLowerCase()) != -1)
                return l.substring(0, 2).toLowerCase();
        }
        
        // If everything else failed, return the default language.
        return this.languages.default;
    }
    
    constructor(private metaService: Meta, private route: ActivatedRoute){
        
        this.translate.addLangs(this.languages.available.split("|"));
        this.translate.setFallbackLang(this.languages.default);
        // Detect the best language.
        const lang: string = this.selectLanguage()
        this.translate.use(lang);
        localStorage.setItem('language', lang)
        
        // Set meta tags
        this.metaService.addTag({ property: 'author', author });

    }
}
