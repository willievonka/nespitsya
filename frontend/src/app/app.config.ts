import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { registerLocaleData } from '@angular/common';
import { provideYConfig, YConfig } from 'angular-yandex-maps-v3';
import localeRu from '@angular/common/locales/ru';
import { environment } from '../environment';
import { TUI_RUSSIAN_LANGUAGE, TUI_LANGUAGE } from '@taiga-ui/i18n';
import { of } from 'rxjs';
import { jwtInterceptorFn } from './children/auth.page/services/jwt.interceptor';


const yandexConfig: YConfig = {
    apikey: environment.yaMapsApiKey,
    lang: 'ru_RU'
};

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(withInterceptors([jwtInterceptorFn])),
        provideAnimations(), 
        provideZoneChangeDetection({ eventCoalescing: true }), 
        provideRouter(routes),
        provideYConfig(yandexConfig), 
        NG_EVENT_PLUGINS,
        { provide: LOCALE_ID, useValue: 'ru-RU' },
        { provide: TUI_LANGUAGE, useValue: of(TUI_RUSSIAN_LANGUAGE) },
    ]
};

registerLocaleData(localeRu, 'ru');