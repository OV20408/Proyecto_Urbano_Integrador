import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:3001/api';

test.describe('Pruebas de Integración - Flujo de Login', () => {
  test('El usuario inicia sesión correctamente y es redirigido al Dashboard', async ({ page }) => {
    // Navegar a la pantalla de login
    await page.goto(`${BASE_URL}/login`);
    await expect(page).toHaveTitle(/Proyecto Urbano Integrador/i);

    // Completar formulario
    await page.fill('input[type=email]', 'omar@gmail.com');
    await page.fill('input[type=password]', '123456');

    // Enviar formulario
    await Promise.all([
      page.waitForNavigation(),
      page.click('button:has-text("INGRESAR")')
    ]);

    // Validar redirección al dashboard
    await expect(page).toHaveURL(/dashboard/);
  });

  test('El backend responde correctamente al login API', async ({ request }) => {
    const response = await request.post(`${API_URL}/login`, {
      data: { email: 'omar@gmail.com', password: '123456' },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('token');
    expect(body.user.email).toBe('omar@gmail.com');
  });
});
