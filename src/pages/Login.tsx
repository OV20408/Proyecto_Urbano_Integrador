import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

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

    setErrorMessage('')
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fondo con gradiente base */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-orange-100 to-amber-50"></div>
      
      {/* Blobs animados de fondo */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>
      <div className="blob blob-4"></div>
      
      {/* Card Principal */}
      <div className="relative z-10 w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          
          {/* Lado Izquierdo - Animación */}
          <div className="md:w-1/2 relative overflow-hidden min-h-[300px] md:min-h-[600px]">
            {/* Fondo con gradiente naranja */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#f39a2e] via-[#f07a09] to-[#d96b08]"></div>
            
            {/* Blobs internos */}
            <div className="blob-inner blob-inner-1"></div>
            <div className="blob-inner blob-inner-2"></div>
            <div className="blob-inner blob-inner-3"></div>
            
            {/* Contenido */}
            <div className="relative z-10 flex flex-col justify-between p-8 md:p-12 text-white h-full">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-4 border-white flex items-center justify-center backdrop-blur-sm bg-white/10">
                  <div className="w-6 h-6 rounded-full border-2 border-white"></div>
                </div>
                <span className="text-2xl font-bold tracking-wider">MARO</span>
              </div>
              
              {/* Texto Central */}
              <div className="space-y-4 my-8">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Welcome Page
                </h1>
                <p className="text-lg md:text-xl text-white/90">
                  Sign in to<br />continue access
                </p>
              </div>
              
              {/* Footer */}
              <div className="text-white/80 text-sm">
                www.yoursite.com
              </div>
            </div>
          </div>

          {/* Lado Derecho - Formulario */}
          <div className="md:w-1/2 p-8 md:p-12 flex items-center">
            <div className="w-full max-w-md mx-auto space-y-6">
              
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Sign In</h2>
              </div>

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Input */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-0 py-3 border-0 border-b-2 border-gray-300 focus:border-[#f39a2e] focus:ring-0 outline-none transition-colors bg-transparent text-gray-800"
                    placeholder="tu@email.com"
                  />
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-0 py-3 border-0 border-b-2 border-gray-300 focus:border-[#f39a2e] focus:ring-0 outline-none transition-colors bg-transparent text-gray-800"
                    placeholder="••••••••"
                  />
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-sm text-gray-600 hover:text-[#f39a2e] transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  onClick={() => navigate('/Dashboard')}
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#f39a2e] to-[#f07a09] text-white font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  INGRESAR
                  <svg 
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </form>

              {/* Sign Up Link */}
              <p className="text-center text-gray-600 text-sm">
                ¿No tienes cuenta?{' '}
                <button
                  onClick={() => navigate('/registro')}
                  className="text-[#f39a2e] hover:text-[#f07a09] font-semibold transition-colors"
                >
                  Regístrate
                </button>
              </p>
            </div>
          </div>
          
        </div>
      </div>

      {/* Estilos CSS para las animaciones */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes float-reverse {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-30px, 40px) scale(0.9);
          }
          66% {
            transform: translate(20px, -30px) scale(1.1);
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(20px, 20px) scale(1.05);
          }
        }

        /* Blobs de fondo */
        .blob {
          position: absolute;
          border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
          filter: blur(60px);
          opacity: 0.4;
        }

        .blob-1 {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #f39a2e 0%, #f07a09 100%);
          top: -10%;
          left: -10%;
          animation: float 20s ease-in-out infinite;
        }

        .blob-2 {
          width: 350px;
          height: 350px;
          background: linear-gradient(135deg, #ff9a56 0%, #ff6b35 100%);
          bottom: -15%;
          left: 20%;
          animation: float-reverse 25s ease-in-out infinite;
          animation-delay: -5s;
        }

        .blob-3 {
          width: 450px;
          height: 450px;
          background: linear-gradient(135deg, #ffa940 0%, #ff7e5f 100%);
          top: 30%;
          right: -20%;
          animation: float-slow 30s ease-in-out infinite;
          animation-delay: -10s;
        }

        .blob-4 {
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, #feb47b 0%, #ff7e5f 100%);
          bottom: 20%;
          right: 10%;
          animation: float 22s ease-in-out infinite;
          animation-delay: -15s;
        }

        /* Blobs internos del lado izquierdo */
        .blob-inner {
          position: absolute;
          border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
          filter: blur(40px);
          opacity: 0.3;
        }

        .blob-inner-1 {
          width: 250px;
          height: 250px;
          background: rgba(255, 255, 255, 0.2);
          top: 10%;
          left: -10%;
          animation: float 18s ease-in-out infinite;
        }

        .blob-inner-2 {
          width: 200px;
          height: 200px;
          background: rgba(255, 255, 255, 0.15);
          bottom: 20%;
          right: -5%;
          animation: float-reverse 22s ease-in-out infinite;
          animation-delay: -8s;
        }

        .blob-inner-3 {
          width: 300px;
          height: 300px;
          background: rgba(255, 255, 255, 0.1);
          top: 40%;
          right: 10%;
          animation: float-slow 25s ease-in-out infinite;
          animation-delay: -12s;
        }
      `}</style>
    </div>
  )
}

export default Login