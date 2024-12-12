import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-store-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gray-800 rounded-lg p-6">
      <h3 class="text-xl font-semibold text-white mb-4">Our Stores</h3>
      <div class="space-y-4">
        <div *ngFor="let store of stores" class="border-b border-gray-700 pb-4 last:border-0">
          <h4 class="text-white font-medium mb-2">{{ store.name }}</h4>
          <p class="text-gray-400 text-sm mb-2">{{ store.address }}</p>
          <div class="flex items-center space-x-4">
            <span class="text-gray-400 text-sm flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {{ store.hours }}
            </span>
            <span class="text-gray-400 text-sm flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              {{ store.phone }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StoreListComponent {
  stores = [
    {
      name: 'VitaFit Manhattan',
      address: '123 Broadway, New York, NY 10007',
      hours: 'Mon-Sat: 9AM-8PM',
      phone: '(212) 555-0123'
    },
    {
      name: 'VitaFit Brooklyn',
      address: '456 Atlantic Ave, Brooklyn, NY 11217',
      hours: 'Mon-Sat: 10AM-7PM',
      phone: '(718) 555-0124'
    },
    {
      name: 'VitaFit Queens',
      address: '789 Queens Blvd, Queens, NY 11375',
      hours: 'Mon-Sat: 9AM-7PM',
      phone: '(347) 555-0125'
    }
  ];
}