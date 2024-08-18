import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RegisterFormLayoutComponent } from '../../../../../../layout/register-form-layout.component';
import RegisterComponent from "../../register.component";

@Component({
  selector: 'app-confirmation-form',
  standalone: true,
  imports: [RegisterFormLayoutComponent, RegisterComponent],
  templateUrl: './confirmation-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ConfirmationFormComponent {}
