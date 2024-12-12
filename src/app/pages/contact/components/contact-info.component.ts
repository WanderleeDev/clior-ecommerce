import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gray-800 rounded-lg p-6">
      <h3 class="text-xl font-semibold text-white mb-4">Contact Information</h3>
      <div class="space-y-4">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
          </div>
          <div>
            <p class="text-gray-400 text-sm">Phone</p>
            <p class="text-white">+1 (234) 567-8900</p>
          </div>
        </div>
        <div class="flex items-center">
          <div class="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div>
            <p class="text-gray-400 text-sm">Email</p>
            <p class="text-white">supportvitafit.com</p>
          </div>
        </div>
        <div class="flex items-center">
          <div class="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <p class="text-gray-400 text-sm">Working Hours</p>
            <p class="text-white">Mon - Fri: 8:00 AM - 10:00 PM EST</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ContactInfoComponent {}