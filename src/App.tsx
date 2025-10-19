import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Sections / components (igual que en mi versión)
import Navbar from "./components/Navbar";
import HeroSlider from "./components/HeroSlider";
import Features from "./components/Features";
import About from "./components/About";
import Services from "./components/Services";
import WorkingProcess from "./components/WorkingProcess";
import Counters from "./components/Counters";
import Projects from "./components/Projects";
import Testimonials from "./components/Testimonials";
import ClientLogos from "./components/ClientLogos";
import BlogFeed from "./components/BlogFeed";
import BookingForm from "./components/BookingForm";
import Footer from "./components/Footer";

// Pages
import Login from "./pages/Login";
import Registro from "./pages/Registro";

// Home (página principal) — ahora con TODAS las secciones
const Home = () => {
  return (
    <div className="font-sans overflow-x-hidden bg-white text-slate-800">
      <Navbar />
      <HeroSlider />
      <Features />
      <About />
      <Services />
      <WorkingProcess />
      <Counters />
      <Projects />
      <Testimonials />
      <ClientLogos />
      <BlogFeed />
      <BookingForm />
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registro />} />
        <Route path="/registro" element={<Registro />} />

        {/* fallback opcional: vuelve al home */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}
