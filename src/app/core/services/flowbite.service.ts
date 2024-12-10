import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FlowbiteService {
  constructor(@Inject(PLATFORM_ID) private platformID: object) {}

  public loadFlowbite() {
    if (isPlatformBrowser(this.platformID)) {
      import('flowbite').then().catch((err) => {
        console.error(`Error loading flowbite: ${err}`);
      });
    }
  }
}
