import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  standalone: true,
  template: '',
})
export class RefreshFlowbiteComponent implements OnInit {
  ngOnInit(): void {
    initFlowbite();
    console.log(
      '%cDebug: refresh flowbite',
      'background: #1e40af; color: #93c5fd; padding: 2px 5px; border-radius: 4px; font-weight: bold;',
    );
  }
}
