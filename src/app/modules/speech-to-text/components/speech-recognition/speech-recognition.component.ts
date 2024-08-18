import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from '@angular/core';
import { MicrophoneComponent } from '../../assets/microphone.component';
import { BarsComponent } from '../../assets/bars.component';
import { AsyncPipe, JsonPipe, NgClass } from '@angular/common';
import { VoiceControlService } from '../../services/voice-control.service';

@Component({
  selector: 'app-speech-recognition',
  standalone: true,
  imports: [MicrophoneComponent, BarsComponent, NgClass, AsyncPipe, JsonPipe],
  templateUrl: './speech-recognition.component.html',
  styleUrl: './speech-recognition.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeechRecognitionComponent {
  readonly COLOR_ICON = 'currentColor';
  readonly SIZE_ICON = 25;
  customClass = input<string>('');
  hasSpeechRecognitionSupport = this.voiceControl.isEnableSpeechRecognition$();
  isActiveSpeechRecognition = model<boolean>(false);
  transcriptData = this.voiceControl.getTranscriptDataStream();
  labelButton = computed(() =>
    this.isActiveSpeechRecognition()
      ? 'Stop Speech Recognition'
      : 'Start Speech Recognition'
  );

  constructor(private readonly voiceControl: VoiceControlService) {}

  public toggleSpeechRecognition(): void {
    this.isActiveSpeechRecognition.update((prev) => !prev);

    if (this.isActiveSpeechRecognition()) {
      return this.voiceControl.startRecognition();
    }
    console.log(this.transcriptData);
    this.voiceControl.stopRecognition();
  }
}
