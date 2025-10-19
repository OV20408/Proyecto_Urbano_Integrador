import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  // Validación de correo electrónico
  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return re.test(email)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      setErrorMessage('Por favor, ingresa un email válido.')
      return
    }

    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    // Aquí se puede hacer la lógica de autenticación con backend
    setErrorMessage('') // Limpiar el mensaje de error

    // Redirigir a la página principal si el login es exitoso
    navigate('/dashboard')
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Iniciar sesión</h2>

        {errorMessage && (
          <div className="mb-4 text-red-500 text-center">{errorMessage}</div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-600" htmlFor="email">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="example@example.com"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-600" htmlFor="password">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="********"
            />
          </div>

          <div className="mb-6 text-center">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold rounded-full hover:scale-105 transition-transform"
            >
              Iniciar sesión
            </button>
          </div>
        </form>

        <p className="text-center text-gray-600">
          ¿No tienes cuenta?{' '}
          <span
            className="text-orange-500 cursor-pointer"
            onClick={() => navigate('/registro')}
          >
            Regístrate
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login
