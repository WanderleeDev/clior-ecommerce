import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgxIconify } from 'ngx-iconify-stack';
import { SectionTag } from './section-tag';
import { CtaButton } from './cta-button';
import { FAQS } from '../../products/infrastructure/adapters/home-data.adapter';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [NgxIconify, SectionTag, CtaButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './faq.html',
  styleUrl: './faq.css',
})
export class Faq {
  protected readonly faqs = FAQS;
}
