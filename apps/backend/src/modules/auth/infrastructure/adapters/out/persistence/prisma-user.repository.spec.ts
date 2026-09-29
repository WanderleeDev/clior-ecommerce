import { EmailAlreadyRegisteredError } from '../../../../domain/errors/email-already-registered.error';
import type { PrismaService } from '../../../../../../prisma/prisma.service';
import { PrismaUserRepository } from './prisma-user.repository';

// The adapter only needs a prisma.user surface; keeping the real PrismaService
// (and its generated-client import) out of this suite avoids requiring a database.
jest.mock('../../../../../../prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

type PrismaUserStub = {
  create: jest.Mock;
  findUnique: jest.Mock;
};

function makePrisma(): { user: PrismaUserStub } {
  return {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };
}

function makeRepository(prisma: ReturnType<typeof makePrisma>): PrismaUserRepository {
  return new PrismaUserRepository(prisma as unknown as PrismaService);
}

const storedRow = {
  id: 'user-1',
  email: 'maria@example.com',
  name: 'Maria',
  role: 'customer',
  emailVerifiedAt: null,
  passwordHash: 'hashed:secret-password',
  failedLoginAttempts: 0,
  lockedUntil: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
};

const registerInput = {
  email: 'maria@example.com',
  name: 'Maria',
  password: 'secret-password',
  passwordHash: 'hashed:secret-password',
};

describe('PrismaUserRepository', () => {
  describe('create (M8)', () => {
    it('translates a unique-constraint violation into EmailAlreadyRegisteredError', async () => {
      const prisma = makePrisma();
      const uniqueViolation = Object.assign(
        new Error('Unique constraint failed on the fields: (`email`)'),
        { code: 'P2002', meta: { target: ['email'] } },
      );
      prisma.user.create.mockRejectedValue(uniqueViolation);

      await expect(makeRepository(prisma).create(registerInput)).rejects.toBeInstanceOf(
        EmailAlreadyRegisteredError,
      );
    });

    it('rethrows database errors that are not unique violations untouched', async () => {
      const prisma = makePrisma();
      const dbError = new Error('connection pool exhausted');
      prisma.user.create.mockRejectedValue(dbError);

      await expect(makeRepository(prisma).create(registerInput)).rejects.toThrow(
        'connection pool exhausted',
      );
    });

    it('normalizes the email before persistence', async () => {
      const prisma = makePrisma();
      prisma.user.create.mockResolvedValue({ ...storedRow, email: 'maria@gmail.com' });

      await makeRepository(prisma).create({ ...registerInput, email: '  Maria@Gmail.COM ' });

      expect(prisma.user.create).toHaveBeenCalledTimes(1);
      expect(prisma.user.create.mock.calls[0][0]).toEqual({
        data: {
          email: 'maria@gmail.com',
          name: 'Maria',
          passwordHash: 'hashed:secret-password',
        },
      });
    });
  });

  describe('findByEmail (M13)', () => {
    it('lowercases and trims the email before the unique lookup', async () => {
      const prisma = makePrisma();
      prisma.user.findUnique.mockResolvedValue(null);

      await makeRepository(prisma).findByEmail('  Maria@Gmail.COM ');

      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.user.findUnique.mock.calls[0][0]).toEqual({
        where: { email: 'maria@gmail.com' },
      });
    });
  });

  describe('findById (M6)', () => {
    it('never returns credential or lockout material through findById', async () => {
      const prisma = makePrisma();
      prisma.user.findUnique.mockResolvedValue({
        ...storedRow,
        failedLoginAttempts: 4,
        lockedUntil: new Date('2026-01-01T00:15:00.000Z'),
      });

      const found = await makeRepository(prisma).findById('user-1');

      expect(found).not.toBeNull();
      expect(Object.keys(found as object).sort()).toEqual([
        'createdAt',
        'email',
        'emailVerifiedAt',
        'id',
        'name',
        'role',
      ]);
      expect(found).not.toHaveProperty('passwordHash');
      expect(found).not.toHaveProperty('failedLoginAttempts');
      expect(found).not.toHaveProperty('lockedUntil');
    });
  });
});
