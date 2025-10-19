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
            WORKING PROCESS
          </h4>
          <h2 className="text-5xl md:text-6xl font-['Teko'] font-medium text-gray-900">
            HOW IT WORKS?
          </h2>
        </div>

        {/* Working Process Steps */}
        <div className="relative h-[300px] md:h-[400px] mb-20">
          {/* Step 1 - Planning */}
          <div className="absolute left-[5%] top-1/4 transform -translate-y-1/2">
            <div className="flex flex-col items-center">
              <div className="bg-white rounded-full p-8 shadow-lg mb-4 group hover:bg-[#d4af37] transition-colors">
                <img
                  src="/assets/images/icons/working-process-icon-1.png"
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
              <div className="bg-white rounded-full p-8 shadow-lg mb-4 group hover:bg-[#d4af37] transition-colors">
                <img
                  src="/assets/images/icons/working-process-icon-2.png"
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
              <div className="bg-white rounded-full p-8 shadow-lg mb-4 group hover:bg-[#d4af37] transition-colors">
                <img
                  src="/assets/images/icons/working-process-icon-3.png"
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

        {/* Video Section */}
        <div className="text-right">
          <div className="inline-flex items-center gap-4">
            <a
              href="https://youtu.be/MKjhBO2xQzg"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg group hover:bg-[#d4af37] transition-colors"
            >
              <span className="absolute inset-0 rounded-full border-2 border-[#d4af37] animate-ping opacity-75"></span>
              <i className="icofont-ui-play text-3xl text-[#d4af37] group-hover:text-white relative z-10"></i>
            </a>
            <div className="text-left">
              <span className="text-gray-900 font-['Teko'] text-xl">
                Watch 2 min <br /> Intro Video.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}