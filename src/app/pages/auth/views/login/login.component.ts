import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { errorTailorImports } from '@ngneat/error-tailor';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/store/models/App.model';
import { AUTH_ACTIONS } from '../../../../core/store/auth/auth.actions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, errorTailorImports],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent {
  readonly #store: Store<AppState> = inject(Store);
  readonly #formBuilder = inject(FormBuilder);
  formLogin = this.#formBuilder.nonNullable.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
    hasAutoSave: [false],
  });

  public onSubmit(): void {
    if (this.formLogin.invalid) return;

    const { email, password } = this.formLogin.getRawValue();
    this.#store.dispatch(AUTH_ACTIONS.login({ email, password }));
  }
}
