import { assets } from '../assets/assets';

export default function WorkingProcess() {
  return (
    <div className="relative py-20 bg-[#f8f8f8] overflow-hidden">
      {/* Background Shape */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#d4af37] to-transparent"></div>
      </div>

      <div className="container mx-auto px-3 relative z-10">
        {/* Section Header */}
        <div className="mb-16">
          <h4 className="text-[#d4af37] text-lg font-['Teko'] tracking-wider mb-2">
            Flujo de Nuestro Trabajo
          </h4>
          <h2 className="text-5xl md:text-6xl font-['Teko'] font-medium text-gray-900">
            Cómo Funciona?
          </h2>
        </div>

        {/* Working Process Steps */}
        <div className="relative h-[300px] md:h-[400px] mb-20">
          {/* Step 1 - Planning */}
          <div className="absolute left-[5%] top-1/4 transform -translate-y-1/2">
            <div className="flex flex-col items-center">
              <div className="bg-white rounded-full p-8 shadow-lg mb-4 group hover:bg-[#ffc291] transition-colors">
                <img
                  src={assets.workingImage1}
                  alt="Planning"
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h3 className="text-3xl font-['Teko'] font-medium text-gray-900">
                Planning
              </h3>
            </div>
          </div>

          {/* Arrow 1 */}
          <div className="hidden md:block absolute left-[25%] top-[30%]">
            <img
              src="/assets/images/icons/working-process-arrow-1.png"
              alt=""
              className="w-32 h-auto opacity-30"
            />
          </div>

          {/* Step 2 - Development */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-col items-center">
              <div className="bg-white rounded-full p-8 shadow-lg mb-4 group hover:bg-[#ffc291] transition-colors">
                <img
                  src={assets.workingImage2}
                  alt="Development"
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h3 className="text-3xl font-['Teko'] font-medium text-gray-900">
                Development
              </h3>
            </div>
          </div>

          {/* Arrow 2 */}
          <div className="hidden md:block absolute right-[25%] top-[30%]">
            <img
              src="/assets/images/icons/working-process-arrow-2.png"
              alt=""
              className="w-32 h-auto opacity-30"
            />
          </div>

          {/* Step 3 - Launch */}
          <div className="absolute right-[5%] top-1/4 transform -translate-y-1/2">
            <div className="flex flex-col items-center">
              <div className="bg-white rounded-full p-8 shadow-lg mb-4 group hover:bg-[#ffc291] transition-colors">
                <img
                  src={assets.workingImage3}
                  alt="Launch"
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h3 className="text-3xl font-['Teko'] font-medium text-gray-900">
                Launch
              </h3>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
}