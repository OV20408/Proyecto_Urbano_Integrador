export default function BookingForm() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10">
        <div>
          <h4 className="text-gradient font-semibold">BOOKING NOW</h4>
          <h2 className="text-3xl md:text-4xl font-extrabold">BOOK FOR SERVICE</h2>
          <p className="mt-3 text-slate-600">It is a long established fact that a reader will be distracted by the readable.</p>
        </div>
        <div>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="border border-slate-200 rounded-lg px-4 h-11" placeholder="Name *" required />
            <input type="email" className="border border-slate-200 rounded-lg px-4 h-11" placeholder="Email *" required />
            <input className="border border-slate-200 rounded-lg px-4 h-11" placeholder="Phone *" required />
            <input className="border border-slate-200 rounded-lg px-4 h-11" placeholder="Location *" required />
            <select className="border border-slate-200 rounded-lg px-4 h-11 col-span-1 md:col-span-2">
              <option>Fuel Mining</option>
              <option>Cole Mining</option>
              <option>Gold Mining</option>
            </select>
            <div className="col-span-1 md:col-span-2 text-center">
              <button className="inline-flex items-center px-6 py-3 text-white bg-orange-600 hover:bg-orange-700 rounded-lg">
                <i className="icofont-ui-calendar mr-2" /> Booking Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
