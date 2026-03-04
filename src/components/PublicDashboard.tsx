import React, { useState } from 'react';
import { MOCK_LINKS, MOCK_NOTIFICATIONS } from '../data';
import { 
  Bell, 
  Link as LinkIcon, 
  Calendar, 
  Phone, 
  Stethoscope, 
  Activity,
  Monitor,
  FileText,
  ClipboardList,
  Newspaper,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { getShiftForDate, DOCTORS_INFO } from '../lib/shiftLogic';

const iconMap: Record<string, any> = {
  'monitor': Monitor,
  'file-text': FileText,
  'clipboard-list': ClipboardList,
  'phone': Phone,
};

export function PublicDashboard() {
  const navigate = useNavigate();
  const [expandedNotif, setExpandedNotif] = useState<string | null>(null);
  const today = new Date();
  const todayShift = getShiftForDate(today);
  
  const geralDoctor = DOCTORS_INFO[todayShift.geral];
  const uroDoctor = DOCTORS_INFO[todayShift.uro];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900">PLANTONISTAS</h2>
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700 capitalize">
                {today.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
          <p className="text-slate-500 text-sm mt-1">Informações e plantões do dia</p>
          <div className="md:hidden flex items-center gap-2 mt-2 px-3 py-1 bg-slate-100 rounded-full w-fit">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700 capitalize">
              {today.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
        <Link 
          to="/login"
          className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors"
        >
          Acesso Restrito
        </Link>
      </div>

      {/* Plantões Flutuantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Cirurgia Geral - Verde */}
        <div className="bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/30 p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Stethoscope className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">Cirurgia Geral</h3>
            </div>
            {geralDoctor ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="font-bold text-lg">{geralDoctor.name}</p>
                <div className="flex items-center gap-2 mt-2 text-emerald-50">
                  <Phone className="w-4 h-4" />
                  <span>{geralDoctor.phone}</span>
                </div>
              </div>
            ) : (
              <p className="text-emerald-100">Nenhum plantonista escalado</p>
            )}
            <div className="mt-4 pt-4 border-t border-white/20">
              <button 
                onClick={() => navigate('/escala-completa')}
                className="text-sm font-semibold text-white flex items-center gap-2 hover:text-emerald-100 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Ver Escala Completa
              </button>
            </div>
          </div>
        </div>

        {/* Urologia - Azul */}
        <div className="bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/30 p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Stethoscope className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">Urologia</h3>
            </div>
            {uroDoctor ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="font-bold text-lg">{uroDoctor.name}</p>
                <div className="flex items-center gap-2 mt-2 text-blue-50">
                  <Phone className="w-4 h-4" />
                  <span>{uroDoctor.phone}</span>
                </div>
              </div>
            ) : (
              <p className="text-blue-100">Nenhum plantonista escalado</p>
            )}
            <div className="mt-4 pt-4 border-t border-white/20">
              <button 
                onClick={() => navigate('/escala-completa')}
                className="text-sm font-semibold text-white flex items-center gap-2 hover:text-blue-100 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Ver Escala Completa
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notificações e Notícias */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notificações */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-50 flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold text-slate-800">Avisos Importantes</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {MOCK_NOTIFICATIONS.map(notification => {
                const isExpanded = expandedNotif === notification.id;
                return (
                  <div 
                    key={notification.id} 
                    onClick={() => setExpandedNotif(isExpanded ? null : notification.id)}
                    className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-slate-900 pr-4">{notification.title}</h4>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={cn(
                          "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full",
                          notification.priority === 'high' ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"
                        )}>
                          {notification.date}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-hospital-primary" />
                        )}
                      </div>
                    </div>
                    
                    <p className={cn(
                      "text-sm text-slate-600 mt-1 leading-relaxed whitespace-pre-line transition-all duration-300",
                      isExpanded ? "line-clamp-none" : "line-clamp-2"
                    )}>
                      {notification.content}
                    </p>

                    {isExpanded && notification.imageUrl && (
                      <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                        <img src={notification.imageUrl} alt="Anexo do aviso" className="w-full h-auto object-contain bg-slate-50" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notícias do Portal */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-slate-800">Notícias do Portal</h3>
              </div>
              <a 
                href="https://www.hospitalmetropolitano.pb.gov.br/noticias/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-semibold text-hospital-primary flex items-center gap-1 hover:underline"
              >
                Ver todas <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="p-6 text-center">
              <p className="text-sm text-slate-500 mb-4">Acesse as últimas atualizações e notícias oficiais do Hospital Metropolitano Dom José Maria Pires.</p>
              <a 
                href="https://www.hospitalmetropolitano.pb.gov.br/noticias/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                Acessar Portal de Notícias
              </a>
            </div>
          </div>
        </div>

        {/* Links Importantes */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden sticky top-24">
            <div className="p-4 border-b border-slate-50 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-slate-400" />
              <h3 className="font-semibold text-slate-800">Links Úteis</h3>
            </div>
            <div className="p-4 space-y-3">
              {MOCK_LINKS.map(link => {
                const Icon = iconMap[link.icon] || LinkIcon;
                return (
                  <a 
                    key={link.id} 
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-hospital-primary/30 hover:bg-hospital-secondary/50 transition-all group"
                  >
                    <div className="bg-slate-50 p-2 rounded-lg group-hover:bg-white group-hover:text-hospital-primary transition-colors mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-sm text-slate-700 group-hover:text-hospital-primary block">{link.title}</span>
                      {link.credentials && (
                        <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 font-mono whitespace-pre-line leading-relaxed">
                          {link.credentials}
                        </div>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





