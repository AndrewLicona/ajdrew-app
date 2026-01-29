# 🟢 PLAN MAESTRO AJDREW

Documento estratégico para expansión del producto, interactividad avanzada, votaciones con brackets animados y sistema de compartidos sociales.

---

## 1. Visión Extendida

AJDREW evoluciona de sistema de calificaciones a **plataforma comunitaria interactiva y compartible**, donde:

* La comunidad **vota, compite y decide**
* El contenido de YouTube se **extiende y valida en la web**
* Cada acción genera **contenido visual listo para redes**

Objetivo clave:

> Convertir rankings, votaciones, tutoriales y sorteos en piezas sociales compartibles (YouTube, TikTok, Instagram, Facebook).

---

## 2. Estructura Global del Producto

### 2.1 Centro de Juegos

**Rutas base**

```
/juegos
/juegos/[gameId]
```

Cada juego funciona como un **hub independiente**, pero conectado a apartados globales.

#### Página `/juegos`

* Cards por juego
* Actividad (votos, tutoriales, sorteos)

#### Página `/juegos/[gameId]`

Contiene:

* Resumen del juego
* Rankings
* Tutoriales
* Sorteos
* Votaciones / Torneos

---

## 3. Sistemas de Participación

### 3.1 Calificaciones (Sistema Base)

* Calificación 1–5 estrellas
* Rankings dinámicos
* Antifraude: deviceId + IP

Uso principal:

* Medición constante
* Base para rankings compartibles

---

## 4. NUEVO: Sistema de Votaciones por Brackets (Eliminaciones)

### 4.1 Concepto

Votaciones temáticas estilo torneo:

* Eliminación directa
* Rondas progresivas
* Resultado visual

Ejemplos:

* Mejor carta del evento
* Mejor jugador histórico
* Mejor plantilla

---

### 4.2 Estructura Técnica

**Entidad: VotaciónBracket**

* gameId
* temática
* estado (activa / finalizada)
* rondaActual

**Entidad: BracketMatch**

* itemA vs itemB
* votosA / votosB
* ganador

---

### 4.3 UX y Animaciones

* Animaciones de transición entre rondas (Framer Motion)
* Highlight del ganador
* Avance visual tipo "torneo deportivo"

Objetivo:

> Que el usuario sienta que está viendo una competición real.

---

### 4.4 Compartibilidad del Bracket

Cada ronda genera:

* Imagen automática del enfrentamiento
* Imagen del ganador de ronda
* Imagen final del campeón

Con botones:

* Compartir en YouTube (link)
* Compartir en TikTok / Instagram / Facebook

---

## 5. Tutoriales (Extensión de YouTube)

### 5.1 Centro de Tutoriales

**Rutas**

```
/tutoriales
/juegos/[gameId]/tutoriales
```

Contenido:

* Video embebido
* Resumen
* Dificultad
* Tags
* Calificación del tutorial

---

### 5.2 Feedback Comunitario

* ¿Te sirvió? (Sí / No)
* Ranking de tutoriales más útiles

Esto alimenta:

* Nuevos videos
* Contenido que la comunidad quiere

---

### 5.3 Compartir Tutorial

Cada tutorial genera:

* Imagen con título
* Badge del juego
* Nivel (Fácil / Pro)
* CTA con link

---

## 6. Sorteos (Gamificación)

### 6.1 Tipos de Sorteos

* Globales
* Por juego
* Por evento

---

### 6.2 Participación sin Login

Acciones válidas:

* Votar
* Participar en brackets
* Ver tutorial

Cada acción = entrada

---

### 6.3 Compartir Sorteos

Imagen automática:

* Premio
* Fecha
* Progreso
* Link directo

Ideal para stories y posts.

---

## 7. Sistema de Compartidos Sociales (CLAVE)

### 7.1 Generador de Imágenes

Contenido generado:

* Rankings
* Resultados de brackets
* Tutoriales destacados
* Sorteos

Formato:

* Imagen optimizada para redes
* Metadata Open Graph
* Link trackeable

---

### 7.2 Beneficio Estratégico

* La comunidad hace marketing
* Cada share = entrada a la web
* Viralidad orgánica

---

## 8. Apartados Globales

### Globales:

* /rankings
* /tutoriales
* /sorteos
* /comunidad

Con filtros por juego.

---

## 9. Modo Administrador (Admin Panel)

### 9.1 Objetivo del Modo Admin

El **Modo Administrador** permite controlar, moderar y orquestar toda la actividad de AJDREW sin afectar la experiencia abierta del usuario.

Principios:

* Invisible para el usuario normal
* Control total del contenido y las dinámicas
* Escalable a futuros roles

---

### 9.2 Acceso y Seguridad

* Autenticación mediante JWT
* Roles iniciales:

  * **Admin** (control total)
  * **Editor** (contenido)

Ruta protegida:

```
/admin
```

---

### 9.3 Funcionalidades del Admin Panel

#### 🎮 Gestión de Juegos

* Crear / editar / ocultar juegos
* Activar o desactivar juegos

---

#### ⭐ Gestión de Calificaciones

* Ver rankings en tiempo real
* Resetear votaciones
* Bloquear ítems

---

#### 🗳️ Gestión de Brackets y Votaciones

* Crear votaciones por temática
* Definir rondas (octavos, cuartos, etc.)
* Avanzar rondas manual o automático
* Cerrar votaciones

---

#### 🎥 Gestión de Tutoriales

* Crear tutorial (video + metadata)
* Asociar a juego
* Cambiar estado (borrador / publicado)

---

#### 🎁 Gestión de Sorteos

* Crear sorteos
* Definir acciones válidas
* Cerrar sorteos
* Seleccionar ganadores

---

#### 🖼️ Gestión de Contenido Compartible

* Generar imágenes sociales
* Previsualizar Open Graph
* Copiar links listos para redes

---

### 9.4 Panel de Actividad

* Votos por día
* Juegos más activos
* Tutoriales más vistos
* Participación en sorteos

---

### 9.5 Arquitectura Técnica del Admin

Backend:

* Módulo Admin independiente (NestJS)
* Guards de roles

Frontend:

* Layout exclusivo Admin
* Server Actions protegidas

---

### 9.6 Roadmap por Fases

## 10. Resultado Final

AJDREW se convierte en:

> 🎮 Plataforma + 🧠 Comunidad + 📣 Contenido Social

Todo lo que pasa en la web **se puede compartir**.
Todo lo que se comparte **trae gente a la web**.

---

Documento listo para:

* Agente técnico
* Dev senior
* Escalado del proyecto



git pull origin main
docker-compose -f docker-compose.prod.yml down --remove-orphans
docker-compose -f docker-compose.prod.yml up -d --build --force-recreate