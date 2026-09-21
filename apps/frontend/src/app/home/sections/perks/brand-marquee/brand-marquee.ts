import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgxIconify } from 'ngx-iconify-stack';

@Component({
  selector: 'app-brand-marquee',
  standalone: true,
  imports: [NgxIconify],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './brand-marquee.html',
})
export class BrandMarquee {
  protected readonly claims = [
    'Cuidamos mascotas',
    '+40 marcas aliadas',
    '100% original',
    'Asesoría veterinaria gratis',
  ];

  protected readonly brands = [
    { name: 'CanBo', icon: 'noto:dog-face' },
    { name: 'Ricocat', icon: 'noto:cat-face' },
    { name: 'Mimaskot', icon: 'noto:paw-prints' },
    { name: 'Pro Plan', icon: 'lucide:shield-check' },
    { name: "Hill's", icon: 'lucide:stethoscope' },
    { name: 'Royal Canin', icon: 'lucide:star' },
    { name: 'Pedigree', icon: 'noto:dog' },
    { name: 'Whiskas', icon: 'noto:cat' },
  ];
}
