import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Registro = () => {
const [step, setStep] = useState<1 | 2>(1)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const validateEmail = (email: string) => { // ✅ Tipo agregado
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return re.test(email)
  }

  const handleNextStep = () => {
    if (nombre.trim() === '') {
      setErrorMessage('El nombre es obligatorio.')
      return
    }

    if (!validateEmail(email)) {
      setErrorMessage('Por favor, ingresa un email válido.')
      return
    }

    setErrorMessage('')
    setStep(2)
  }

  const handleRegister = async (e: React.FormEvent) => { // ✅ Tipo agregado
    e.preventDefault()

    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.')
      return
    }

    setErrorMessage('')
    setLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombre,
          email: email,
          password: password
        })
      })

      const data = await response.json()

      if (response.ok) {
        console.log('✅ Usuario registrado:', data)
        navigate('/dashboard')
      } else {
        setErrorMessage(data.message || 'Error al registrar usuario')
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error)
      setErrorMessage('No se pudo conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  const stepContent = {
    1: {
      title: "Bienvenido",
      subtitle: "Crea tu cuenta"
    },
    2: {
      title: "Casi listo",
      subtitle: "Asegura tu cuenta"
    }
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
          
          {/* Lado Izquierdo - Formulario */}
          <div className="md:w-1/2 p-8 md:p-12 flex items-center order-2 md:order-1">
            <div className="w-full max-w-md mx-auto space-y-6">
              
              {/* Indicador de progreso */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step === 1 
                      ? 'bg-gradient-to-r from-[#f39a2e] to-[#f07a09] text-white scale-110' 
                      : 'bg-green-500 text-white'
                  }`}>
                    {step === 1 ? '1' : '✓'}
                  </div>
                  <div className={`h-1 w-16 rounded ${step === 2 ? 'bg-gradient-to-r from-[#f39a2e] to-[#f07a09]' : 'bg-gray-300'}`}></div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step === 2 
                      ? 'bg-gradient-to-r from-[#f39a2e] to-[#f07a09] text-white scale-110' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    2
                  </div>
                </div>
                <span className="text-sm text-gray-500 font-medium">Paso {step} de 2</span>
              </div>

              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  {step === 1 ? 'Crear Cuenta' : 'Información de Seguridad'}
                </h2>
                <p className="text-gray-600 text-sm">
                  {step === 1 ? 'Ingresa tus datos personales' : 'Protege tu cuenta con una contraseña segura'}
                </p>
              </div>

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-6">
                
                {/* Step 1 - Datos personales */}
                {step === 1 && (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="nombre" className="block text-sm font-medium text-gray-600">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        className="w-full px-0 py-3 border-0 border-b-2 border-gray-300 focus:border-[#f39a2e] focus:ring-0 outline-none transition-colors bg-transparent text-gray-800"
                        placeholder="Franco Javier Torrez Alvarado"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                        Correo Electrónico
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

                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full py-4 bg-gradient-to-r from-[#f39a2e] to-[#f07a09] text-white font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                      SIGUIENTE
                      <svg 
                        className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Step 2 - Contraseñas */}
                {step === 2 && (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                        Contraseña
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
                      <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
                        Confirmar Contraseña
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-0 py-3 border-0 border-b-2 border-gray-300 focus:border-[#f39a2e] focus:ring-0 outline-none transition-colors bg-transparent text-gray-800"
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        disabled={loading}
                        className="w-1/3 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:border-[#f39a2e] hover:text-[#f39a2e] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50"
                      >
                        <svg 
                          className="w-5 h-5 group-hover:-translate-x-1 transition-transform" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        ATRÁS
                      </button>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-2/3 py-4 bg-gradient-to-r from-[#f39a2e] to-[#f07a09] text-white font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            REGISTRANDO...
                          </>
                        ) : (
                          'REGISTRAR'
                        )}
                      </button>
                    </div>
                  </>
                )}
              </form>

              {/* Login Link */}
              <p className="text-center text-gray-600 text-sm">
                ¿Ya tienes cuenta?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-[#f39a2e] hover:text-[#f07a09] font-semibold transition-colors"
                >
                  Inicia sesión
                </button>
              </p>
            </div>
          </div>

          {/* Lado Derecho - Animación */}
          <div className="md:w-1/2 relative overflow-hidden min-h-[300px] md:min-h-[600px] order-1 md:order-2">
            {/* Fondo con gradiente naranja */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#f39a2e] via-[#f07a09] to-[#d96b08]"></div>
            
            {/* Blobs internos */}
            <div className="blob-inner blob-inner-1"></div>
            <div className="blob-inner blob-inner-2"></div>
            <div className="blob-inner blob-inner-3"></div>
            
            {/* Contenido */}
            <div className="relative z-10 flex flex-col justify-between p-8 md:p-12 text-white h-full">
              {/* Logo */}
              <div className="flex items-center justify-end gap-3">
                <span className="text-2xl font-bold tracking-wider">MARO</span>
                <div className="w-12 h-12 rounded-full border-4 border-white flex items-center justify-center backdrop-blur-sm bg-white/10">
                  <div className="w-6 h-6 rounded-full border-2 border-white"></div>
                </div>
              </div>
              
              {/* Texto Central - Dinámico según step */}
              <div className="space-y-4 my-8 text-right">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight transition-all duration-500">
                  {stepContent[step].title}
                </h1>
                <p className="text-lg md:text-xl text-white/90 transition-all duration-500">
                  {stepContent[step].subtitle}
                </p>
              </div>
              
              {/* Footer */}
              <div className="text-white/80 text-sm text-right">
                www.yoursite.com
              </div>
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
          right: -10%;
          animation: float 18s ease-in-out infinite;
        }

        .blob-inner-2 {
          width: 200px;
          height: 200px;
          background: rgba(255, 255, 255, 0.15);
          bottom: 20%;
          left: -5%;
          animation: float-reverse 22s ease-in-out infinite;
          animation-delay: -8s;
        }

        .blob-inner-3 {
          width: 300px;
          height: 300px;
          background: rgba(255, 255, 255, 0.1);
          top: 40%;
          left: 10%;
          animation: float-slow 25s ease-in-out infinite;
          animation-delay: -12s;
        }
      `}</style>
    </div>
  )
}

export default Registro