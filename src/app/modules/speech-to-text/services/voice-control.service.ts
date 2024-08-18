/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, afterNextRender, computed, signal } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { ClientLanguageRecognitionService } from './client-language.-recognition.service';
import { Observable } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let webkitSpeechRecognition: any;

interface DataTranscript {
  transcript: string | null;
  error: string | null;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class VoiceControlService {
  #speechRecognition: any | null = null;
  #isEnableSpeechRecognition = new Subject<boolean>();
  #transcriptData = signal<DataTranscript>({
    transcript: null,
    error: null,
    isActive: false,
  });
  #transcriptDataStream = computed(() => this.#transcriptData());

  constructor(
    private readonly languageService: ClientLanguageRecognitionService
  ) {
    afterNextRender(() => {
      if (
        'SpeechRecognition' in window ||
        'webkitSpeechRecognition' in window
      ) {
        this.#speechRecognition = new webkitSpeechRecognition();
        this.setConfig(this.#speechRecognition!);

        return this.#isEnableSpeechRecognition.next(true);
      }

      this.#isEnableSpeechRecognition.next(false);
    });
  }

  public isEnableSpeechRecognition$(): Observable<boolean> {
    return this.#isEnableSpeechRecognition.asObservable();
  }

  public startRecognition(): void {
    this.#speechRecognition?.start();
  }

  public stopRecognition(): void {
    this.#speechRecognition?.stop();
  }

  public getTranscriptDataStream() {
    return this.#transcriptDataStream;
  }

  private setConfig(gramar: any): void {
    if (!this.#speechRecognition) return;

    gramar.lang = this.languageService.clientLanguage || 'en-US';
    gramar.continuous = false;
    gramar.interimResults = true;

    gramar.onstart = () => {
      this.#transcriptData.set({
        transcript: null,
        error: null,
        isActive: true,
      });
    };

    gramar.onresult = (event: any) => {
      console.log(event);

      this.#transcriptData.update((prev) => ({
        ...prev,
        transcript: event.results[0][0].transcript,
      }));
      console.log(this.#transcriptData());

    };

    gramar.onerror = (event: any) => {
      this.#transcriptData.set({
        transcript: null,
        error: event.error,
        isActive: false,
      });

      this.stopRecognition();
    };

    gramar.onend = () => {
      this.#transcriptData.update((prev) => ({
        ...prev,
        isActive: false,
      }));
    };
  }
}
