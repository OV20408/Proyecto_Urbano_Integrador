import { useEffect } from 'react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  threshold?: number;
}

export const EmergencyModal = ({ isOpen, onClose, message, threshold }: EmergencyModalProps) => {
  // Cerrar con ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay con animación */}
      <div
        className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-slideUp">
        {/* Header de emergencia */}
        <div className="bg-red-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg
                className="w-7 h-7 animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">⚠️ Alerta de Emergencia</h2>
              <p className="text-red-100 text-sm mt-1">
                Umbral de PM2.5 de aire tóxico está alto
              </p>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {threshold && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-sm text-gray-600 font-medium">Umbral máximo configurado:</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{threshold} µg/m³</p>
            </div>
          )}

          <div className="mb-6">
            <p className="text-gray-700 text-lg leading-relaxed">{message}</p>
          </div>

          {/* Botón de cerrar */}
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Entendido
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

