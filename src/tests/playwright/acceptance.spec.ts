import { test, expect } from '@playwright/test'

test.describe('Pruebas de Aceptación - Registro de Usuario', () => {
  test('El ciudadano puede registrarse con datos válidos', async ({ page }) => {
    await page.goto('http://localhost:5173/registro')

    await page.fill('#name', 'Omar Velasco')
    await page.fill('#email', 'omar@correo.com')
    await page.fill('#password', '123456')
    await page.fill('#confirmPassword', '123456')
    await page.click('button:has-text("Crear cuenta")')

    await expect(page.locator('text=Cuenta creada')).toBeVisible()
  })
})
