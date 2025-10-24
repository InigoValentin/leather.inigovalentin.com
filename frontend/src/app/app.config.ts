import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideTranslateService, provideTranslateLoader } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideRouter } from '@angular/router';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideTranslateService({
      loader: provideTranslateHttpLoader({prefix: './i18n/', suffix: '.json' }),
      fallbackLang: 'en', lang: 'en'
    }), provideClientHydration(withEventReplay())
  ]
};
