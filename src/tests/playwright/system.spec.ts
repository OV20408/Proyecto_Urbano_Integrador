import { test, expect } from '@playwright/test'

test.describe('Pruebas de Sistema - Flujo completo', () => {
  test('El sistema carga, el usuario inicia sesión y cierra sesión', async ({ page }) => {
    await page.goto('http://localhost:5173/')
    await expect(page).toHaveTitle(/Integrador/i)

    // Ir al login
    await page.click('text=Iniciar sesión')
    await expect(page.getByRole('heading', { name: /Iniciar sesión/i })).toBeVisible()

    // Login
    await page.fill('input[type=email]', 'usuario@correo.com')
    await page.fill('input[type=password]', '123456')
    await page.click('button:has-text("Iniciar sesión")')
    await expect(page).toHaveURL(/.*dashboard/)

    // Logout
    await page.click('text=Cerrar sesión')
    await expect(page).toHaveURL(/.*login/)
  })
})



