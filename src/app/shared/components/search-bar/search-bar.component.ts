import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SpeechRecognitionComponent } from '../../../modules/speech-to-text/components/speech-recognition/speech-recognition.component';
import { SearchSvgComponent } from '../../icons/search-svg.component';

@Component({
  selector: 'app-search-bar',
  imports: [SpeechRecognitionComponent, SearchSvgComponent],
  templateUrl: './search-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent {}
