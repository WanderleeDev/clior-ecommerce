import { Injectable, Signal, computed, signal, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class DarkThemeService {
  #hasDarkMode = signal<boolean>(false);
  #hasDarkModeStream = computed(() => this.#hasDarkMode());

  constructor(@Inject(DOCUMENT) private document: Document) {}

  public verifyTheme(): void {
    // const isDarkModeActive =
    //   localStorage?.getItem('color-theme') === 'dark' ||
    //   (!('color-theme' in localStorage) &&
    //     window.matchMedia('(prefers-color-scheme: dark)').matches);

    // if (!isDarkModeActive) {
    //   this.document.documentElement.classList.remove('dark');
    //   this.#hasDarkMode.set(false);
    //   return;
    // }

    // this.document.documentElement.classList.add('dark');
    // this.#hasDarkMode.set(true);

  //   if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  //     document.documentElement.classList.add('dark');
  // } else {
  //     document.documentElement.classList.remove('dark')
  // }
  }

  public darkModeToggle(): void {
    this.#hasDarkMode.update((prev) => !prev);
  }

  public getDarkModeComputed(): Signal<boolean> {
    return this.#hasDarkModeStream;
  }
}
