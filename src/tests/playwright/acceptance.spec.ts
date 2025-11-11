import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:3001/api/auth';

test.describe('Pruebas de Aceptación - Registro de Usuario', () => {

  test('El ciudadano puede registrarse con datos válidos', async ({ page }) => {
    await page.goto(`${BASE_URL}/registro`);

    // Paso 1: nombre y correo
    await page.fill('input#nombre', 'Usuario de Prueba');
    await page.fill('input#email', `nuevo${Date.now()}@correo.com`);
    await page.click('button:has-text("SIGUIENTE")');

    // Paso 2: contraseñas
    await page.fill('input#password', '123456');
    await page.fill('input#confirmPassword', '123456');

    await Promise.all([
      page.waitForResponse((resp) => resp.url().includes(`${API_URL}/register`) && resp.status() === 201),
      page.click('button:has-text("REGISTRAR")')
    ]);

    // Validar alerta de éxito
      await expect(page).toHaveURL(`${BASE_URL}/login`);

  });

  test('El backend responde correctamente al endpoint de registro', async ({ request }) => {
    const response = await request.post(`${API_URL}/register`, {
      data: { 
        name: 'Test API', 
        email: `api${Date.now()}@correo.com`, 
        password: '123456' 
      }
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('message', 'Usuario registrado correctamente');
  });
});
