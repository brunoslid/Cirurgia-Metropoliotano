import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Stethoscope,
  Calendar
} from 'lucide-react';
import { cn } from './lib/utils';

// Public Components
import { PublicDashboard } from './components/PublicDashboard';
import { PublicEscalas } from './components/PublicEscalas';
import { Dashboard } from './components/Dashboard';
import { Patients } from './components/Patients';
import { Protocols } from './components/Protocols';
import { Assistant } from './components/Assistant';
import { Login } from './components/Login';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Escalas } from './components/admin/Escalas';
import { Ferias } from './components/admin/Ferias';
import { Planilhas } from './components/admin/Planilhas';

function SidebarItem({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
        active 
          ? "bg-hospital-primary text-white shadow-lg shadow-hospital-primary/20" 
          : "text-slate-500 hover:bg-hospital-secondary hover:text-hospital-primary"
      )}
    >
      <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", active ? "text-white" : "text-slate-400 group-hover:text-hospital-primary")} />
      <span className="font-medium text-sm">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
    </Link>
  );
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { to: '/', icon: LayoutDashboard, label: 'Painel Geral' },
    { to: '/escala-completa', icon: Calendar, label: 'Escala Completa' },
    { to: '/mapa', icon: Stethoscope, label: 'Mapa Cirúrgico' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 p-6 sticky top-0 h-screen">
        <Link to="/" className="flex flex-col items-center gap-3 mb-8 px-2 hover:opacity-80 transition-opacity">
          <img 
            src="https://www.hospitalmetropolitano.pb.gov.br/wp-content/uploads/logo-1-2.png" 
            alt="Hospital Metropolitano PB" 
            className="h-12 object-contain mb-2"
            referrerPolicy="no-referrer"
          />
          <div className="text-center">
            <h1 className="font-black text-slate-900 leading-tight text-sm uppercase tracking-tighter">Cirurgia Geral Metropolitano ---</h1>
          </div>
        </Link>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.to} 
              {...item} 
              active={location.pathname === item.to} 
            />
          ))}
        </nav>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-50">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img 
            src="https://www.hospitalmetropolitano.pb.gov.br/wp-content/uploads/logo-1-2.png" 
            alt="Hospital Metropolitano PB" 
            className="h-8 object-contain"
            referrerPolicy="no-referrer"
          />
          <h1 className="font-black text-slate-900 text-[10px] uppercase tracking-tighter leading-tight">
            Cirurgia Geral Metropolitano ---
          </h1>
        </Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-slate-900/50 z-40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <aside className="w-64 h-full bg-white p-6 flex flex-col" onClick={e => e.stopPropagation()}>
            <nav className="space-y-2 mt-12">
              {menuItems.map((item) => (
                <SidebarItem 
                  key={item.to} 
                  {...item} 
                  active={location.pathname === item.to} 
                />
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 mt-16 lg:mt-0">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><PublicDashboard /></PublicLayout>} />
        <Route path="/escala-completa" element={<PublicLayout><PublicEscalas /></PublicLayout>} />
        <Route path="/mapa" element={<PublicLayout><Dashboard /></PublicLayout>} />
        <Route path="/pacientes" element={<PublicLayout><Patients /></PublicLayout>} />
        <Route path="/protocolos" element={<PublicLayout><Protocols /></PublicLayout>} />
        <Route path="/assistente" element={<PublicLayout><Assistant /></PublicLayout>} />
        
        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="escalas" element={<Escalas />} />
          <Route path="ferias" element={<Ferias />} />
          <Route path="planilhas" element={<Planilhas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}





