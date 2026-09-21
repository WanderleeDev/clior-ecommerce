import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navbar } from './layout/navbar';
import { Footer } from './layout/footer';
import { MobileCta } from './layout/mobile-cta';
import { CookieBanner } from './layout/cookie-banner';

@Component({
  imports: [RouterModule, Navbar, Footer, MobileCta, CookieBanner],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'Clior Pets';
}
