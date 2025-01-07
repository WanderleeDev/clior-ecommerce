import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'app-infinite-slide',
    imports: [],
    templateUrl: './infinite-slide.component.html',
    styleUrl: './infinite-slide.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfiniteSlideComponent {
  readonly numberSlides = input.required<number[], number>({
    transform: (value) => Array.from({ length: value }, (_, i) => i + 1),
  });
  readonly title = input<string>();
  logos = [
    {
      src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/1.png',
      alt: 'Logo 1',
    },
    {
      src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/2.png',
      alt: 'Logo 2',
    },
    {
      src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/3.png',
      alt: 'Logo 3',
    },
    {
      src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/4.png',
      alt: 'Logo 4',
    },
    {
      src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/5.png',
      alt: 'Logo 5',
    },
    {
      src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/6.png',
      alt: 'Logo 6',
    },
    {
      src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/7.png',
      alt: 'Logo 7',
    },
  ];
}
