import "@testing-library/jest-dom/vitest";

// Polyfills necesarios que Next.js o la app esperan en el entorno de pruebas
import { TextEncoder, TextDecoder } from "node:util";

// Asignar polyfills de Node al global para jsdom
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).TextEncoder = TextEncoder;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).TextDecoder =
  TextDecoder as unknown as typeof globalThis.TextDecoder;
