import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { registerLocaleData } from '@angular/common';
import { provideYConfig, YConfig } from 'angular-yandex-maps-v3';
import localeRu from '@angular/common/locales/ru';
import { environment } from '../environment';


const yandexConfig: YConfig = {
    apikey: environment.yaMapsApiKey,
    lang: 'ru_RU'
};

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(),
        provideAnimations(), 
        provideZoneChangeDetection({ eventCoalescing: true }), 
        provideRouter(routes),
        provideYConfig(yandexConfig), 
        NG_EVENT_PLUGINS,
        { provide: LOCALE_ID, useValue: 'ru-RU' },
    ]
};

registerLocaleData(localeRu, 'ru');