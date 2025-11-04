import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { WebSocketProvider } from "./components/WebSocketContext";

// Landing (público)
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

// Auth público
import Login from "./pages/Login";
import Registro from "./pages/Registro";

// Privado
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./pages/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

// Stubs privados
import Predicciones from "./pages/Predicciones";
import Alertas from "./pages/Alertas";
import AlertRules from "./pages/AlertRules";
import Reportes from "./pages/Reportes";
import Workflows from "./pages/Workflows";
import Perfil from "./pages/Perfil";
import Ajustes from "./pages/Ajustes";

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
    <WebSocketProvider>
      <Router>
        <Routes>
          {/* Público */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {/* Conserva ambas rutas pero redirige /register -> /registro */}
          <Route path="/register" element={<Navigate to="/registro" replace />} />
          <Route path="/registro" element={<Registro />} />

          {/* Privado con layout + protección */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/predicciones" element={<Predicciones />} />
            <Route path="/alertas" element={<Alertas />} />
            <Route path="/alertas/reglas" element={<AlertRules />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/workflows" element={<Workflows />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/ajustes" element={<Ajustes />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </WebSocketProvider>
  );
}