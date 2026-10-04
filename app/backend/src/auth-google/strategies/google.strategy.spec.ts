import { GoogleStrategy } from './google.strategy';

/**
 * Tests para GoogleStrategy.validate().
 *
 * No testeamos el constructor (depende de Passport) sino solo el metodo validate
 * que mapea el profile de Google a nuestro formato de usuario.
 */
describe('GoogleStrategy', () => {
  let strategy: GoogleStrategy;

  beforeEach(() => {
    // El constructor de PassportStrategy requiere ciertos parametros del framework
    // Para evitar problemas, instanciamos con valores minimos via any cast
    strategy = new GoogleStrategy();
  });

  describe('validate', () => {
    it('mapea profile de Google a formato interno de usuario', async () => {
      const mockProfile: any = {
        id: 'google-123',
        name: { givenName: 'Andrew', familyName: 'Licona' },
        emails: [{ value: 'andrew@example.com', verified: true }],
        photos: [{ value: 'https://lh3.googleusercontent.com/abc' }],
      };

      const done = jest.fn();
      await strategy.validate(
        'access-token-123',
        'refresh-token-456',
        mockProfile,
        done,
      );

      expect(done).toHaveBeenCalledWith(null, {
        provider: 'google',
        providerId: 'google-123',
        email: 'andrew@example.com',
        emailVerified: true,
        nombre: 'Andrew Licona',
        avatar: 'https://lh3.googleusercontent.com/abc',
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-456',
      });
    });

    it('maneja nombre sin familyName', async () => {
      const mockProfile: any = {
        id: 'g-1',
        name: { givenName: 'Solo' },
        emails: [{ value: 'solo@test.com', verified: false }],
        photos: [],
      };

      const done = jest.fn();
      await strategy.validate('at', 'rt', mockProfile, done);

      const user = done.mock.calls[0][1];
      expect(user.nombre).toBe('Solo');
      expect(user.emailVerified).toBe(false);
      expect(user.avatar).toBeUndefined();
    });

    it('usa la parte del email como nombre si no hay givenName', async () => {
      const mockProfile: any = {
        id: 'g-2',
        name: { givenName: '' },
        emails: [{ value: 'sinnombre@test.com', verified: true }],
        photos: [],
      };

      const done = jest.fn();
      await strategy.validate('at', 'rt', mockProfile, done);

      const user = done.mock.calls[0][1];
      expect(user.nombre).toBe('sinnombre');
    });
  });
});