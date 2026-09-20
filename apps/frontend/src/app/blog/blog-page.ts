import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { NgxIconify } from 'ngx-iconify-stack';
import { CtaButton } from '../shared/components/cta-button';
import { BLOG_POSTS, CATEGORIES } from './blog-data.adapter';

@Component({
  selector: 'app-blog-page',
  imports: [NgxIconify],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './blog-page.html',
  styleUrl: './blog-page.css',
})
export class BlogPage {
  protected readonly posts = BLOG_POSTS;
  protected readonly categories = CATEGORIES;
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