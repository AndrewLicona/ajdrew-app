import { TemplateRenderer } from './template-renderer.service';

describe('TemplateRenderer', () => {
  let renderer: TemplateRenderer;

  beforeEach(() => {
    renderer = new TemplateRenderer();
  });

  describe('render - placeholders simples', () => {
    it('reemplaza un placeholder básico', () => {
      expect(renderer.render('Hola {{nombre}}', { nombre: 'Andrew' })).toBe('Hola Andrew');
    });

    it('reemplaza múltiples placeholders', () => {
      expect(
        renderer.render('{{titulo}} - {{premio}}', {
          titulo: 'Sorteo PS5',
          premio: 'PS5',
        }),
      ).toBe('Sorteo PS5 - PS5');
    });

    it('devuelve string vacío si template es null o undefined', () => {
      expect(renderer.render(null, {})).toBe('');
      expect(renderer.render(undefined, {})).toBe('');
      expect(renderer.render('', {})).toBe('');
    });

    it('reemplaza con string vacío cuando el valor es undefined/null', () => {
      expect(renderer.render('{{a}}-{{b}}', { a: 'foo', b: undefined })).toBe('foo-');
      expect(renderer.render('{{a}}-{{b}}', { a: 'foo', b: null })).toBe('foo-');
    });

    it('tolera espacios dentro del placeholder', () => {
      expect(renderer.render('{{ nombre }}', { nombre: 'X' })).toBe('X');
    });
  });

  describe('render - placeholders anidados', () => {
    it('resuelve notación de puntos', () => {
      expect(
        renderer.render('Juego: {{juego.nombre}}', {
          juego: { nombre: 'Clash Royale' },
        }),
      ).toBe('Juego: Clash Royale');
    });

    it('resuelve múltiples niveles', () => {
      expect(
        renderer.render('{{a.b.c}}', { a: { b: { c: 'deep' } } }),
      ).toBe('deep');
    });

    it('devuelve vacío si el path no existe', () => {
      expect(
        renderer.render('{{juego.nombre.inexistente}}', {
          juego: { nombre: 'X' },
        }),
      ).toBe('');
    });
  });

  describe('render - condicionales', () => {
    it('incluye el bloque si el valor es truthy', () => {
      expect(
        renderer.render('{{#if activo}}ON{{/if}}', { activo: true }),
      ).toBe('ON');
      expect(
        renderer.render('{{#if activo}}ON{{/if}}', { activo: 'yes' }),
      ).toBe('ON');
      expect(
        renderer.render('{{#if activo}}ON{{/if}}', { activo: 1 }),
      ).toBe('ON');
    });

    it('excluye el bloque si el valor es falsy', () => {
      expect(
        renderer.render('{{#if activo}}ON{{/if}}', { activo: false }),
      ).toBe('');
      expect(
        renderer.render('{{#if activo}}ON{{/if}}', { activo: '' }),
      ).toBe('');
      expect(
        renderer.render('{{#if activo}}ON{{/if}}', { activo: undefined }),
      ).toBe('');
      expect(
        renderer.render('{{#if activo}}ON{{/if}}', { activo: 0 }),
      ).toBe('');
    });

    it('soporta condicionales con path anidado', () => {
      expect(
        renderer.render('{{#if juego.nombre}}J: {{juego.nombre}}{{/if}}', {
          juego: { nombre: 'CR' },
        }),
      ).toBe('J: CR');
      expect(
        renderer.render('{{#if juego.nombre}}J: {{juego.nombre}}{{/if}}', {
          juego: { nombre: '' },
        }),
      ).toBe('');
    });

    it('soporta múltiples condicionales', () => {
      const tmpl = '{{#if a}}A{{/if}}-{{#if b}}B{{/if}}-{{#if c}}C{{/if}}';
      expect(renderer.render(tmpl, { a: 1, b: 0, c: 'x' })).toBe('A--C');
    });
  });

  describe('render - truncado', () => {
    it('trunca a N caracteres preservando palabras', () => {
      const text = 'Este es un texto largo que debe ser truncado a 30 caracteres';
      const result = renderer.render('{{texto | truncate:30}}', { texto: text });
      expect(result.length).toBeLessThanOrEqual(30);
      expect(result).toMatch(/\.\.\.$/);
    });

    it('no trunca si el texto es más corto que el límite', () => {
      expect(
        renderer.render('{{texto | truncate:100}}', { texto: 'corto' }),
      ).toBe('corto');
    });

    it('combina truncate con placeholders normales', () => {
      const tmpl = 'Título: {{titulo}} | Body: {{body | truncate:20}}';
      const result = renderer.render(tmpl, {
        titulo: 'X',
        body: 'Este es un body largo largo largo',
      });
      expect(result).toContain('Título: X');
      expect(result.length).toBeLessThan(50);
    });
  });

  describe('truncate - método directo', () => {
    it('trunca con ellipsis', () => {
      const result = renderer.truncate(
        'Hola mundo esto es una prueba larga',
        20,
      );
      expect(result).toMatch(/\.\.\.$/);
      expect(result.length).toBeLessThanOrEqual(20);
    });

    it('preserva palabras completas (no corta una palabra a la mitad)', () => {
      const result = renderer.truncate(
        'palabra1 palabra2 palabra3 palabra4',
        20,
      );
      // El texto antes de "..." debe estar formado por palabras completas
      const beforeEllipsis = result.replace(/\.\.\.$/, '');
      expect(beforeEllipsis).toMatch(/^[a-z0-9]+( [a-z0-9]+)*$/);
      // Verificar que termina con ellipsis
      expect(result).toMatch(/\.\.\.$/);
      // Y que las palabras que quedaron son las primeras del input
      expect(beforeEllipsis).toMatch(/^palabra1/);
    });

    it('devuelve texto completo si cabe', () => {
      expect(renderer.truncate('corto', 100)).toBe('corto');
    });

    it('maneja texto vacío', () => {
      expect(renderer.truncate('', 100)).toBe('');
    });
  });

  describe('extractPlaceholders', () => {
    it('extrae placeholders únicos', () => {
      const tmpl = '{{titulo}} - {{premio}} - {{titulo}}';
      const result = renderer.extractPlaceholders(tmpl);
      expect(result).toEqual(expect.arrayContaining(['titulo', 'premio']));
      expect(result.length).toBe(2);
    });

    it('incluye placeholders anidados', () => {
      const tmpl = '{{juego.nombre}} - {{juego.image}}';
      const result = renderer.extractPlaceholders(tmpl);
      expect(result).toContain('juego.nombre');
      expect(result).toContain('juego.image');
    });

    it('extrae placeholders con truncate', () => {
      const tmpl = '{{body | truncate:280}}';
      const result = renderer.extractPlaceholders(tmpl);
      expect(result).toContain('body');
    });

    it('devuelve array vacío si no hay placeholders', () => {
      expect(renderer.extractPlaceholders('texto sin placeholders')).toEqual([]);
    });
  });

  describe('casos reales del proyecto', () => {
    it('renderiza template de sorteo completo', () => {
      const tmpl = `🎁 **¡NUEVO SORTEO!**

**{{titulo}}**

🎮 Premio: {{premio}}
📅 Termina: {{fechaFin}}
{{#if juego.nombre}}🎯 Juego: {{juego.nombre}}{{/if}}

👉 {{url}}`;

      const result = renderer.render(tmpl, {
        titulo: 'Sorteo PS5',
        premio: 'PlayStation 5',
        fechaFin: '15/11/2026',
        juego: { nombre: 'FIFA 25' },
        url: 'https://ajdrew.site/sorteos/abc',
      });

      expect(result).toContain('Sorteo PS5');
      expect(result).toContain('PlayStation 5');
      expect(result).toContain('FIFA 25');
      expect(result).toContain('https://ajdrew.site/sorteos/abc');
      expect(result).toContain('🎯 Juego: FIFA 25');
    });

    it('renderiza template de tutorial', () => {
      const tmpl = `📚 {{titulo}}
{{#if juego.nombre}}🎮 {{juego.nombre}}{{/if}}
👉 {{url | truncate:280}}`;

      const result = renderer.render(tmpl, {
        titulo: 'Cómo ganar en Clash Royale',
        juego: { nombre: 'Clash Royale' },
        url: 'https://ajdrew.site/tutoriales/cr',
      });

      expect(result).toContain('Clash Royale');
      expect(result).toContain('https://ajdrew.site/tutoriales/cr');
    });
  });
});