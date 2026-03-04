import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Plane, 
  FileSpreadsheet, 
  LogOut, 
  Menu, 
  X,
  Stethoscope,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../../lib/utils';

function SidebarItem({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
        active 
          ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" 
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", active ? "text-white" : "text-slate-400 group-hover:text-slate-900")} />
      <span className="font-medium text-sm">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
    </Link>
  );
}

export function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Painel Admin' },
    { to: '/admin/escalas', icon: Calendar, label: 'Gerar Escalas' },
    { to: '/admin/ferias', icon: Plane, label: 'Gestão de Férias' },
    { to: '/admin/planilhas', icon: FileSpreadsheet, label: 'Planilhas' },
  ];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/20">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">Área Restrita</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administração</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.to} 
              {...item} 
              active={location.pathname === item.to} 
            />
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100 space-y-2">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Sair do Admin</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-slate-900 w-6 h-6" />
          <span className="font-bold text-slate-900">Admin</span>
        </div>
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
            <div className="mt-auto pt-6 border-t border-slate-100">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium text-sm">Sair</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 mt-16 lg:mt-0">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
