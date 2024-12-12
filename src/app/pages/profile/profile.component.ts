import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RefreshFlowbiteComponent } from '../../shared/directives/refresh-flobite.componet';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  hostDirectives: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProfileComponent extends RefreshFlowbiteComponent {}
