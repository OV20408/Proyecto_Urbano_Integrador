import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:3001/api/auth';

test.describe('Pruebas de Integración - Flujo de Login', () => {

  test('El usuario inicia sesión correctamente y es redirigido al Dashboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page).toHaveTitle(/Proyecto Urbano Integrador/i);

    await page.fill('input#email', 'ren@gmail.com');
    await page.fill('input#password', '123456');

    await page.click('button:has-text("INGRESAR")');

    // Valida que el dashboard cargue
    await expect(page).toHaveURL(/dashboard/);
  });

  test('El backend responde correctamente al login API', async ({ request }) => {
    const response = await request.post(`${API_URL}/login`, {
      data: { email: 'ren@gmail.com', password: '123456' },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('token');
    expect(body.user.email).toBe('ren@gmail.com');
  });
});
