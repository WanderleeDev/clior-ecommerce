import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  GoogleMap,
  MapAdvancedMarker,
  MapInfoWindow,
} from '@angular/google-maps';
import { StoreLocation } from '../../interfaces/Store.interface';

@Component({
  selector: 'app-store-map',
  standalone: true,
  imports: [GoogleMap, FormsModule, MapAdvancedMarker, MapInfoWindow],
  templateUrl: './store-map.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreMapComponent {
  readonly infoWindowRef = viewChild.required(MapInfoWindow);
  readonly stores = input.required<StoreLocation[]>();
  readonly center = input.required<google.maps.LatLngLiteral>();
  readonly zoom = model.required<number>();

  public openInfoWindow(marker: MapAdvancedMarker, store: StoreLocation) {
    const content = `
      <article class="flex flex-col gap-2">
        <h3>${store.name}</h3>
        <p>${store.hours}</p>
      </article>
    `;

    this.infoWindowRef().open(marker, false, content);
  }
}
