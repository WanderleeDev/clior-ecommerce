import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-register',
    imports: [RouterOutlet],
    template: ` <router-outlet /> `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class RegisterComponent {}
