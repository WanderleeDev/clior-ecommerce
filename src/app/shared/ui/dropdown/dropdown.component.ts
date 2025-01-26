import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  imports: [],
  templateUrl: './dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent {
  dropdownId = input.required<string>();
  ariaLabelledBy = input.required<string>();
}
