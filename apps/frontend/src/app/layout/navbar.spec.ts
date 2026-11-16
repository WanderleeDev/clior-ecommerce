import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import type { User } from '../auth/domain/models/auth.model';
import { AuthStore } from '../auth/presentation/state/auth.store';
import { Navbar } from './navbar';

const user: User = {
  id: 'user-1',
  name: 'Maria Torres',
  email: 'maria@example.com',
  role: 'customer',
  petType: null,
  createdAt: '2024-01-15T12:00:00.000Z',
};

describe('Navbar session awareness', () => {
  beforeEach(async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      }),
    });
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('shows no user name for a visitor', async () => {
    const fixture = TestBed.createComponent(Navbar);
    fixture.detectChanges();
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain('Maria');
  });

  it('shows the signed-in customer name in the header (AC-001-01)', async () => {
    TestBed.inject(AuthStore).set(user);
    const fixture = TestBed.createComponent(Navbar);
    fixture.detectChanges();
    await fixture.whenStable();

    const header = fixture.nativeElement.querySelector('header') as HTMLElement;
    expect(header.textContent).toContain('Maria');
    expect(header.querySelector('a[href="/cuenta"]')).not.toBeNull();
  });
});