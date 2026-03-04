import React from 'react';
import { Calendar, FileSpreadsheet, Plane, Users } from 'lucide-react';

export function AdminDashboard() {
  const cards = [
    { title: 'Gerar Escalas', desc: 'Organize plantões por mês e médico', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50', link: '/admin/escalas' },
    { title: 'Gestão de Férias', desc: 'Controle de férias da equipe', icon: Plane, color: 'text-emerald-600', bg: 'bg-emerald-50', link: '/admin/ferias' },
    { title: 'Planilhas', desc: 'Relatórios e dados exportáveis', icon: FileSpreadsheet, color: 'text-purple-600', bg: 'bg-purple-50', link: '/admin/planilhas' },
    { title: 'Equipe Médica', desc: 'Gerenciar cadastro de médicos', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50', link: '/admin/equipe' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Painel Administrativo</h2>
        <p className="text-slate-500 text-sm">Bem-vindo à área de gestão exclusiva.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <a key={i} href={card.link} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-hospital-primary/30 hover:shadow-md transition-all group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${card.bg}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <h3 className="font-semibold text-slate-900 group-hover:text-hospital-primary transition-colors">{card.title}</h3>
            <p className="text-sm text-slate-500 mt-1">{card.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
