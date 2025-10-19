import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Registro = () => {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return re.test(email)
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (nombre.trim() === '') {
      setErrorMessage('El nombre es obligatorio.')
      return
    }

    if (!validateEmail(email)) {
      setErrorMessage('Por favor, ingresa un email válido.')
      return
    }

    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.')
      return
    }

    // Aquí va la lógica de registro con el backend
    setErrorMessage('') 

    // Redirigir al login después de registro exitoso
    navigate('/login')
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Crear cuenta</h2>

        {errorMessage && (
          <div className="mb-4 text-red-500 text-center">{errorMessage}</div>
        )}

        <form onSubmit={handleRegister}>
        <div className="mb-4">
            <label className="block text-gray-600" htmlFor="email">
              Nombre Completo
            </label>
            <input
              type="text"
              id="name"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Franco Javier Torrez Alvarado"
            />
          </div>


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

          <div className="mb-4">
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

          <div className="mb-6">
            <label className="block text-gray-600" htmlFor="confirmPassword">
              Confirmar contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              Crear cuenta
            </button>
          </div>
        </form>

        <p className="text-center text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <span
            className="text-orange-500 cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  )
}

export default Registro
