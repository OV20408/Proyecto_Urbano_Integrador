import { test, expect } from '@playwright/test'

test.describe('Pruebas de Interfaz de Usuario', () => {
  test('La pantalla de Login muestra todos los elementos correctamente', async ({ page }) => {
    await page.goto('http://localhost:5173/login')

    await page.waitForSelector('h2:text("Iniciar sesión")', { timeout: 10000 })

    await expect(page.getByRole('heading', { name: /Iniciar sesión/i })).toBeVisible()

    await expect(page.getByPlaceholder('ejemplo@email.com')).toBeVisible()
    await expect(page.getByPlaceholder('••••••••')).toBeVisible()

    await expect(page.getByRole('button', { name: /INGRESAR/i })).toBeEnabled()

    await expect(page.locator('text=¿No tienes cuenta?')).toBeVisible()
  })
})
