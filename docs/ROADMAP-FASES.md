# ROADMAP DE IMPLEMENTACION - AJDREW

> **Periodo:** 3 semanas (Fase 1, 2 y 3)
> **Objetivo general:** Llevar la plataforma de "funciona en local" a "crece sola y monetiza"
> **Estado actual:** Codigo base solido (NestJS + Next.js 16 + PostgreSQL), integraciones sociales parcialmente automatizadas via eventos, admin funcional pero disperso.

---

## RESUMEN EJECUTIVO

El proyecto tiene **una arquitectura de eventos sociales muy bien montada** (`social-publication.listener.ts`, `bracket-phase.listener.ts`) que publica automaticamente sorteos, tutoriales, votaciones y rankings en Discord, X, Meta y YouTube. Lo que falta es:

1. **Content Studio** - un panel admin donde crear todo desde un solo lugar con **preview antes de publicar** y **plantillas editables**.
2. **Retry Queue** - si una red falla, se debe reintentar automaticamente y los fallos deben ser visibles.
3. **Google AdSense** - monetizar el trafico.
4. **Onboarding YouTube** - `Sign in with YouTube` + landing `/yt/[slug]` + end screens automaticos.

---

## 🩺 DIAGNSTICO ACTUAL (Lo que ya funciona ✅ y lo que falta ❌)

### ✅ Backend funcionando
- Monorepo pnpm con `app/backend` (NestJS 11) + `app/frontend` (Next.js 16) + `packages/shared` (vaco).
- Arquitectura limpia: `interfaces/` (controllers) → `application/` (services) → `infrastructure/persistence/` (repos) y `domain/`.
- Prisma con modelos: `Calificacion`, `ItemCalificable`, `TablaCalificacion`, `VotacionBracket`, `VotacionEnfrentamiento`, `Sorteo`, `Tutorial`, `Publicacion`, `Usuario`, `Juego`, `Categoria`, cuentas por red social.
- Auth con JWT + Roles Guard (ADMIN / EDITOR / USER).
- Cron jobs con `@nestjs/schedule` (avance de brackets, cierre de sorteos).
- Generacin de imgenes con `sharp` (rankings, sorteos, VS de votaciones).
- Integracin Cloudinary para hosting de imgenes.
- Docker Compose con Nginx, PostgreSQL, Adminer.

### ✅ Sistema de eventos sociales (excelente)
| Evento | Disparado desde | Publica en |
|---|---|---|
| `social.sorteo.created` | `sorteos.service.ts:18` | Discord + X + Meta + YouTube |
| `social.sorteo.winners` | `sorteos.service.ts:174,197` | Discord + X + Meta |
| `social.tutorial.published` | `tutoriales.service.ts:30` | Discord + X + Meta |
| `social.bracket.created` | `votaciones.service.ts:67` | Discord + X |
| `social.tabla.created` | `tablas-calificacion.service.ts:47` | Discord + X |
| `bracket.phase.started` | `bracket-phase.listener.ts:29` | Discord + X con VS image |
| `bracket.champion.declared` | `bracket-phase.listener.ts:118` | Discord + X |
| `social.ranking.updated` | Manual `POST /social-media/ranking/:id/publish` | Discord + X |

### ✅ Frontend
- Next.js 16 con App Router + Tailwind 4 + Theme selector.
- Atomic Design: `modules/`, `shared/components/{atoms,molecules,organisms}`.
- 17 rutas admin`/admin/*` (juegos, categoras, items, calificaciones, votaciones, tutoriales, sorteos, usuarios, integraciones, Discord, X, Facebook, Instagram, YouTube).
- Pginas pblicas: `/`, `/calificaciones`, `/calificaciones/[id]`, `/votaciones/[slug]`, `/tutoriales/[slug]`, `/sorteos`, `/juegos/[slug]`.
- Login con JWT (localStorage).
- Open Graph images dinmicas en 3 rutas.

### ❌ Brechas crticas
1. **No existe un "Content Studio" central** — Crear sorteos/tutoriales/brackets requiere navegar a 5 pginas distintas y el texto que va a redes se genera en el listener **sin preview**.
2. **No hay retry queue** — Si Discord se cae 5 minutos, el mensaje se pierde. No hay dashboard de fallos.
3. **No hay plantillas editables** — Cada publicacin genera su texto en `buildXxxText()` hardcoded; no puedes cambiarlos desde el admin.
4. **No hay analytics** — No sabes qu red trae ms trfico.
5. **No hay Google Ads** — Trfico no monetizado.
6. **No hay onboarding YouTube** — Suscriptores no migran.
7. **No hay tests E2E** — Solo 9 archivos `.spec.ts` en backend, 0 en frontend.
8. **`packages/shared` vaco** — Tipos duplicados entre frontend y backend.
9. **Sin rate limiting** — Bots pueden abusar.
10. **Dockerfile frontend usa puerto 3001 pero Nginx apunta a 80** — Bloqueante en deploy.

---

# 🟢 FASE 1: Content Studio + Preview
**Duracin estimada:** 5-7 das
**Objetivo:** Unificar la creacin de contenido social en un solo lugar, con preview en vivo antes de publicar y plantillas editables desde DB.

## 1.1 — Schema Prisma (Da 1)

**Archivo a modificar:** `app/backend/prisma/schema.prisma`

Aadir al final:

```prisma
// ──────────────────────────────────────────────────────────────────────────
// Content Studio: plantillas editables y trazabilidad de publicaciones
// ──────────────────────────────────────────────────────────────────────────

model SocialTemplate {
  id         String   @id @default(cuid())
  tipo       String   // 'sorteo_created' | 'sorteo_winners' | 'tutorial_published' | 'bracket_created' | 'bracket_phase' | 'bracket_champion' | 'tabla_created' | 'ranking_updated'
  plataforma String   // 'discord' | 'x' | 'meta' | 'youtube'
  template   String   @db.Text // Con placeholders {{titulo}}, {{premio}}, {{fechaFin}}, etc
  activo     Boolean  @default(true)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@unique([tipo, plataforma])
  @@index([tipo])
}

model SocialPublication {
  id             String   @id @default(cuid())
  evento         String   // 'sorteo.created' | 'sorteo.winners' | etc
  referenciaId   String   // ID del sorteo/tutorial/bracket/etc
  plataforma     String
  estado         String   @default("PENDIENTE") // 'PENDIENTE' | 'PUBLICADO' | 'FALLIDO' | 'PROGRAMADO'
  textoFinal     String   @db.Text
  imageUrl       String?
  errorMsg       String?  @db.Text
  publicadoAt    DateTime?
  programadoPara DateTime?
  intentos       Int      @default(0)
  metadata       Json?    // Para guardar datos extra del job (lote, videoId, etc)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([estado, programadoPara])
  @@index([referenciaId])
  @@index([plataforma, createdAt])
}

model SocialAnalytics {
  id           String   @id @default(cuid())
  publicationId String
  plataforma   String
  metricas     Json     // {likes, retweets, reach, clicks, impressions}
  capturadoEn  DateTime @default(now())

  @@index([publicationId])
  @@index([plataforma, capturadoEn])
}
```

**Comando:**
```bash
cd app/backend
pnpm prisma migrate dev --name content-studio-init
pnpm prisma generate
```

---

## 1.2 — Backend: Content Studio Module (Da 2-3)

### Archivos a crear:
```
app/backend/src/modules/content-studio/
├── content-studio.module.ts
├── content-studio.controller.ts
├── content-studio.service.ts
├── templates/
│   └── template-renderer.service.ts       # Renderiza {{placeholders}} con datos
├── dto/
│   ├── preview.dto.ts
│   ├── publish.dto.ts
│   ├── schedule.dto.ts
│   └── update-template.dto.ts
└── default-templates.seed.ts              # Inserta templates por defecto
```

### Endpoints clave:

```typescript
// POST /api/content-studio/preview — preview sin publicar
// POST /api/content-studio/publish  — publicar inmediatamente
// POST /api/content-studio/schedule — programar para X fecha
// GET  /api/content-studio/publications?estado=FALLIDO&plataforma=x
// POST /api/content-studio/publications/:id/retry
// GET  /api/content-studio/templates
// PATCH /api/content-studio/templates/:id
```

### `content-studio.controller.ts` (esqueleto):

```typescript
import {
  Controller, Post, Get, Patch, Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/guards/roles.decorator';
import { ContentStudioService } from './content-studio.service';
import { PreviewDto } from './dto/preview.dto';
import { PublishDto } from './dto/publish.dto';
import { ScheduleDto } from './dto/schedule.dto';

@Controller('content-studio')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContentStudioController {
  constructor(private readonly studio: ContentStudioService) {}

  // ── Preview ──────────────────────────────────────────────────────────
  @Post('preview')
  @Roles('ADMIN', 'EDITOR')
  async preview(@Body() dto: PreviewDto) {
    return this.studio.generatePreview(dto);
  }

  // ── Publicar inmediatamente ──────────────────────────────────────────
  @Post('publish')
  @Roles('ADMIN', 'EDITOR')
  async publish(@Body() dto: PublishDto) {
    return this.studio.publishNow(dto);
  }

  // ── Programar ────────────────────────────────────────────────────────
  @Post('schedule')
  @Roles('ADMIN', 'EDITOR')
  async schedule(@Body() dto: ScheduleDto) {
    return this.studio.schedulePublication(dto);
  }

  // ── Listar publicaciones (para dashboard de fallos) ──────────────────
  @Get('publications')
  @Roles('ADMIN')
  listPublications(
    @Query('estado') estado?: string,
    @Query('plataforma') plataforma?: string,
    @Query('page') page = '1',
  ) {
    return this.studio.listPublications({ estado, plataforma, page: +page });
  }

  // ── Reintentar publicacin fallida ───────────────────────────────────
  @Post('publications/:id/retry')
  @Roles('ADMIN')
  async retry(@Param('id') id: string) {
    return this.studio.retryPublication(id);
  }

  // ── Templates editables ──────────────────────────────────────────────
  @Get('templates')
  listTemplates() {
    return this.studio.listTemplates();
  }

  @Patch('templates/:id')
  @Roles('ADMIN')
  updateTemplate(@Param('id') id: string, @Body() body: any) {
    return this.studio.updateTemplate(id, body);
  }
}
```

### `content-studio.service.ts` (esqueleto):

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';
import { TemplateRenderer } from './templates/template-renderer.service';

@Injectable()
export class ContentStudioService {
  private readonly logger = new Logger(ContentStudioService.name);

  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
    private renderer: TemplateRenderer,
  ) {}

  /**
   * Genera preview del contenido social SIN publicar.
   * Devuelve el texto y la imagen por plataforma.
   */
  async generatePreview(dto: PreviewDto) {
    // 1. Cargar datos segn tipo ('sorteo' | 'tutorial' | 'bracket' | 'ranking')
    const data = await this.loadData(dto.tipo, dto.referenciaId);
    
    // 2. Cargar templates desde DB (o fallback a defaults hardcoded)
    const templates = await this.loadTemplates(dto.tipo);
    
    // 3. Renderizar texto por plataforma
    const preview: Record<string, { texto: string; imageUrl?: string; charCount: number }> = {};
    for (const plataforma of dto.plataformas) {
      const tmpl = templates[plataforma];
      if (!tmpl) continue;
      preview[plataforma] = {
        texto: this.renderer.render(tmpl, data),
        imageUrl: data.imageUrl, // o generada con sharp
        charCount: this.renderer.render(tmpl, data).length,
      };
    }
    return preview;
  }

  /**
   * Publica inmediatamente en todas las plataformas seleccionadas.
   * Crea registros en DB y los procesa va el sistema de eventos.
   */
  async publishNow(dto: PublishDto) {
    const preview = await this.generatePreview(dto);
    
    const publications = await Promise.all(
      dto.plataformas.map(async (plataforma) => ({
        evento: `${dto.tipo}.created`,
        referenciaId: dto.referenciaId,
        plataforma,
        textoFinal: preview[plataforma].texto,
        imageUrl: preview[plataforma].imageUrl,
        estado: 'PENDIENTE',
      })),
    );

    const created = await this.prisma.socialPublication.createMany({
      data: publications,
    });

    // Emitir evento por cada plataforma → los listeners existentes procesan
    for (const pub of publications) {
      this.eventEmitter.emit(`${dto.tipo}.created`, {
        publicacionId: pub.publicacionId,
        plataforma: pub.plataforma,
        data: await this.loadData(dto.tipo, dto.referenciaId),
      });
    }

    return { created: created.count };
  }

  /**
   * Carga datos del recurso (sorteo, tutorial, etc) segn tipo.
   */
  private async loadData(tipo: string, id: string) {
    switch (tipo) {
      case 'sorteo': return this.prisma.sorteo.findUnique({ where: { id }, include: { juego: true } });
      case 'tutorial': return this.prisma.tutorial.findUnique({ where: { id }, include: { juego: true } });
      case 'bracket': return this.prisma.votacionBracket.findUnique({ where: { id } });
      case 'ranking': return this.prisma.tablaCalificacion.findUnique({ where: { id }, include: { juego: true } });
      default: throw new Error(`Tipo no soportado: ${tipo}`);
    }
  }

  // ... ms mtodos: schedulePublication, retryPublication, listTemplates, etc
}
```

### `template-renderer.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class TemplateRenderer {
  /**
   * Reemplaza placeholders {{key}} en un template con valores del objeto data.
   * Ejemplo: "Sorteo de {{premio}}!" con {premio: "PS5"} → "Sorteo de PS5!"
   */
  render(template: string, data: Record<string, any>): string {
    return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_, path) => {
      return path.split('.').reduce((obj, key) => obj?.[key] ?? '', data);
    });
  }

  /**
   * Trunca a 280 caracteres para X (Twitter) preservando palabras completas.
   */
  truncateForX(texto: string, max = 280): string {
    if (texto.length <= max) return texto;
    return texto.substring(0, max - 3).replace(/\s+\S*$/, '') + '...';
  }
}
```

---

## 1.3 — Refactor: Listeners usan templates de DB (Da 3)

### Archivos a modificar:
- `app/backend/src/modules/social-media/listeners/social-publication.listener.ts`
- `app/backend/src/modules/social-media/listeners/bracket-phase.listener.ts`

### Cambios:

```typescript
// ANTES (en social-publication.listener.ts:60)
const text = this.buildTutorialText(tutorial);

// DESPUS
const text = await this.templateRenderer.render(
  await this.loadTemplate('tutorial_published', 'discord'),
  tutorial,
);
```

---

## 1.4 — Frontend: Content Studio UI (Da 4-6)

### Archivos a crear:
```
app/frontend/src/app/admin/content-studio/
├── page.tsx                              # Dashboard con feed de publicaciones
├── new/
│   ├── page.tsx                          # Wizard unificado (selector de tipo)
│   ├── [tipo]/
│   │   └── page.tsx                      # Wizard por tipo
├── publications/
│   ├── page.tsx                          # Historial + fallos
│   └── [id]/page.tsx                     # Detalle de una publicacin
└── templates/
    ├── page.tsx                          # Lista de templates editables
    └── [id]/page.tsx                     # Editor de un template
```

### Componentes clave:

```
app/frontend/src/modules/content-studio/components/
├── SocialPreviewPanel.tsx               # Preview por plataforma
├── PlatformTabs.tsx                     # Tabs Discord / X / Meta / YouTube
├── TextEditor.tsx                       # Editor del texto (con contador chars)
├── ImagePreview.tsx                     # Preview de la imagen que se generar
├── SchedulePicker.tsx                   # DateTime picker para programar
├── PublicationStatusBadge.tsx           # PENDIENTE / PUBLICADO / FALLIDO
├── RetryButton.tsx                       # Botn de reintento
└── TemplateEditor.tsx                   # Editor de templates con preview en vivo
```

### `/admin/content-studio/new/[tipo]/page.tsx` (flujo):

```typescript
'use client';

export default function NewContentPage({ params }: { params: { tipo: string } }) {
  const [step, setStep] = useState(1); // 1=Seleccionar recurso 2=Editar texto 3=Preview 4=Publicar
  const [recursoId, setRecursoId] = useState('');
  const [previewData, setPreviewData] = useState<any>(null);
  const [plataformas, setPlataformas] = useState(['discord', 'x']);

  // Paso 1: seleccionar el recurso (sorteo, tutorial, etc) desde un dropdown
  // Paso 2: editar texto e imagen manualmente si quieres
  // Paso 3: ver preview en vivo por cada plataforma
  // Paso 4: publicar ahora o programar

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Columna izquierda: Wizard steps */}
      <div className="lg:col-span-2 space-y-6">
        <Stepper current={step} steps={['Recurso', 'Editar', 'Preview', 'Publicar']} />
        {step === 1 && <ResourceSelector tipo={params.tipo} onSelect={setRecursoId} />}
        {step === 2 && <TextEditor initialText={previewData?.discord?.texto} onChange={...} />}
        {step === 3 && <SocialPreviewPanel data={previewData} />}
        {step === 4 && <PublishActions plataformas={plataformas} onPublish={...} onSchedule={...} />}
      </div>
      {/* Columna derecha: sticky preview */}
      <aside className="sticky top-6 self-start">
        <SocialPreviewPanel data={previewData} compact />
      </aside>
    </div>
  );
}
```

### `SocialPreviewPanel.tsx` (preview en Discord / X / Meta / YouTube):

```typescript
'use client';

import { useState } from 'react';
import { PlatformTabs } from './PlatformTabs';

export function SocialPreviewPanel({ data, compact = false }) {
  const [activeTab, setActiveTab] = useState('discord');

  return (
    <div className="bg-[var(--color-card)] border border-white/5 rounded-2xl p-4">
      <PlatformTabs active={activeTab} onChange={setActiveTab} />
      
      {activeTab === 'x' && (
        <div className="border border-white/10 rounded-xl p-4 max-w-xl">
          <div className="flex gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-full" />
            <div className="flex-1">
              <p className="font-bold">AJDREW</p>
              <p className="text-sm whitespace-pre-wrap">{data?.x?.texto}</p>
              {data?.x?.imageUrl && <img src={data.x.imageUrl} className="rounded-xl mt-3" />}
              <p className="text-xs text-white/40 mt-2">
                {data?.x?.charCount || 0}/280 caracteres
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Similar para discord, meta, youtube */}
    </div>
  );
}
```

---

## 1.5 — Seed: Templates por defecto (Da 6)

### Archivo: `app/backend/src/modules/content-studio/default-templates.seed.ts`

```typescript
export const DEFAULT_TEMPLATES = [
  {
    tipo: 'sorteo_created',
    plataforma: 'discord',
    template: '🎁 **NUEVO SORTEO!**\n\n**{{titulo}}**\n\n🎮 Premio: {{premio}}\n📅 Termina: {{fechaFin}}\n\n👉 Participa aqu: {{url}}\n\n#sorteo #gaming #ajdrew',
  },
  {
    tipo: 'sorteo_created',
    plataforma: 'x',
    template: '🎁 NUEVO SORTEO en AJDREW!\n\n{{titulo}}\n🎮 {{premio}}\n📅 Termina {{fechaFin}}\n\n👉 {{url}}\n\n#gaming #sorteo',
  },
  {
    tipo: 'sorteo_winners',
    plataforma: 'discord',
    template: '🏆 **TENEMOS GANADORES!**\n\n**{{titulo}}**\n\n🎉 Ganadores: {{ganadores}}\n🎮 Premio: {{premio}}\n\nFelicidades! 🎊',
  },
  {
    tipo: 'tutorial_published',
    plataforma: 'x',
    template: '🎮 Nuevo tutorial en AJDREW!\n\n"{{titulo}}"\n\n👉 {{url}}\n\n#gaming #tutorial #pro',
  },
  {
    tipo: 'bracket_created',
    plataforma: 'x',
    template: '🔥 Nuevo bracket en AJDREW!\n\n{{tematica}}\n\nVota por tu favorito! 👉 {{url}}\n\n#gaming #torneo',
  },
  // ... ms templates
];
```

---

## ✅ CHECKLIST FASE 1

- [ ] Schema Prisma actualizado + migracin ejecutada
- [ ] `content-studio.module.ts` con controller + service + template-renderer
- [ ] Endpoints `preview`, `publish`, `schedule`, `retry`, `list`, `templates`
- [ ] `default-templates.seed.ts` insertado en DB
- [ ] Refactor de `social-publication.listener.ts` para usar templates de DB
- [ ] Refactor de `bracket-phase.listener.ts` para usar templates de DB
- [ ] Frontend: `/admin/content-studio` dashboard con feed de publicaciones
- [ ] Frontend: `/admin/content-studio/new/[tipo]` wizard de 4 pasos
- [ ] Frontend: `SocialPreviewPanel` con tabs por plataforma
- [ ] Frontend: `/admin/content-studio/publications` con filtro FALLIDO
- [ ] Frontend: `/admin/content-studio/templates` editor de plantillas
- [ ] Test: publicar un sorteo desde Content Studio → llega a Discord/X
- [ ] Test: editar un template → prximo envo usa texto nuevo

---

# 🟡 FASE 2: Retry Queue + BullMQ + Redis + OAuth YouTube
**Duracin estimada:** 5-7 das
**Objetivo:** Reintentos automticos en caso de fallo, programacin de publicaciones, login con YouTube.

## 2.1 — Redis + BullMQ (Da 1-2)

### `docker-compose.yml` (aadir):

```yaml
services:
  redis:
    image: redis:7-alpine
    container_name: ajdrew-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  redis-data:
```

### `app/backend/package.json` (aadir deps):
```bash
pnpm add @nestjs/bullmq bullmq
pnpm add -D @types/bull
```

### Nuevo mdulo:

```
app/backend/src/modules/social-media/queue/
├── social-queue.module.ts
├── social-queue.producer.ts            # Encola jobs
└── social-queue.consumer.ts            # Procesa jobs con reintentos
```

### `social-queue.consumer.ts`:

```typescript
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DiscordService } from '../services/discord.service';
import { XService } from '../services/x.service';
import { MetaService } from '../services/meta.service';
import { YoutubeService } from '../services/youtube.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Processor('social-publisher', { concurrency: 3 })
export class SocialQueueConsumer extends WorkerHost {
  constructor(
    private discord: DiscordService,
    private x: XService,
    private meta: MetaService,
    private youtube: YoutubeService,
    private prisma: PrismaService,
  ) {
    super();
  }

  async process(job: Job) {
    const { publicationId, plataforma, payload } = job.data;
    
    try {
      switch (plataforma) {
        case 'discord': await this.discord.publish(payload); break;
        case 'x': await this.x.publish(payload); break;
        case 'meta': await this.meta.publish(payload); break;
        case 'youtube': await this.youtube.publish(payload); break;
      }
      await this.prisma.socialPublication.update({
        where: { id: publicationId },
        data: { estado: 'PUBLICADO', publicadoAt: new Date() },
      });
      return { success: true };
    } catch (error) {
      const intentos = job.attemptsMade + 1;
      await this.prisma.socialPublication.update({
        where: { id: publicationId },
        data: {
          estado: intentos >= (job.opts.attempts || 3) ? 'FALLIDO' : 'PENDIENTE',
          intentos,
          errorMsg: error.message,
        },
      });
      throw error; // BullMQ reintenta con backoff exponencial
    }
  }
}
```

### Refactor en `social-publication.listener.ts`:

```typescript
// ANTES
await this.xService.publishSorteoCreated(sorteo, text, imageBuffer);

// DESPUS — solo encola
await this.socialQueue.add('publish', {
  publicationId: nuevaPublicacion.id,
  plataforma: 'x',
  payload: { sorteo, imageBuffer, text },
}, {
  attempts: 5,
  backoff: { type: 'exponential', delay: 30_000 }, // 30s, 1min, 2min, 4min, 8min
  removeOnComplete: true,
  removeOnFail: false,
});
```

---

## 2.2 — Cron de Analytics (Da 3)

### Nuevo archivo: `app/backend/src/modules/social-media/cron/analytics-cron.service.ts`

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../../prisma/prisma.service';
import { XService } from '../services/x.service';
import { MetaService } from '../services/meta.service';

@Injectable()
export class AnalyticsCronService {
  private readonly logger = new Logger(AnalyticsCronService.name);

  constructor(
    private prisma: PrismaService,
    private x: XService,
    private meta: MetaService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async refreshAnalytics() {
    this.logger.log('Refrescando analytics de redes sociales...');
    
    const ultimas24h = await this.prisma.socialPublication.findMany({
      where: {
        estado: 'PUBLICADO',
        publicadoAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    });

    for (const pub of ultimas24h) {
      try {
        let metricas: any = null;
        if (pub.plataforma === 'x') metricas = await this.x.getTweetMetrics(pub.id);
        if (pub.plataforma === 'meta') metricas = await this.meta.getPostMetrics(pub.id);
        
        if (metricas) {
          await this.prisma.socialAnalytics.create({
            data: {
              publicationId: pub.id,
              plataforma: pub.plataforma,
              metricas,
            },
          });
        }
      } catch (e) {
        this.logger.warn(`No se pudo obtener mtricas de ${pub.id}: ${e.message}`);
      }
    }
  }
}
```

---

## 2.3 — Login con YouTube OAuth (Da 4-5)

### `app/backend/package.json`:
```bash
pnpm add passport-google-oauth20
pnpm add -D @types/passport-google-oauth20
```

### Variables de entorno nuevas:
```env
GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-secret
GOOGLE_CALLBACK_URL=https://ajdrew.site/api/auth/google/callback
```

### Archivos a crear:

```
app/backend/src/modules/auth-google/
├── auth-google.module.ts
├── auth-google.controller.ts
├── auth-google.service.ts
├── strategies/
│   └── google.strategy.ts
└── dto/
    └── google-profile.dto.ts
```

### `google.strategy.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      scope: [
        'email',
        'profile',
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/youtube.force-ssl',
      ],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;
    const user = {
      provider: 'google',
      providerId: id,
      email: emails[0].value,
      nombre: `${name.givenName} ${name.familyName}`,
      avatar: photos[0].value,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}
```

### `auth-google.controller.ts`:

```typescript
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthGoogleService } from './auth-google.service';

@Controller('auth/google')
export class AuthGoogleController {
  constructor(private readonly auth: AuthGoogleService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth() { /* redirige a Google */ }

  @Get('callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    const result = await this.auth.handleGoogleLogin(req.user);
    // Redirige al frontend con el JWT en query string
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?token=${result.access_token}&user=${encodeURIComponent(JSON.stringify(result.user))}`,
    );
  }
}
```

### Frontend: nueva ruta `/auth/callback/page.tsx`:

```typescript
'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const user = searchParams.get('user');
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', user);
      router.push('/');
    } else {
      router.push('/login?error=oauth_failed');
    }
  }, []);

  return <div>Autenticando con Google...</div>;
}
```

### Botn "Continuar con Google" en `/login`:

```tsx
<a href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`} className="...">
  <GoogleIcon /> Continuar con Google
</a>
```

---

## ✅ CHECKLIST FASE 2

- [ ] Redis aadido a `docker-compose.yml` + healthcheck
- [ ] `@nestjs/bullmq` y `bullmq` instalados
- [ ] `social-queue.module.ts` con producer + consumer
- [ ] Listener refactorizado para encolar en vez de publicar directo
- [ ] Reintentos exponenciales (30s, 1min, 2min, 4min, 8min)
- [ ] Cron `analytics-cron.service.ts` refresca mtricas cada da 2am
- [ ] OAuth Google configurado en Google Cloud Console
- [ ] Variables de entorno `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`
- [ ] `auth-google` module + controller + strategy + service
- [ ] Frontend `/auth/callback/page.tsx` recibe token y guarda en localStorage
- [ ] Botn "Continuar con Google" en `/login`
- [ ] Test: simular fallo de red → se reintenta automticamente y se registra en DB
- [ ] Test: login con Google → entra al dashboard

---

# 🔵 FASE 3: Google AdSense + Onboarding /yt/[slug]
**Duracin estimada:** 4-5 das
**Objetivo:** Monetizar el trfico y darle un lugar especfico a los suscriptores de YouTube.

## 3.1 — Google AdSense (Da 1-2)

### Prerrequisitos:
- Dominio propio (ya tienes `ajdrew.site`).
- Poltica de privacidad publicada (obligatoria).
- Banner de cookies (obligatorio por GDPR/LGPD).

### Si no tienes trfico an, alternativa: **Ezoic** (ms fcil de aprobar, paga mejor para sitios nuevos) o **Media.net**.

### Frontend: `app/frontend/src/app/layout.tsx` (modificar)

```tsx
import Script from 'next/script';

// Dentro de <head>:
<Script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXX"
  crossOrigin="anonymous"
  strategy="afterInteractive"
/>
```

### Componente: `app/frontend/src/shared/components/molecules/AdUnit.tsx`

```tsx
'use client';
import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export function AdUnit({ 
  slot, 
  format = 'auto',
  responsive = true,
  className = '',
}: { 
  slot: string; 
  format?: string;
  responsive?: boolean;
  className?: string;
}) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn('AdSense no cargado:', e);
    }
  }, []);
  
  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: 'block' }}
      data-ad-client="ca-pub-XXXXX"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive.toString()}
    />
  );
}
```

### Componente: `app/frontend/src/shared/components/organisms/CookieBanner.tsx`

```tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookies-accepted') === 'true';
    if (!accepted) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem('cookies-accepted', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-card)] border-t border-white/10 p-4 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[var(--color-text-secondary)]">
          🍪 Usamos cookies para personalizar contenido, anuncios y analizar trfico.{' '}
          <Link href="/privacidad" className="underline">Ms info</Link>
        </p>
        <button onClick={accept} className="bg-[var(--color-primary)] text-white px-6 py-2 rounded-xl text-sm font-bold">
          Aceptar
        </button>
      </div>
    </div>
  );
}
```

### Insertar `<AdUnit>` en pginas pblicas (mx 3 por pgina):

```tsx
// app/frontend/src/app/calificaciones/page.tsx
import { AdUnit } from '@/shared/components/molecules/AdUnit';

export default function CalificacionesPage() {
  return (
    <div>
      <header>...</header>
      <AdUnit slot="1234567890" className="my-8" />
      <CalificacionesContent />
      <AdUnit slot="1234567891" className="my-8" />
    </div>
  );
}
```

### Pgina de privacidad obligatoria:

```
app/frontend/src/app/privacidad/page.tsx
```

Mnimo necesario: qu datos recolectas, cmo los usas, contacto, derechos ARCO (Mxico) / habeas data (Colombia).

---

## 3.2 — Landing para suscriptores de YouTube: `/yt/[slug]` (Da 3-4)

### Concepto:
Cada video de YouTube que publiques tiene una URL nica `ajdrew.site/yt/<slug>` donde el suscriptorYT aterriza y encuentra:
- El bracket/ranking del que habla el video.
- Botn directo a "Votar / Participar".
- Mensaje: "Ests aqu porque viste nuestro ltimo video en YouTube — bienvenido a la comunidad".

### Archivo: `app/frontend/src/app/yt/[slug]/page.tsx`

```tsx
import { Metadata } from 'next';
import { YTOnboardingContent } from '@/modules/yt/components/YTOnboardingContent';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Cargar el "viaje" desde DB segn slug
  const viaje = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/yt/viajes/${params.slug}`)
    .then(r => r.json());
  
  return {
    title: `${viaje.titulo} — AJDREW`,
    description: viaje.descripcion,
    openGraph: {
      title: viaje.titulo,
      description: viaje.descripcion,
      images: [viaje.imageUrl],
      type: 'video.other',
    },
  };
}

export default function YTOnboardingPage({ params }: Props) {
  return <YTOnboardingContent slug={params.slug} />;
}
```

### Backend: `app/backend/src/modules/yt/`

```prisma
model YTViaje {
  id          String   @id @default(cuid())
  slug        String   @unique
  videoId     String   // ID del video en YouTube
  titulo      String
  descripcion String   @db.Text
  imageUrl    String?
  recursoTipo String   // 'bracket' | 'ranking' | 'sorteo' | 'tutorial'
  recursoId   String
  cta         String   @default("nete a la comunidad y vota")
  visitas     Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model YTVisit {
  id        String   @id @default(cuid())
  viajeId   String
  userAgent String?
  referer   String?
  converted Boolean  @default(false)
  visitedAt DateTime @default(now())

  @@index([viajeId])
}
```

### Frontend: `YTOnboardingContent.tsx`

```tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export function YTOnboardingContent({ slug }: { slug: string }) {
  const [viaje, setViaje] = useState<any>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/yt/viajes/${slug}`)
      .then(r => r.json())
      .then(setViaje);
  }, [slug]);

  if (!viaje) return <Loading />;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Hero con video embebido */}
        <div className="aspect-video rounded-2xl overflow-hidden mb-8">
          <iframe
            src={`https://www.youtube.com/embed/${viaje.videoId}`}
            className="w-full h-full"
            allowFullScreen
          />
        </div>

        {/* Mensaje personalizado */}
        <h1 className="text-4xl font-black italic uppercase mb-4">
          Gracias por ver el video! 🎮
        </h1>
        <p className="text-lg mb-8">{viaje.descripcion}</p>

        {/* CTA directo al recurso */}
        <Link
          href={`/${viaje.recursoTipo === 'bracket' ? 'votaciones' : viaje.recursoTipo}/${viaje.recursoId}`}
          className="inline-block bg-[var(--color-primary)] text-white px-8 py-4 rounded-xl font-black"
        >
          {viaje.cta} →
        </Link>

        {/* Beneficio extra por venir de YouTube */}
        <div className="mt-12 p-6 bg-[var(--color-card)] rounded-2xl border border-[var(--color-primary)]/30">
          <p className="text-sm">
            🎁 <strong>Beneficio exclusivo:</strong> Crea una cuenta con Google y recibirs
            50 puntos extra en tu primera calificacin.
          </p>
        </div>
      </div>
    </div>
  );
}
```

### End screen automtico en videos:

Aadir mtodo a `youtube.service.ts`:

```typescript
async addEndScreenCTA(videoId: string, customText: string) {
  // YouTube Data API: youtube.videos.update → player.endScreen con:
  // - Link a https://ajdrew.site/yt/<videoId>
  // - Texto: customText
  // Esto requiere OAuth con permisos de gestin del canal
}
```

---

## 3.3 — Pulido admin: Dashboard de publicaciones (Da 5)

Mejorar `/admin/content-studio/publications` con:
- Filtros: estado, plataforma, fecha, evento.
- Vista de cada fallo con mensaje de error.
- Botn de retry inline.
- Mtricas (likes, retweets) si estn disponibles.

---

## ✅ CHECKLIST FASE 3

- [ ] Cuenta Google AdSense creada (o alternativa Ezoic/Media.net aprobada)
- [ ] Script de AdSense en `layout.tsx`
- [ ] Componente `<AdUnit>` creado
- [ ] Pgina `/privacidad` publicada
- [ ] `<CookieBanner>` aadido al layout
- [ ] `<AdUnit>` insertado en 5-8 pginas pblicas (calificaciones, tutoriales, sorteos, votaciones)
- [ ] Schema Prisma: `YTViaje`, `YTVisit`
- [ ] Backend mdulo `/yt/` con controller + service
- [ ] Frontend: `/yt/[slug]/page.tsx` con video embebido + CTA
- [ ] End screens automticos en YouTube va API
- [ ] `/admin/content-studio/publications` con mtricas y retry
- [ ] Test: visitante desde video de YouTube → llega a `/yt/[slug]` → vota → registrado en DB
- [ ] Test: cookie banner aparece solo la primera vez

---

## 📊 MTRICAS DE XITO POR FASE

### Fase 1
- 0 publicaciones "ciegas" (todas pasan por preview).
- Tiempo de creacin de un nuevo sorteo: 5 min → 1 min.
- Templates editables sin deploy.

### Fase 2
- 0 publicaciones perdidas por cadas de redes sociales.
- Mtricas de likes/retweets/reach visibles en admin.
- Login con Google operativo (≥ 30% de nuevos usuarios lo usan).

### Fase 3
- Impresiones de AdSense visibles en dashboard.
- CTR > 1.5% en ads.
- Tasa de conversin `/yt/[slug]` → voto: > 25%.
- Visitas desde YouTube > 40% del trfico total.

---

## ⚠️ RIESGOS Y MITIGACIONES

| Riesgo | Mitigacin |
|---|---|
| AdSense rechaza por poco trfico | Empezar con **Ezoic** mientras creces |
| BullMQ requiere Redis (nuevo servicio en homelab) | Healthcheck en docker-compose, monitoring bsico |
| Google OAuth requiere HTTPS | Tu homelab probablemente ya lo tiene va Cloudflare o similar |
| Templates en DB pueden romper listeners existentes | Feature flag por template: usar default hasta validar |
| YouTube API tiene rate limits | Cache de 1h en `getChannelInfo`, retries con backoff |

---

## 🗂️ NDICE DE ARCHIVOS A TOCAR/CREAR

### Backend (NestJS)
```
# Nuevos mdulos
app/backend/src/modules/content-studio/        # Fase 1
app/backend/src/modules/auth-google/           # Fase 2
app/backend/src/modules/yt/                    # Fase 3

# Nuevos archivos en mdulos existentes
app/backend/src/modules/social-media/queue/    # Fase 2
app/backend/src/modules/social-media/cron/     # Fase 2

# Modificados
app/backend/prisma/schema.prisma               # Todas las fases
app/backend/src/modules/social-media/listeners/social-publication.listener.ts   # F1+F2
app/backend/src/modules/social-media/listeners/bracket-phase.listener.ts         # F1
app/backend/src/youtube/youtube.service.ts     # F3 (end screens)
app/backend/src/modules/social-media/social-media.module.ts  # Registrar nuevos providers
docker-compose.yml                              # F2 (Redis)
```

### Frontend (Next.js)
```
# Nuevas rutas
app/frontend/src/app/admin/content-studio/     # Fase 1
app/frontend/src/app/auth/callback/page.tsx    # Fase 2
app/frontend/src/app/yt/[slug]/page.tsx        # Fase 3
app/frontend/src/app/privacidad/page.tsx       # Fase 3

# Nuevos componentes
app/frontend/src/modules/content-studio/components/  # F1
app/frontend/src/modules/yt/components/              # F3

# Componentes compartidos nuevos
app/frontend/src/shared/components/molecules/AdUnit.tsx         # F3
app/frontend/src/shared/components/organisms/CookieBanner.tsx   # F3

# Modificados
app/frontend/src/app/layout.tsx                  # F3 (AdSense script + CookieBanner)
app/frontend/src/app/login/page.tsx              # F2 (botn Google)
app/frontend/src/app/calificaciones/page.tsx     # F3 (AdUnit)
app/frontend/src/app/sorteos/page.tsx            # F3 (AdUnit)
app/frontend/src/app/tutoriales/page.tsx         # F3 (AdUnit)
app/frontend/src/app/admin/layout.tsx            # F1 (link a Content Studio)
```

### Documentacin
```
docs/ROADMAP-FASES.md                # Este archivo
docs/bitacora.md                     # Actualizar con cada fase completada
```

---

## 📝 BITCORA — Formato de entradas

Por cada fase completada, aadir a `docs/bitacora.md`:

```markdown
## [Fase X] Completada — DD/MM/YYYY

### Resumen
[Una lnea de lo que se entreg]

### Archivos creados
- `ruta/archivo/...`
- `ruta/archivo/...`

### Archivos modificados
- `ruta/archivo/...`

### Decisiones tomadas
- [Decisin 1 con justificacin]

### Problemas encontrados
- [Problema y cmo se resolvi]

### Prximos pasos
- [ ] [Tarea para la siguiente fase]
```

---

## 🎯 PARA VOLVER A EMPEZAR OTRO DA

1. Lee `docs/ROADMAP-FASES.md` (este archivo).
2. Revisa el checklist de la fase actual.
3. Mira el ltimo commit de la rama actual con `git log --oneline -20`.
4. Si vas a cambiar de fase, actualiza el checklist marcando lo terminado.
5. Al final del da, aade entrada a `docs/bitacora.md`.

---

**ltima actualizacin:** 04/10/2026
**Autor:** MiniMax Code + Andrew Licona
**Estado:** 🟢 En progreso — Fase 1 iniciada