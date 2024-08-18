import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SpeechRecognitionComponent } from '../../../modules/speech-to-text/components/speech-recognition/speech-recognition.component';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [NgClass, SpeechRecognitionComponent],
  templateUrl: './search-bar.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent {
  hasMobileVersion = input.required<boolean>();
}
