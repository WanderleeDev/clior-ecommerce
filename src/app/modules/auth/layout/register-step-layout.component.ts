import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { StepperRegisterComponent } from '../components/stepper-register/stepper-register.component';
import { RouterLink } from '@angular/router';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { RegisterStore } from '../store/register/register.store';

@Component({
  selector: 'app-register-step-layout',
  imports: [StepperRegisterComponent, RouterLink, LoaderComponent],
  template: `
    @if (!registerStore.isSubmitting()) {
      <div class="grid gap-16 h-full">
        <app-stepper-register
          [currentStep]="currentStep()"
          class="mx-auto w-full max-w-screen-md lg:max-w-screen-xl self-start"
        />
        <ng-content>
          <app-loader class="h-full" textComplementary="Loading form ..." />
        </ng-content>
        <p
          for="terms"
          class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 text-center pt-4 self-center"
        >
          Already have an account?
          <a
            routerLink="/auth/login"
            class="text-blue-600 hover:underline dark:text-blue-500 cursor-pointer"
            >Enter here</a
          >
        </p>
      </div>
    } @else {
      <app-loader textComplementary="Registering, please wait..." />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterStepLayoutComponent {
  readonly registerStore = inject(RegisterStore);
  readonly currentStep = input.required<number>();
}
