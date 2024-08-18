import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { StepperRegisterComponent } from '../pages/home/views/register/component/stepper-register/stepper-register.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LoaderComponent } from '../shared/components/loader/loader.component';

@Component({
  selector: 'app-register-form-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    StepperRegisterComponent,
    RouterLink,
    LoaderComponent,
  ],
  template: `
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
          routerLink="/register"
          class="text-blue-600 hover:underline dark:text-blue-500 cursor-pointer"
          >Enter here</a
        >
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormLayoutComponent {
  currentStep = input.required<number>();
}
