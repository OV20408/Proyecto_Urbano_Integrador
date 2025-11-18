import { test, expect } from '@playwright/test';
import WebSocket from 'ws';

// =========================
// 🔧 CONFIGURACIÓN GLOBAL
// =========================
const BASE_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:3001/api/auth';
const WS_URL = 'ws://localhost:3001';

// =========================
// 🔹 PRUEBAS DE INTEGRACIÓN
// =========================
test.describe('Pruebas de Integración - Autenticación y Comunicación Tiempo Real', () => {

  // ----------------------------------------------------------
  // 🧩 BLOQUE 1: FLUJO DE LOGIN (FRONTEND + API)
  // ----------------------------------------------------------
  test('El usuario inicia sesión correctamente y es redirigido al Dashboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page).toHaveTitle(/Proyecto Urbano Integrador/i);

    await page.fill('input#email', 'ren@gmail.com');
    await page.fill('input#password', '123456');

    await page.click('button:has-text("INGRESAR")');
    await expect(page).toHaveURL(/dashboard/);
  });

  // ----------------------------------------------------------
  // 🧩 BLOQUE 2: LOGIN API (HTTP DIRECTO)
  // ----------------------------------------------------------
  test('El backend responde correctamente al login API', async ({ request }) => {
    const response = await request.post(`${API_URL}/login`, {
      data: { email: 'ren@gmail.com', password: '123456' },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('token');
    expect(body.user.email).toBe('ren@gmail.com');
  });

  // ----------------------------------------------------------
  // 🧩 BLOQUE 3: COMUNICACIÓN WEBSOCKET + API REST
  // ----------------------------------------------------------
  test('El cliente WebSocket se conecta y recibe mensajes en tiempo real desde el backend', async () => {
    const ws = new WebSocket(WS_URL);
    let connected = false;
    let lastMessage: any = null;

    // Escuchar mensajes del servidor
    ws.on('message', (data) => {
      const msg = JSON.parse(data.toString());
      lastMessage = msg;
      if (msg.type === 'connection') connected = true;
    });

    // Esperar a que el socket se abra
    await new Promise((resolve) => ws.on('open', resolve));
    expect(ws.readyState).toBe(WebSocket.OPEN);

    // Validar mensaje inicial de conexión
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(connected).toBeTruthy();

    // Enviar mensaje a través del endpoint HTTP
    const response = await fetch('http://localhost:3001/mensaje', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje: 'Hola desde test WebSocket' }),
    });
    expect(response.status).toBe(200);

    // Esperar a recibir broadcast
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(lastMessage).not.toBeNull();
    expect(lastMessage.type).toBe('mensaje');
    expect(lastMessage.content).toBe('Hola desde test WebSocket');

    ws.close();
  });

});
