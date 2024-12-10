import { AfterViewInit, Directive } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Directive({
  selector: '[appRefreshFlowbite]',
  standalone: true,
})
export class RefreshFlowbiteDirective implements AfterViewInit {
  ngAfterViewInit(): void {
    initFlowbite();
  }
}
