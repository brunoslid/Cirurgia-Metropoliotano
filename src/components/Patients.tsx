import React from 'react';
import { MOCK_PATIENTS } from '../data';
import { Search, Filter, MoreVertical, UserPlus } from 'lucide-react';
import { cn } from '../lib/utils';

export function Patients() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-900">Gestão de Pacientes</h2>
        <button className="bg-hospital-primary text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-hospital-primary/90 transition-colors">
          <UserPlus className="w-4 h-4" />
          Novo Paciente
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome, leito ou diagnóstico..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hospital-primary/20"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 flex items-center gap-2 hover:bg-slate-50">
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Paciente</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Leito</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Diagnóstico</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_PATIENTS.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-hospital-secondary text-hospital-primary flex items-center justify-center font-bold text-xs">
                        {patient.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{patient.name}</p>
                        <p className="text-xs text-slate-500">{patient.age} anos</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                      {patient.bed}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {patient.diagnosis}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-[10px] font-bold uppercase px-2 py-1 rounded-full",
                      patient.status === 'critical' ? "bg-red-100 text-red-700" :
                      patient.status === 'post-op' ? "bg-emerald-100 text-emerald-700" :
                      patient.status === 'pre-op' ? "bg-blue-100 text-blue-700" :
                      "bg-slate-100 text-slate-700"
                    )}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-1 hover:bg-slate-200 rounded-lg transition-colors text-slate-400">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
