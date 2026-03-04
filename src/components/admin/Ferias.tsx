import React, { useState } from 'react';
import { Plane, Plus, Calendar, Trash2, User } from 'lucide-react';
import { DOCTORS_INFO, getShiftForDate } from '../../lib/shiftLogic';
import { format, addDays, parseISO, isWithinInterval, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Vacation {
  id: string;
  doctorId: string;
  startDate: string;
  endDate: string;
}

export function Ferias() {
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleAddVacation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !startDate || !endDate) return;

    const newVacation: Vacation = {
      id: Math.random().toString(36).substr(2, 9),
      doctorId: selectedDoctor,
      startDate,
      endDate,
    };

    setVacations([...vacations, newVacation]);
    setIsModalOpen(false);
    setSelectedDoctor('');
    setStartDate('');
    setEndDate('');
  };

  const handleDelete = (id: string) => {
    setVacations(vacations.filter(v => v.id !== id));
  };

  const getSubstitutionDays = (vacation: Vacation) => {
    const start = parseISO(vacation.startDate);
    const end = parseISO(vacation.endDate);
    const days = eachDayOfInterval({ start, end });
    const doctor = DOCTORS_INFO[vacation.doctorId];
    
    if (!doctor) return [];

    const substitutionDays: Date[] = [];

    days.forEach(day => {
      const shift = getShiftForDate(day);
      if (doctor.specialty.includes('Cirurgia Geral')) {
        if (shift.geral === vacation.doctorId) {
          substitutionDays.push(day);
        }
      } 
      if (doctor.specialty.includes('Urologia')) {
        if (shift.uro === vacation.doctorId) {
          substitutionDays.push(day);
        }
      }
    });

    return substitutionDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestão de Férias</h2>
          <p className="text-slate-500 text-sm">Controle de afastamentos e substituições da equipe</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-hospital-primary text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-hospital-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Registrar Férias
        </button>
      </div>

      {vacations.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
          <Plane className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700">Nenhuma férias programada</h3>
          <p className="text-slate-500 text-sm mt-1">Clique em "Registrar Férias" para adicionar um novo período de afastamento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {vacations.map(vacation => {
            const doctor = DOCTORS_INFO[vacation.doctorId];
            const subDays = getSubstitutionDays(vacation);
            
            return (
              <div key={vacation.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{doctor?.name}</h3>
                      <p className="text-xs text-slate-500">{doctor?.specialty}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(vacation.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      Período de Afastamento
                    </h4>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-bold">Início</p>
                          <p className="font-medium text-slate-900">{format(parseISO(vacation.startDate), 'dd/MM/yyyy')}</p>
                        </div>
                        <div className="w-8 h-[1px] bg-slate-300"></div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-bold text-right">Fim</p>
                          <p className="font-medium text-slate-900">{format(parseISO(vacation.endDate), 'dd/MM/yyyy')}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <Plane className="w-4 h-4 text-orange-400" />
                      Plantões a Substituir ({subDays.length})
                    </h4>
                    {subDays.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {subDays.map((day, idx) => (
                          <span key={idx} className="bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1 rounded-lg text-sm font-medium">
                            {format(day, "dd/MM (EEEE)", { locale: ptBR })}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 italic bg-slate-50 p-4 rounded-xl border border-slate-100">
                        Nenhum plantão agendado para este médico no período selecionado.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Registro */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Registrar Férias</h3>
              <p className="text-sm text-slate-500">Adicione um novo período de afastamento</p>
            </div>
            <form onSubmit={handleAddVacation} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Médico</label>
                <select 
                  required
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hospital-primary/20"
                >
                  <option value="">Selecione o médico...</option>
                  {Object.entries(DOCTORS_INFO).map(([id, doc]) => (
                    <option key={id} value={id}>{doc.name} ({doc.specialty})</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Data de Início</label>
                  <input 
                    type="date" 
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hospital-primary/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Data de Fim</label>
                  <input 
                    type="date" 
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hospital-primary/20"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-hospital-primary text-white font-semibold rounded-xl hover:bg-hospital-primary/90 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
