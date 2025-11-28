import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { BtnBaseComponent } from '../../../../shared/components/btn-base/btn-base.component';
import { CamelCaseToSpacedPipe } from '../../../../shared/pipes/camel-case-to-spaced.pipe';
import { RegisterStore } from '../../store/register/register.store';
import {
  RegisterStep1,
  RegisterStep2,
  Steps
} from '../../store/register/models/RegisterStep.model';

@Component({
  selector: 'app-previous-data-user',
  imports: [KeyValuePipe, BtnBaseComponent, CamelCaseToSpacedPipe],
  templateUrl: './previous-data-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviousDataUserComponent implements OnInit {
  readonly #registerStore = inject(RegisterStore);
  readonly isSubmitting = this.#registerStore.isSubmitting;
  protected dataStep1: RegisterStep1 = {
    name: '',
    surname: '',
    phone: '',
    age: '',
  };

  protected dataStep2: RegisterStep2 = {
    email: '',
    password: '',
    confirmPassword: '',
    secretKey: '',
  };

  ngOnInit(): void {
    if (this.#registerStore.step1()) {
      this.dataStep1 = this.#registerStore.step1()!;
    }

    if (this.#registerStore.step2()) {
      this.dataStep2 = this.#registerStore.step2()!;
    }
  }

  public navigateTo(page: Steps): void {
    this.#registerStore.navigateByStep(page);
  }
}
