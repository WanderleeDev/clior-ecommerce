import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-slide',
  imports: [],
  templateUrl: './slide.component.html',
  styleUrl: './slide.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideComponent { }
