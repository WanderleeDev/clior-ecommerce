import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { BLOG_POSTS, CATEGORIES } from './blog-data.adapter';

export const RECOMMENDED_POSTS = [
  {
    title: 'Todo lo que debes saber sobre la esterilización de gatos',
    image: 'https://blog.superpet.pe/wp-content/uploads/2026/08/Esterilizacion-2-1-768x513.jpg',
    imageAlt: 'Gato esterilizado',
    category: 'Gatos',
    date: 'Abril 22, 2025',
    readTime: '10 min',
    href: 'https://blog.superpet.pe/gatos/esterilizacion-gatos-todo-lo-que-debes-saber/',
  },
  {
    title: '¿Cuándo se celebra el día internacional del Gato?',
    image: 'https://blog.superpet.pe/wp-content/uploads/2026/03/cuando-se-celebra-el-dia-del-gato-768x512.jpeg',
    imageAlt: 'Gato celebrando',
    category: 'Gatos',
    date: 'Abril 22, 2025',
    readTime: '10 min',
    href: 'https://blog.superpet.pe/gatos/cuando-celebra-dia-internacional-gato/',
  },
  {
    title: 'Conoce los tipos de arena para gatos',
    image: 'https://blog.superpet.pe/wp-content/uploads/2026/03/Arena-para-gatos-superpet-768x512.jpg',
    imageAlt: 'Arena para gatos',
    category: 'Gatos',
    date: 'Abril 22, 2025',
    readTime: '10 min',
    href: 'https://blog.superpet.pe/gatos/tipos-arena-gatos/',
  },
];

export const FEATURED_MAIN_POST = {
  title: 'Por qué mi perro es agresivo y cómo manejarlo',
  image: 'https://blog.superpet.pe/wp-content/uploads/2026/08/agresivo-1-1.jpg',
  imageAlt: 'Perro con comportamiento agresivo',
  category: 'Salud y Bienestar',
  date: 'agosto 25, 2026',
  readTime: '6 mins',
  excerpt:
    'Tener un perro agresivo es una situación que puede generar mucha preocupación, frustración y, en algunos casos, miedo. S...',
  href: 'https://blog.superpet.pe/perros/por-que-mi-perro-es-agresivo-causas-senales-como-manejarlo/',
};

export const FEATURED_LIST_POSTS = [
  {
    title: 'Insuficiencia renal en perros: síntomas, causas y qué hacer',
    image: 'https://blog.superpet.pe/wp-content/uploads/2026/08/shutterstock_2122757735-1.jpg',
    imageAlt: 'Perro con insuficiencia renal',
    category: 'Salud y Bienestar',
    date: 'agosto 24, 2026',
    readTime: '5 mins',
    href: 'https://blog.superpet.pe/perros/insuficiencia-renal-perros-sintomas-causas-que-hacer/',
  },
  {
    title: 'Mi perro duerme mucho: ¿es normal?',
    image: 'https://blog.superpet.pe/wp-content/uploads/2026/07/Perrito-durmiendo.jpg',
    imageAlt: 'Perro durmiendo',
    category: 'Salud y Bienestar',
    date: 'julio 2, 2026',
    readTime: '5 mins',
    href: 'https://blog.superpet.pe/perros/mi-perro-duerme-mucho-es-normal/',
  },
  {
    title: 'Tipos de comida para perros: guía completa para elegir la mejor',
    image: 'https://blog.superpet.pe/wp-content/uploads/2026/07/Perrito-comiendo-.jpg',
    imageAlt: 'Perro comiendo',
    category: 'Nutrición',
    date: 'julio 1, 2026',
    readTime: '6 mins',
    href: 'https://blog.superpet.pe/perros/tipos-comida-perros-guia-completa-elegir-mejor/',
  },
];

@Component({
  selector: 'app-blog-page',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './blog-page.html',
  styleUrl: './blog-page.css',
})
export class BlogPage {
  protected readonly posts = BLOG_POSTS;
  protected readonly categories = CATEGORIES;
  protected readonly recommended = RECOMMENDED_POSTS;
  protected readonly featuredMain = FEATURED_MAIN_POST;
  protected readonly featuredList = FEATURED_LIST_POSTS;

  protected readonly activeCategory = signal('Todos');

  protected filteredPosts() {
    const cat = this.activeCategory();
    if (cat === 'Todos') return this.posts;
    return this.posts.filter((p) => p.category === cat);
  }

  protected setCategory(cat: string): void {
    this.activeCategory.set(cat);
  }
}
