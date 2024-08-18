import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  model,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-banner-video',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner-video.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerVideoComponent implements AfterViewInit {
  videoRef = viewChild<ElementRef<HTMLVideoElement>>('videoPlayer');
  videoUrl = input.required<string>();
  currentTime = model<number>()

  ngAfterViewInit(): void {
    if (this.videoRef()?.nativeElement instanceof HTMLVideoElement) {
      this.videoRef()!.nativeElement.playbackRate = 0.7;
      this.videoRef()!.nativeElement.muted = true;
    }
  }

  public onProgress(element: HTMLVideoElement): void {
    const currentTimeVideo = Math.trunc(element.currentTime);
    if (currentTimeVideo === this.currentTime()) return;

    this.currentTime.set(currentTimeVideo);
  }
}
