import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, input } from '@angular/core';

@Component({
  selector: 'app-single-product',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './single-product.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SingleProductComponent implements OnInit{
  id = input.required<string>()

  ngOnInit(): void {
    console.log(this.id());

  }
}
