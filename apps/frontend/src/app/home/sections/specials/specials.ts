import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-specials',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './specials.html',
})
export class Specials {
  protected readonly specials = [
    {
      eyebrow: 'Especial',
      title: 'Cachorros',
      heading: 'Para tu cachorrito',
      text: 'Pañales, juguetes y accesorios ideales para sus primeros pasos',
      href: '/catalogo?etapa=cachorros',
      bg: 'bg-sky-400',
      image:
        'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop',
      imageAlt: 'Cachorro golden retriever sonriendo',
    },
    {
      eyebrow: 'Especial',
      title: 'Gatitos',
      heading: 'Para tu gatito',
      text: 'Rascadores, camas, arenas... todo el mundo gatuno a un click!',
      href: '/catalogo?etapa=gatitos',
      bg: 'bg-orange-200',
      image:
        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600&auto=format&fit=crop',
      imageAlt: 'Gatito gris mirando a la cámara',
    },
    {
      eyebrow: 'Especial',
      title: 'Seniors',
      heading: 'Para tu fiel amigo',
      text: 'Alimentos y productos para el cuidado de tu fiel amigo',
      href: '/catalogo?etapa=seniors',
      bg: 'bg-stone-300',
      image:
        'https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=600&auto=format&fit=crop',
      imageAlt: 'Perro senior junto a su dueño',
    },
  ];
}
