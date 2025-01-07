import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-form-edit-data-user',
    imports: [],
    templateUrl: './form-edit-data-user.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'bg-transparent',
    }
})
export class FormEditDataUserComponent {}
