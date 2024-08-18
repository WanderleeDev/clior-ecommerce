import { Injectable, afterRender } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ClientLanguageRecognitionService {
  #clientLanguage: null | string = null;

  constructor() {
    afterRender(() => {
    const language = window.navigator.language || window.navigator.languages[0];

      this.#clientLanguage = language || null;
    });
  }

  set clientLanguage(language: string) {
    if (typeof language === 'string' && language.trim().length > 0) {
      this.#clientLanguage = language;
      return;
    }

    console.error('Language must be a non-empty string');
  }

  get clientLanguage(): string | null {
    return this.#clientLanguage;
  }
}
