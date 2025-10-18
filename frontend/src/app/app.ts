import { Component, ViewEncapsulation, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {  } from '@angular/core';
import { TranslateService, TranslatePipe, TranslateDirective } from '@ngx-translate/core';
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
    
    constructor(){
        this.translate.addLangs(['en', 'eu']);
        this.translate.setFallbackLang('es');
        // TODO: Get language from browset if not in storage
        this.translate.use(localStorage.getItem('language') || this.translate.getFallbackLang() || 'es');
    }
}
