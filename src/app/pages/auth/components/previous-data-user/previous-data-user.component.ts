import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AccountData, PersonalData } from '../../interfaces/Form.interface';
import { KeyValuePipe } from '@angular/common';
import { BtnBaseComponent } from '../../../../shared/components/btn-base/btn-base.component';
import { Router } from '@angular/router';
import { CamelCaseToSpacedPipe } from '../../../../shared/pipes/camel-case-to-spaced.pipe';

@Component({
  selector: 'app-previous-data-user',
  imports: [KeyValuePipe, BtnBaseComponent, CamelCaseToSpacedPipe],
  templateUrl: './previous-data-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviousDataUserComponent {
  readonly #router = inject(Router);
  protected readonly personalData: PersonalData = {
    name: '',
    surname: '',
    phone: '',
    age: '',
  };

  protected readonly accountData: Omit<AccountData, 'confirmPassword'> = {
    email: '',
    password: '',
    secretKey: '',
  };

  public navigateTo(page: number): void {
    this.#router.navigate([`/auth/register/step-${page}`]);
  }
}
