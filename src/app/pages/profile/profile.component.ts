import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RefreshFlowbiteDirective } from '../../shared/directives/refresh-flo3bite.directive';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  hostDirectives: [RefreshFlowbiteDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProfileComponent {}
