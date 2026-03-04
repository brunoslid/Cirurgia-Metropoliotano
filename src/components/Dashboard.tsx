import React from 'react';
import { MOCK_SURGERIES } from '../data';
import { Clock, Users, Calendar, ClipboardList } from 'lucide-react';
import { cn } from '../lib/utils';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Mapa Cirúrgico</h2>
          <p className="text-slate-500 text-sm">Programação de Procedimentos Eletivos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Surgery Schedule */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-hospital-primary/5">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-hospital-primary" />
              <h3 className="font-semibold text-slate-800">Procedimentos Programados</h3>
            </div>
            <span className="text-xs font-bold text-hospital-primary bg-white px-3 py-1 rounded-full shadow-sm">
              {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Horário</th>
                  <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Procedimento</th>
                  <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Paciente</th>
                  <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Cirurgião</th>
                  <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Sala</th>
                  <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {MOCK_SURGERIES.map((surgery) => (
                  <tr key={surgery.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {surgery.time}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-hospital-primary transition-colors">
                        {surgery.procedure}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                          {surgery.patientName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm text-slate-600">{surgery.patientName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Users className="w-4 h-4 text-slate-400" />
                        {surgery.surgeon}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                        {surgery.room}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full",
                        surgery.status === 'completed' ? "bg-emerald-100 text-emerald-700" :
                        surgery.status === 'in-progress' ? "bg-orange-100 text-orange-700 animate-pulse" :
                        "bg-blue-100 text-blue-700"
                      )}>
                        {surgery.status === 'completed' ? 'Concluída' :
                         surgery.status === 'in-progress' ? 'Em Curso' : 'Agendada'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {MOCK_SURGERIES.length === 0 && (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">Nenhum procedimento eletivo programado para hoje.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
