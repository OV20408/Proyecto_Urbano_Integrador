import { test, expect } from '@playwright/test'

test.describe('Pruebas de Interfaz de Usuario', () => {
  test('La pantalla de Login muestra todos los elementos correctamente', async ({ page }) => {
    await page.goto('http://localhost:5173/login')

    // Espera que cargue el componente principal
    await page.waitForSelector('h2:text("Iniciar sesión")', { timeout: 10000 })

    // Verifica título
    await expect(page.getByRole('heading', { name: /Iniciar sesión/i })).toBeVisible()

    // Verifica campos de correo y contraseña con placeholders reales
    await expect(page.getByPlaceholder('ejemplo@email.com')).toBeVisible()
    await expect(page.getByPlaceholder('••••••••')).toBeVisible()

    // Verifica botón principal (usa texto INGRESAR)
    await expect(page.getByRole('button', { name: /INGRESAR/i })).toBeEnabled()

    // Verifica el texto de registro
    await expect(page.locator('text=¿No tienes cuenta?')).toBeVisible()
  })
})
