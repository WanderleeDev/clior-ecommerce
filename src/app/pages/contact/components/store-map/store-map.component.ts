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

@Component({
  selector: 'app-store-map',
  standalone: true,
  imports: [GoogleMap, FormsModule, MapAdvancedMarker, MapInfoWindow],
  templateUrl: './store-map.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreMapComponent {
  readonly infoWindowRef = viewChild.required(MapInfoWindow);
  readonly center = input.required<google.maps.LatLngLiteral>();
  readonly zoom = model.required<number>();

  advancedMarkerOptions: google.maps.marker.AdvancedMarkerElementOptions = {
    gmpDraggable: false,
  };
  advancedMarkerPositions: google.maps.LatLngLiteral[] = [];

  addAdvancedMarker(event: google.maps.MapMouseEvent) {
    if (!event.latLng) return;

    this.advancedMarkerPositions.push(event.latLng.toJSON());
    // this.infoWindowRef()?.open({
    //   position: event.latLng,
    // });
  }

  openInfoWindow(marker: MapAdvancedMarker) {
    const content = `
      <div class="flex flex-col gap-2">
        <p class="font-bold">Store name</p>
        <p>Address</p>
      </div>
    `;

    this.infoWindowRef().open(marker, false, content);
  }
}
