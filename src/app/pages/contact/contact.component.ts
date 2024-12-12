import { Component } from '@angular/core';
import { ContactFormComponent } from './components/contact-form.component';
import { ContactInfoComponent } from './components/contact-info.component';
import { StoreListComponent } from './components/stores/store-list.component';
import { StoreMapComponent } from './components/stores/store-map.component';
import { SectionLayoutComponent } from '../../layout/section-layout.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    ContactFormComponent,
    ContactInfoComponent,
    StoreMapComponent,
    StoreListComponent,
    SectionLayoutComponent,
  ],
  templateUrl: './contact.component.html',
})
export default class ContactComponent {}
