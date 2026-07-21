import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { languages } from '../../../package.json';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private translate = inject(TranslateService);
  private cookieService = inject(SsrCookieService);

  private availableLanguages: string[] = languages.available.split('|');
  private defaultLanguage: string = languages.default;

  private isAvailableLanguage(lang: string | null | undefined): lang is string {
    return !!lang && this.availableLanguages.indexOf(lang) !== -1;
  }

  resolveInitialLanguage(): string {
    const cookieLanguage = this.cookieService.get('language');
    if (this.isAvailableLanguage(cookieLanguage)) {
      return cookieLanguage;
    }

    return this.defaultLanguage;
  }

  getRequestLanguage(): string {
    const cookieLanguage = this.cookieService.get('language');
    if (this.isAvailableLanguage(cookieLanguage)) {
      return cookieLanguage;
    }

    const currentLanguage = this.translate.getCurrentLang();
    if (this.isAvailableLanguage(currentLanguage)) {
      return currentLanguage;
    }

    const fallbackLanguage = this.translate.getFallbackLang();
    if (this.isAvailableLanguage(fallbackLanguage)) {
      return fallbackLanguage;
    }

    return this.defaultLanguage;
  }

  applyLanguage(language: string): string {
    const selectedLanguage = this.isAvailableLanguage(language)
      ? language
      : this.defaultLanguage;

    this.cookieService.set('language', selectedLanguage);
    this.translate.use(selectedLanguage);

    return selectedLanguage;
  }
}