import { Component, signal } from '@angular/core';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { ContactInfoComponent } from './components/contact-info/contact-info.component';
import { StoreMapComponent } from './components/store-map/store-map.component';
import { StoreDirectionComponent } from './components/store-direction/store-direction.component';
import { SectionLayoutComponent } from '../../layout/section-layout.component';
import { Store } from './interfaces/Store.interface';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    ContactFormComponent,
    ContactInfoComponent,
    StoreMapComponent,
    SectionLayoutComponent,
    StoreDirectionComponent,
    FormsModule,
  ],
  templateUrl: './contact.component.html',
})
export default class ContactComponent {
  readonly centerMap: google.maps.LatLngLiteral = {
    lat: -23.55052,
    lng: -46.633309,
  };
  readonly zoomMap = signal(4);
  readonly cliorStores: Store[] = [
    {
      name: 'VitaFit Manhattan',
      address: '123 Broadway, New York, NY 10007',
      hours: 'Mon-Sat: 9AM-8PM',
      phone: '(212) 555-0123',
    },
    {
      name: 'VitaFit Brooklyn',
      address: '456 Atlantic Ave, Brooklyn, NY 11217',
      hours: 'Mon-Sat: 10AM-7PM',
      phone: '(718) 555-0124',
    },
    {
      name: 'VitaFit Queens',
      address: '789 Queens Blvd, Queens, NY 11375',
      hours: 'Mon-Sat: 9AM-7PM',
      phone: '(347) 555-0125',
    },
  ];
}
