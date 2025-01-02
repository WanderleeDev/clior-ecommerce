import { Component, model, OnInit, signal } from '@angular/core';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { ContactInfoComponent } from './components/contact-info/contact-info.component';
import { StoreMapComponent } from './components/store-map/store-map.component';
import { StoreDirectionComponent } from './components/store-direction/store-direction.component';
import { SectionLayoutComponent } from '../../layout/section-layout.component';
import { StoreLocation, Location } from './interfaces/Store.interface';
import { FormsModule } from '@angular/forms';
import { storeMockup } from './mockup/stores.mockup';
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
  styles: `
    .active-card {
      @apply bg-sky-600/20;
    }
  `,
  templateUrl: './contact.component.html',
})
export default class ContactComponent implements OnInit {
  readonly cliorStores = signal<StoreLocation[]>(storeMockup);
  readonly zoomMap = signal(10);
  readonly currentIndexStore = signal(0);
  readonly centerMap = model.required<google.maps.LatLngLiteral>();

  ngOnInit(): void {
    this.centerMap.set(this.cliorStores()[2].location);
  }

  public showDirection(location: Location, index: number) {
    this.centerMap.set(location);
    this.currentIndexStore.set(index);
  }
}
