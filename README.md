# Prueba Técnica — Frontend Developer

## 📘 Parte A — Cuestionario Resuelto

**1. Modelado de tipos (FileDescriptor)**

```typescript
type Uploading = { state: "uploading"; progress: number };
type Idle = {
  state: "idle" | "done" | "error" | "canceled";
  progress?: undefined;
};

export type FileDescriptor = {
  id: string;
  name: string;
  size: number;
  mime: string;
  error?: string;
} & (Uploading | Idle);
```

🔑 **Explicación :**

- Un archivo puede estar en diferentes estados (`idle`, `uploading`, `done`, etc).
- Solo cuando está **subiendo** (`uploading`) tiene sentido mostrar el `progress` (0–100).
- Uso "discriminated unions" (esa combinación `Uploading | Idle`), que obliga a TypeScript a entender qué propiedades se pueden usar dependiendo del estado. 👉 Esto me da **seguridad en el código**: no puedo leer o modificar `progress` si el archivo no está subiendo.

**2. Función genérica** `mapFilesToDescriptors`

```typescript
export function mapFilesToDescriptors(
  files: FileList | File[]
): FileDescriptor[] {
  // 1. Convertir a array: TS me pide distinguir FileList de File[]
  const arr: File[] = Array.isArray(files) ? files : Array.from(files);

  // 2. Eliminar duplicados: uso un Map para evitar mismo name+size
  const unique = new Map<string, File>();
  for (const f of arr) {
    const key = `${f.name}-${f.size}`;
    if (!unique.has(key)) unique.set(key, f);
  }

  // 3. Transformar cada File en FileDescriptor con id único
  return Array.from(unique.values()).map((f) => ({
    id: crypto.randomUUID(), // genera un id estable y único
    name: f.name,
    size: f.size,
    mime: f.type,
    state: "idle" as const,
  }));
}
```

🔑 **Explicación :**

- Primero reviso si me llega un `FileList` (como cuando arrastras desde input) o un `File[]`. Con `Array.isArray` lo convierto siempre en array.
- Luego quito duplicados con un `Map` porque un mismo archivo puede repetirse (ej. arrastrado dos veces). La clave es `name+size`.
- Finalmente, creo mi `FileDescriptor` con todos los datos y un `id` único (`crypto.randomUUID()`) que asegura que puedo identificar cada archivo.

**3. Función** `limitConcurrency`

```typescript
export async function limitConcurrency<T>(
  pool: number,
  tasks: (() => Promise<T>)[]
): Promise<T[]> {
  const results: T[] = [];
  let i = 0;

  async function worker() {
    while (i < tasks.length) {
      const current = i++;
      try {
        results[current] = await tasks[current]();
      } catch (err) {
        results[current] = Promise.reject(err) as any; // marca error en esa posición
      }
    }
  }

  await Promise.all(Array.from({ length: pool }, worker));
  return results;
}
```

🔑 **Explicación :**

- Tengo varias tareas asíncronas (promesas) y quiero que solo corran máximo `pool` al mismo tiempo (ej. 3 subidas en paralelo).
- Cada "worker" toma tareas mientras quedan pendientes y guarda el resultado en el mismo orden (`results[current]`).
- Si alguna tarea falla, guardo un `Promise.reject` en esa posición para no perder el orden.
- **Backpressure:** si hay muchas tareas, mente se van ejecutando de a pocas y las demás esperan en la cola.

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
