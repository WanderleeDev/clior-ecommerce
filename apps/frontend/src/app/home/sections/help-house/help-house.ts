import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Dialogue } from '../../../shared/components/dialogue';

@Component({
  selector: 'app-help-house',
  imports: [Dialogue],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './help-house.html',
})
export class HelpHouse {}
