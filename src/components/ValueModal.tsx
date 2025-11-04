import { useEffect, useState } from 'react';

interface ValueModalProps {
  value: number | null;
  onClose: () => void;
  userName?: string; // Opcional: para personalizar
}

export const ValueModal = ({ value, onClose, userName }: ValueModalProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animación de entrada
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Espera a que termine la animación
  };

  // Determinar color según el valor (puedes personalizar esta lógica)
  const getValueColor = (val: number | null) => {
    if (val === null) return 'text-gray-600';
    if (val < 30) return 'text-green-600';
    if (val < 70) return 'text-amber-600';
    return 'text-red-600';
  };

  const getGradientColor = (val: number | null) => {
    if (val === null) return 'from-gray-500 to-gray-600';
    if (val < 30) return 'from-green-500 to-green-600';
    if (val < 70) return 'from-amber-500 to-amber-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isVisible ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/0'
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          {/* Icono */}
          <div className="mb-4">
            <div 
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${getGradientColor(value)} text-white mb-4`}
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            
            {/* Título */}
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Último Valor Ambiental
            </h3>
            
            {userName && (
              <p className="text-sm text-gray-500 mb-2">
                👤 Usuario: <span className="font-semibold">{userName}</span>
              </p>
            )}
            
            <p className="text-sm text-gray-500 mb-6">
              📡 Dato recibido vía WebSocket
            </p>
          </div>

          {/* Valor principal */}
          <div className={`bg-gradient-to-br ${
            value === null 
              ? 'from-gray-50 to-gray-100' 
              : value < 30 
                ? 'from-green-50 to-green-100'
                : value < 70
                  ? 'from-amber-50 to-amber-100'
                  : 'from-red-50 to-red-100'
          } rounded-xl p-6 mb-6`}>
            <div className={`text-6xl font-bold ${getValueColor(value)}`}>
              {value !== null ? value : '-'}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Rango: 0 - 100 | ICA (Índice de Calidad del Aire)
            </div>
            
            {/* Indicador de nivel */}
            {value !== null && (
              <div className="mt-3">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  value < 30 
                    ? 'bg-green-200 text-green-800'
                    : value < 70
                      ? 'bg-amber-200 text-amber-800'
                      : 'bg-red-200 text-red-800'
                }`}>
                  {value < 30 ? '✓ Bueno' : value < 70 ? '⚠ Moderado' : '⚠️ Malo'}
                </span>
              </div>
            )}
          </div>

          {/* Botón cerrar */}
          <button
            onClick={handleClose}
            className={`w-full px-6 py-3 bg-gradient-to-r ${getGradientColor(value)} text-white font-semibold rounded-lg hover:shadow-xl transition-all shadow-lg`}
          >
            Cerrar y continuar
          </button>
        </div>
      </div>
    </div>
  );
};