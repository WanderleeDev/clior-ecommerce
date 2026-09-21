import { Injectable } from '@angular/core';
import { of, type Observable } from 'rxjs';
import { IMAGES } from '../images.data';
import { ProductRepositoryPort } from '../../domain/ports/out/product-repository.port';
import type { Brand, Category, Product, Review, Testimonial } from '../../domain/models/product.model';

export const CATEGORIES: Category[] = [
  {
    slug: 'perros',
    title: 'Perros',
    tagline: 'Nutrición, juego y paseo',
    description:
      'Alimento balanceado, snacks naturales y juguetes resistentes para todos los tamaños y edades.',
    image: IMAGES.dogsRunning,
    imageAlt: 'Dos perros corriendo felices en un campo verde',
    linkLabel: 'Explorar para perros',
    icon: 'noto:dog-face',
  },
  {
    slug: 'gatos',
    title: 'Gatos',
    tagline: 'Areneros, rascadores y más',
    description:
      'Arena aglomerante, rascadores y alimento premium que hasta el gato más exigente aprueba.',
    image: IMAGES.catPortrait,
    imageAlt: 'Gato atigrado mirando a la cámara',
    linkLabel: 'Explorar para gatos',
    icon: 'noto:cat-face',
  },
  {
    slug: 'accesorios',
    title: 'Accesorios y cuidado',
    tagline: 'Higiene, descanso y viaje',
    description:
      'Camas, correas, shampoo y todo lo necesario para el cuidado diario de tu mascota.',
    image: IMAGES.goldenField,
    imageAlt: 'Perro golden retriever descansando en el campo',
    linkLabel: 'Explorar accesorios',
    icon: 'lucide:backpack',
  },
];

export const SHOP_CATEGORIES: Category[] = [
  {
    slug: 'alimento',
    title: 'Alimento',
    tagline: 'Seco, húmedo y dietas',
    description: 'Alimento balanceado para cada etapa y tamaño.',
    image: IMAGES.puppyBowl,
    imageAlt: 'Perro comiendo de su plato de alimento',
    linkLabel: 'Ver alimento',
    icon: 'noto:dog-face',
  },
  {
    slug: 'snacks',
    title: 'Snacks',
    tagline: 'Premios naturales',
    description: 'Snacks y premios para entrenar y consentir.',
    image: IMAGES.goldenPuppy,
    imageAlt: 'Cachorro golden esperando su premio',
    linkLabel: 'Ver snacks',
    icon: 'lucide:cookie',
  },
  {
    slug: 'juguetes',
    title: 'Juguetes',
    tagline: 'Resistentes y divertidos',
    description: 'Juguetes probados que sí duran.',
    image: IMAGES.puppyToys,
    imageAlt: 'Cachorro jugando con juguetes',
    linkLabel: 'Ver juguetes',
    icon: 'lucide:gamepad-2',
  },
  {
    slug: 'higiene',
    title: 'Higiene',
    tagline: 'Baño y cuidado',
    description: 'Shampoo suave y cuidado diario.',
    image: IMAGES.pugBlanket,
    imageAlt: 'Pug envuelto en una manta después del baño',
    linkLabel: 'Ver higiene',
    icon: 'lucide:shower-head',
  },
  {
    slug: 'descanso',
    title: 'Descanso',
    tagline: 'Camas antiestrés',
    description: 'Camas cómodas para un buen descanso.',
    image: IMAGES.pugTongue,
    imageAlt: 'Pug descansando con la lengua afuera',
    linkLabel: 'Ver camas',
    icon: 'lucide:bed-double',
  },
  {
    slug: 'paseo',
    title: 'Paseo',
    tagline: 'Correas y arneses',
    description: 'Todo para salir a pasear seguro.',
    image: IMAGES.dogBeach,
    imageAlt: 'Perro paseando en la playa con correa',
    linkLabel: 'Ver paseo',
    icon: 'lucide:footprints',
  },
  {
    slug: 'gatos',
    title: 'Gatos',
    tagline: 'Arena y rascadores',
    description: 'Arena, rascadores y torres para gatos.',
    image: IMAGES.kittenFlower,
    imageAlt: 'Gatito jugando junto a flores',
    linkLabel: 'Ver para gatos',
    icon: 'noto:cat-face',
  },
  {
    slug: 'packs',
    title: 'Packs ahorro',
    tagline: 'Combos con descuento',
    description: 'Packs de inicio y combos con descuento.',
    image: IMAGES.kittenHands,
    imageAlt: 'Persona sosteniendo un gatito pequeño',
    linkLabel: 'Ver packs',
    icon: 'lucide:package',
  },
];

export const BRANDS: Brand[] = [
  { name: 'Bark', description: 'Snacks horneados para perros felices.', image: IMAGES.puppyGrass, imageAlt: 'Cachorro jugando en el pasto con un hueso', tags: ['Perros', 'Snacks'] },
  { name: 'Bravecto', description: 'Protección duradera contra pulgas y garrapatas.', image: IMAGES.pugBlanket, imageAlt: 'Pug envuelto en una manta después del baño', tags: ['Perros', 'Gatos', 'Cuidado'] },
  { name: 'Brit Care', description: 'Recetas hipoalergénicas de alta digestibilidad.', image: IMAGES.goldenField, imageAlt: 'Perro golden retriever descansando en el campo', tags: ['Perros', 'Gatos', 'Alimento seco'] },
  { name: 'CanBo', description: 'Nutrición peruana formulada por veterinarios para cada etapa.', image: IMAGES.puppiesEating, imageAlt: 'Cachorros comiendo de sus platos', tags: ['Perros', 'Alimento seco', 'Cachorros'] },
  { name: 'Catit', description: 'Juguetes, bebederos y torres para gatos curiosos.', image: IMAGES.kittenFlower, imageAlt: 'Gatito jugando junto a flores', tags: ['Gatos', 'Juguetes', 'Accesorios'] },
  { name: 'Churu', description: 'El premio cremoso que ningún gato rechaza.', image: IMAGES.catPortrait, imageAlt: 'Gato atigrado mirando a la cámara', tags: ['Gatos', 'Snacks'] },
  { name: 'Dentastix', description: 'Snacks dentales para una sonrisa sana.', image: IMAGES.puppyBowl, imageAlt: 'Perro comiendo de su plato de alimento', tags: ['Perros', 'Snacks', 'Cuidado'] },
  { name: 'Dog Chow', description: 'Alimento diario con proteína de calidad para perros activos.', image: IMAGES.dogsRunning, imageAlt: 'Dos perros corriendo felices en un campo verde', tags: ['Perros', 'Alimento seco', 'Adultos'] },
  { name: 'Drontal', description: 'Desparasitación interna de amplio espectro.', image: IMAGES.dogOwner, imageAlt: 'Perro senior junto a su dueño', tags: ['Perros', 'Gatos', 'Cuidado'] },
  { name: 'Eukanuba', description: 'Rendimiento y energía para perros atléticos.', image: IMAGES.dogBeach, imageAlt: 'Perro paseando en la playa con correa', tags: ['Perros', 'Alimento seco'] },
  { name: 'Fancy Feast', description: 'Recetas gourmet en paté y filetes para gatos.', image: IMAGES.greyCat, imageAlt: 'Gato gris mirando a la cámara', tags: ['Gatos', 'Alimento húmedo'] },
  { name: 'Felix', description: 'Sabor divertido para gatos juguetones.', image: IMAGES.tabbyCat, imageAlt: 'Gato atigrado descansando', tags: ['Gatos', 'Alimento húmedo', 'Snacks'] },
  { name: 'Ferplast', description: 'Accesorios resistentes para el paseo y el hogar.', image: IMAGES.dogFamily, imageAlt: 'Familia con su perro en casa', tags: ['Perros', 'Accesorios', 'Viaje'] },
  { name: 'Fresh Step', description: 'Arena aglomerante con control de olor total.', image: IMAGES.kittenHands, imageAlt: 'Persona sosteniendo un gatito pequeño', tags: ['Gatos', 'Higiene'] },
  { name: 'Friskies', description: 'Sabor irresistible para gatos de todos los días.', image: IMAGES.catPortrait, imageAlt: 'Gato atigrado mirando a la cámara', tags: ['Gatos', 'Alimento seco', 'Adultos'] },
  { name: 'Frontline', description: 'Protección mensual contra pulgas y garrapatas.', image: IMAGES.pugTongue, imageAlt: 'Pug descansando con la lengua afuera', tags: ['Perros', 'Gatos', 'Cuidado'] },
  { name: 'Furminator', description: 'Cuidado del pelaje y control de muda.', image: IMAGES.goldenPuppy, imageAlt: 'Cachorro golden esperando su premio', tags: ['Perros', 'Gatos', 'Higiene'] },
  { name: 'Greenies', description: 'Snacks dentales aprobados por veterinarios.', image: IMAGES.puppyGrass, imageAlt: 'Cachorro jugando en el pasto con un hueso', tags: ['Perros', 'Gatos', 'Snacks'] },
  { name: 'Hartz', description: 'Higiene y juguetes para el día a día.', image: IMAGES.puppyToys, imageAlt: 'Cachorro jugando con juguetes', tags: ['Perros', 'Gatos', 'Higiene'] },
  { name: "Hill's", description: 'Nutrición con respaldo científico para cada necesidad.', image: IMAGES.dogOwner, imageAlt: 'Perro senior junto a su dueño', tags: ['Perros', 'Gatos', 'Dietas'] },
  { name: 'Kong', description: 'Juguetes irrompibles para mentes inquietas.', image: IMAGES.puppyToys, imageAlt: 'Cachorro jugando con juguetes', tags: ['Perros', 'Juguetes'] },
  { name: 'LickiMat', description: 'Alfombras para servir lento y sin ansiedad.', image: IMAGES.puppyBowl, imageAlt: 'Perro comiendo de su plato de alimento', tags: ['Perros', 'Gatos', 'Accesorios'] },
  { name: 'Meow Mix', description: 'El clásico mix que encanta a los gatos.', image: IMAGES.tabbyCat, imageAlt: 'Gato atigrado descansando', tags: ['Gatos', 'Alimento seco'] },
  { name: 'Mimaskot', description: 'La favorita de casa: rica, rendidora y para todas las edades.', image: IMAGES.goldenPuppy, imageAlt: 'Cachorro golden esperando su premio', tags: ['Perros', 'Gatos', 'Alimento seco'] },
  { name: 'Naturalis', description: 'Ingredientes naturales y cuidado diario de la piel.', image: IMAGES.pugBlanket, imageAlt: 'Pug envuelto en una manta después del baño', tags: ['Perros', 'Higiene', 'Cuidado'] },
  { name: 'NexGard', description: 'Protección masticable contra parásitos externos.', image: IMAGES.dogsRunning, imageAlt: 'Dos perros corriendo felices en un campo verde', tags: ['Perros', 'Cuidado'] },
  { name: 'Nutrican', description: 'Energía rendidora para perros de casa y chacra.', image: IMAGES.goldenField, imageAlt: 'Perro golden retriever descansando en el campo', tags: ['Perros', 'Alimento seco'] },
  { name: 'Pedigree', description: 'El clásico que nunca falla para perros felices.', image: IMAGES.dogFamily, imageAlt: 'Familia con su perro en casa', tags: ['Perros', 'Alimento seco', 'Snacks'] },
  { name: 'PetCare+', description: 'Higiene y cuidado diario con ingredientes suaves.', image: IMAGES.dogBeach, imageAlt: 'Perro paseando en la playa con correa', tags: ['Higiene', 'Camas', 'Viaje'] },
  { name: 'Pro Plan', description: 'Nutrición avanzada para un pelaje y energía notables.', image: IMAGES.puppiesEating, imageAlt: 'Cachorros comiendo de sus platos', tags: ['Perros', 'Gatos', 'Alimento seco'] },
  { name: 'Purina One', description: 'Nutrición visible en 28 días para gatos.', image: IMAGES.greyCat, imageAlt: 'Gato gris mirando a la cámara', tags: ['Gatos', 'Alimento seco'] },
  { name: 'Ricocat', description: 'El favorito de los gatos exigentes, ahora con más proteína.', image: IMAGES.kittenFlower, imageAlt: 'Gatito jugando junto a flores', tags: ['Gatos', 'Alimento seco', 'Adultos'] },
  { name: 'Ricocan', description: 'El favorito de los perros peruanos, sabor y energía.', image: IMAGES.puppyGrass, imageAlt: 'Cachorro jugando en el pasto con un hueso', tags: ['Perros', 'Alimento seco', 'Adultos'] },
  { name: 'Royal Canin', description: 'Fórmulas precisas por raza, edad y tamaño.', image: IMAGES.kittenHands, imageAlt: 'Persona sosteniendo un gatito pequeño', tags: ['Perros', 'Gatos', 'Alimento seco'] },
  { name: 'Simparica', description: 'Protección triple en una sola tableta.', image: IMAGES.pugTongue, imageAlt: 'Pug descansando con la lengua afuera', tags: ['Perros', 'Cuidado'] },
  { name: 'Super Can', description: 'Rendidor y sabroso para perros de todos los tamaños.', image: IMAGES.dogsRunning, imageAlt: 'Dos perros corriendo felices en un campo verde', tags: ['Perros', 'Alimento seco'] },
  { name: 'Super Cat', description: 'Arena y alimento pensado para gatos peruanos.', image: IMAGES.catPortrait, imageAlt: 'Gato atigrado mirando a la cámara', tags: ['Gatos', 'Alimento seco', 'Higiene'] },
  { name: 'Thor', description: 'Fuerza y sabor para perros guardianes.', image: IMAGES.dogBeach, imageAlt: 'Perro paseando en la playa con correa', tags: ['Perros', 'Alimento seco'] },
  { name: 'Tidy Cats', description: 'Arena aglutinante con cristales de control.', image: IMAGES.tabbyCat, imageAlt: 'Gato atigrado descansando', tags: ['Gatos', 'Higiene'] },
  { name: 'Trixie', description: 'Accesorios y juguetes para todas las mascotas.', image: IMAGES.puppyToys, imageAlt: 'Cachorro jugando con juguetes', tags: ['Perros', 'Gatos', 'Accesorios'] },
  { name: 'Whiskas', description: 'El antojo felino por excelencia, húmedo y seco.', image: IMAGES.greyCat, imageAlt: 'Gato gris mirando a la cámara', tags: ['Gatos', 'Alimento húmedo', 'Snacks'] },
  { name: 'Zeedog', description: 'Correas y arneses con diseño de otro nivel.', image: IMAGES.dogFamily, imageAlt: 'Familia con su perro en casa', tags: ['Perros', 'Paseo', 'Accesorios'] },
];

export const PRODUCTS: Product[] = [
  {
    id: 'canbo-adulto-15kg',
    brand: 'CanBo',
    name: 'Alimento adulto cordero y arroz 15 kg',
    price: 189.9,
    oldPrice: 219.9,
    rating: 4.8,
    reviews: 342,
    image: IMAGES.puppyBowl,
    imageAlt: 'Perro comiendo de su plato de alimento',
    badge: 'Más vendido',
    category: 'perros',
  },
  {
    id: 'ricocat-adulto-9kg',
    brand: 'Ricocat',
    name: 'Alimento gatos adultos pescado 9 kg',
    price: 129.9,
    rating: 4.7,
    reviews: 218,
    image: IMAGES.greyCat,
    imageAlt: 'Gato gris junto a su alimento',
    category: 'gatos',
  },
  {
    id: 'pelota-resistente',
    brand: 'PetCare+',
    name: 'Pelota interactiva ultra resistente',
    price: 34.9,
    oldPrice: 44.9,
    rating: 4.9,
    reviews: 521,
    image: IMAGES.puppyToys,
    imageAlt: 'Cachorro jugando con juguetes',
    badge: 'Oferta',
    category: 'accesorios',
  },
  {
    id: 'arena-aglomerante-10kg',
    brand: 'PetCare+',
    name: 'Arena aglomerante lavanda 10 kg',
    price: 59.9,
    rating: 4.6,
    reviews: 187,
    image: IMAGES.tabbyCat,
    imageAlt: 'Gato atigrado descansando',
    category: 'gatos',
  },
  {
    id: 'shampoo-avenas-500ml',
    brand: 'PetCare+',
    name: 'Shampoo de avena piel sensible 500 ml',
    price: 42.9,
    rating: 4.8,
    reviews: 96,
    image: IMAGES.pugBlanket,
    imageAlt: 'Pug envuelto en una manta después del baño',
    badge: 'Nuevo',
    category: 'accesorios',
  },
  {
    id: 'snack-pollo-500g',
    brand: 'CanBo',
    name: 'Snacks de pollo deshidratado 500 g',
    price: 27.9,
    rating: 4.9,
    reviews: 264,
    image: IMAGES.goldenPuppy,
    imageAlt: 'Cachorro golden esperando su premio',
    category: 'perros',
  },
  {
    id: 'rascador-torre-120cm',
    brand: 'PetCare+',
    name: 'Torre rascadora 3 niveles 120 cm',
    price: 249.9,
    oldPrice: 299.9,
    rating: 4.7,
    reviews: 143,
    image: IMAGES.kittenFlower,
    imageAlt: 'Gatito jugando junto a flores',
    badge: 'Oferta',
    category: 'gatos',
  },
  {
    id: 'correa-reflectante',
    brand: 'PetCare+',
    name: 'Correa retráctil reflectante 5 m',
    price: 64.9,
    rating: 4.5,
    reviews: 178,
    image: IMAGES.dogBeach,
    imageAlt: 'Perro paseando en la playa con correa',
    category: 'accesorios',
  },
  {
    id: 'cama-antiestres-m',
    brand: 'PetCare+',
    name: 'Cama antiestrés dona talla M',
    price: 119.9,
    rating: 4.8,
    reviews: 203,
    image: IMAGES.pugTongue,
    imageAlt: 'Pug descansando con la lengua afuera',
    category: 'accesorios',
  },
  {
    id: 'kitten-starter-pack',
    brand: 'Ricocat',
    name: 'Pack inicio gatito: alimento + arena + juguete',
    price: 99.9,
    oldPrice: 129.9,
    rating: 4.9,
    reviews: 88,
    image: IMAGES.kittenHands,
    imageAlt: 'Persona sosteniendo un gatito pequeño',
    badge: 'Pack ahorro',
    category: 'gatos',
  },
  {
    id: 'hueso-carnaza-x5',
    brand: 'CanBo',
    name: 'Huesos de carnaza natural x5 und',
    price: 22.9,
    rating: 4.6,
    reviews: 312,
    image: IMAGES.puppyGrass,
    imageAlt: 'Cachorro jugando en el pasto con un hueso',
    category: 'perros',
  },
  {
    id: 'disfraz-halloween',
    brand: 'PetCare+',
    name: 'Disfraz calabaza para perros talla S–L',
    price: 49.9,
    rating: 4.4,
    reviews: 57,
    image: IMAGES.pugCostume,
    imageAlt: 'Pug con disfraz de calabaza',
    badge: 'Temporada',
    category: 'accesorios',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Mi labrador devoraba todo en segundos y con CanBo por fin come tranquilo. El pedido llegó al día siguiente, tal como prometieron.',
    owner: 'Mariana Torres',
    role: 'Mamá de Rocky',
    pet: 'Labrador · 3 años',
    image: IMAGES.dogsRunning,
    imageAlt: 'Perro corriendo feliz en el parque',
  },
  {
    quote:
      'Tengo tres gatos y la arena aglomerante me cambió la vida: cero olor y dura el doble. La suscripción mensual es un golazo.',
    owner: 'Diego Ramírez',
    role: 'Papá de Mishi, Tom y Luna',
    pet: 'Gatos · 2 a 5 años',
    image: IMAGES.catPortrait,
    imageAlt: 'Gato atigrado mirando a la cámara',
  },
  {
    quote:
      'Pedí la torre rascadora un lunes y el miércoles ya estaba armada. Mis muebles por fin descansan y mis gatos no la sueltan.',
    owner: 'Camila Fernández',
    role: 'Mamá de Nala y Simba',
    pet: 'Gatos · 1 y 4 años',
    image: IMAGES.kittenFlower,
    imageAlt: 'Gatito jugando en el jardín',
  },
];

export const REVIEWS: Review[] = [
  {
    author: 'Mariana Torres',
    pet: 'Rocky · Labrador 3 años',
    rating: 5,
    date: 'Hace 2 semanas',
    title: 'Por fin come tranquilo',
    text: 'Mi labrador devoraba todo en segundos y con este alimento come pausado. Se nota la calidad en el pelaje.',
    helpful: 24,
  },
  {
    author: 'Diego Ramírez',
    pet: 'Mishi · Gato 4 años',
    rating: 4,
    date: 'Hace 1 mes',
    title: 'Buen producto, llegó rápido',
    text: 'La transición tomó una semana como indica la guía, pero ahora lo come sin problema. El despacho llegó al día siguiente.',
    helpful: 11,
  },
  {
    author: 'Camila Fernández',
    pet: 'Nala · Golden 2 años',
    rating: 5,
    date: 'Hace 2 meses',
    title: 'Recomendado por nuestra veterinaria',
    text: 'Nos lo recomendó la veterinaria y fue un acierto. Buena digestión y heces firmes desde la primera bolsa.',
    helpful: 8,
  },
];

@Injectable()
export class MockProductAdapter extends ProductRepositoryPort {
  getById(id: string): Observable<Product> {
    const product = PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0];
    return of(product);
  }

  getRelated(id: string): Observable<Product[]> {
    return of(PRODUCTS.filter((p) => p.id !== id).slice(0, 8));
  }

  getAll(): Observable<Product[]> {
    return of(PRODUCTS);
  }

  getByCategory(category: string): Observable<Product[]> {
    return of(PRODUCTS.filter((p) => p.category === category));
  }

  getReviews(_id: string): Observable<Review[]> {
    return of(REVIEWS);
  }
}
