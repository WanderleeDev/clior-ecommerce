import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { NgxIconify } from 'ngx-iconify-stack';

export interface InfoSection {
  title: string;
  text: string;
}

@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [NgxIconify],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-info.html',
  styleUrl: './product-info.css',
})
export class ProductInfo {
  readonly sections = input.required<InfoSection[]>();
}
