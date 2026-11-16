import { toUser, type ApiUser } from './auth-user.mapper';

const apiUser: ApiUser = {
  id: 'user-1',
  email: 'maria@example.com',
  name: 'Maria',
  role: 'customer',
  petType: 'cat',
  createdAt: '2024-01-15T12:00:00.000Z',
  emailVerifiedAt: '2024-01-16T12:00:00.000Z',
};

describe('toUser', () => {
  it('maps the public API fields onto the view model', () => {
    const user = toUser(apiUser);

    expect(user).toMatchObject({
      id: 'user-1',
      email: 'maria@example.com',
      name: 'Maria',
      role: 'customer',
      petType: 'cat',
      createdAt: '2024-01-15T12:00:00.000Z',
    });
  });

  it('never carries the verification timestamp into the view model', () => {
    expect(toUser(apiUser)).not.toHaveProperty('emailVerifiedAt');
  });

  it('derives a Spanish member-since label from createdAt', () => {
    expect(toUser(apiUser).memberSince).toBe('enero de 2024');
  });

  it.each([
    ['dog', 'Perro'],
    ['cat', 'Gato'],
    ['small_pet', 'Mascota pequeña'],
  ] as const)('derives the pet label for %s', (petType, label) => {
    expect(toUser({ ...apiUser, petType }).pet).toBe(label);
  });

  it('leaves the pet label unset when no pet type was chosen', () => {
    expect(toUser({ ...apiUser, petType: null }).pet).toBeUndefined();
  });
});