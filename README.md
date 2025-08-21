# Prueba Técnica — Frontend Developer

## Parte A — Cuestionario

👉 _(Aquí debes completar tus respuestas de la Parte A: modelado de tipos en TypeScript, utilidad genérica para mapear archivos, y control de concurrencia)._

## Parte B — Reto práctico: Multi-Upload con Formik + Yup

### Decisiones técnicas principales

- **Stack usado**: React + TypeScript + Formik + Yup + TailwindCSS.
- Se implementó un **multi-upload con drag & drop e input de archivos**, validando límite de tamaño (≤5MB), número máximo (≤10) y evitando duplicados.
- Cada archivo tiene su **estado individual**: `pending`, `uploading`, `done`, `error`.
- El progreso se simula con un `setInterval` para imitar un `fetch/XMLHttpRequest` real.
- Se agregó **AbortController** para cancelar subidas, con reintentos y eliminación de archivos.
- **Formik + Yup** controla validación y renderiza la tabla editable de metadatos (nombre y tag obligatorio).
- Se bloquea el botón **Enviar** hasta que todos los archivos están cargados con éxito.
- Se añadieron **mensajes de error claros por archivo**, y un `toast` global para feedback.
- La tabla de metadatos es **responsive** (scroll horizontal) y accesible (labels, focus visible).

### Cómo correr el proyecto

1. Clonar el repo:

```
git clone <URL_DEL_REPO>
cd <REPO>
```

2. Instalar dependencias:

```
npm install
```

3. Ejecutar en local:

```
npm run dev
```

### TODOs / Mejoras posibles

- Reintentos con **exponential backoff + jitter**.
- Integración real con API (`/api/upload` y `/api/submit`).
- Test unitarios y de integración (Jest/React Testing Library).
