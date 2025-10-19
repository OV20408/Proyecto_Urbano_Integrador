import img1 from "../assets/hero-img1.webp";
import img2 from "../assets/hero-img2.webp";

export default function Footer() {
  return (
    <footer id="footer" className="bg-slate-900 text-white">
      {/* Top */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <a href="#" className="flex items-center gap-2">
              <span className="inline-block w-8 h-8 rounded bg-orange-500" />
              <span className="font-semibold">Induste</span>
            </a>

            <div className="flex-1 md:flex-none">
              <div className="grid md:grid-cols-[1fr,auto] items-center gap-5">
                <div>
                  <h4 className="text-gradient font-semibold">SUBSCRIBE NOW</h4>
                  <h3 className="text-2xl font-bold">GET UPDATE EVERYTHING</h3>
                </div>
                <form className="flex">
                  <input type="email" placeholder="Enter your email" required className="px-4 h-12 rounded-l-lg w-full text-slate-900" />
                  <button className="px-4 h-12 rounded-r-lg bg-orange-500 hover:bg-orange-600"><i className="icofont-paper-plane"/></button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="h-1 bg-orange-600"></div>
      </div>

      {/* Center */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 grid gap-10 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold">CONTACT US</h3>
            <ul className="mt-4 space-y-2 text-slate-300">
              <li><span className="text-white">Location:</span> Your address goes here.</li>
              <li><span className="text-white">Phone:</span> <a href="tel:+0123456789" className="hover:underline">0123456789</a></li>
              <li><span className="text-white">Web:</span> <a href="https://www.example.com" className="hover:underline">www.example.com</a></li>
              <li><span className="text-white">Email:</span> <a href="mailto:demo@example.com" className="hover:underline">demo@example.com</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">RECENT NEWS</h3>
            <ul className="mt-4 space-y-4">
              <li className="flex gap-3">
                <a href="#" className="shrink-0"><img src={img1} className="w-16 h-16 object-cover rounded"/></a>
                <div>
                  <a href="#" className="hover:underline">Lorem Ipsum simply dumme printing and type industry.</a>
                  <div className="text-xs text-slate-400">03 February, 2021</div>
                </div>
              </li>
              <li className="flex gap-3">
                <a href="#" className="shrink-0"><img src={img2} className="w-16 h-16 object-cover rounded"/></a>
                <div>
                  <a href="#" className="hover:underline">Lorem Ipsum simply dumme printing and type industry.</a>
                  <div className="text-xs text-slate-400">03 February, 2021</div>
                </div>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">OUR SERVICES</h3>
            <ul className="mt-4 space-y-2 text-slate-300">
              <li><a href="#" className="hover:underline">Energy & Utilities</a></li>
              <li><a href="#" className="hover:underline">Industrial Manufacturing</a></li>
              <li><a href="#" className="hover:underline">Industrial Automation</a></li>
              <li><a href="#" className="hover:underline">Mechanical Engineering</a></li>
              <li><a href="#" className="hover:underline">Industrial Construction</a></li>
              <li><a href="#" className="hover:underline">Oil & Gas Energy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">QUICK LINKS</h3>
            <ul className="mt-4 space-y-2 text-slate-300">
              <li><a href="#" className="hover:underline">Company</a></li>
              <li><a href="#" className="hover:underline">Help Center</a></li>
              <li><a href="#" className="hover:underline">Management</a></li>
              <li><a href="#" className="hover:underline">Our Team</a></li>
              <li><a href="#" className="hover:underline">Career</a></li>
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <p className="text-sm text-slate-400">
            &copy; 2025 Induste • Made with <i className="icofont-heart text-orange-500"/> by{" "}
            <a className="underline" href="https://hasthemes.com/" target="_blank" rel="noreferrer">HasThemes</a>
          </p>
          <ul className="flex items-center gap-6 text-sm">
            <li><a href="#" target="_blank" className="hover:underline">Facebook</a></li>
            <li><a href="#" target="_blank" className="hover:underline">Twitter</a></li>
            <li><a href="#" target="_blank" className="hover:underline">Instagram</a></li>
            <li><a href="#" target="_blank" className="hover:underline">LinkedIn</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
