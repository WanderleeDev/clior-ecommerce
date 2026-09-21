import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgxIconify } from 'ngx-iconify-stack';

interface FilterGroup {
  title: string;
  options: string[];
}

@Component({
  selector: 'app-shop-filters',
  standalone: true,
  imports: [NgxIconify],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shop-filters.html',
  styleUrl: './shop-filters.css',
})
export class ShopFilters {
  protected readonly groups: FilterGroup[] = [
    { title: 'Marca', options: ['CanBo', 'Ricocat', 'PetCare+'] },
    { title: 'Mascota', options: ['Perros', 'Gatos'] },
    { title: 'Categoría', options: ['Alimento', 'Snacks', 'Juguetes', 'Higiene', 'Descanso', 'Paseo'] },
    { title: 'Tipo de producto', options: ['Seco', 'Húmedo', 'Premios', 'Accesorios'] },
    { title: 'Edad', options: ['Cachorro', 'Adulto', 'Senior'] },
    { title: 'Cuidados específicos', options: ['Piel sensible', 'Control de peso', 'Salud dental'] },
    { title: 'Sabor', options: ['Pollo', 'Carne', 'Pescado', 'Cordero'] },
  ];
}
