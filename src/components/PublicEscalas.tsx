import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Printer, Phone } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, setMonth, setYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getShiftForDate, DOCTORS_INFO } from '../lib/shiftLogic';

export function PublicEscalas() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(setMonth(currentDate, parseInt(e.target.value)));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(setYear(currentDate, parseInt(e.target.value)));
  };

  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(i);
    return { value: i, label: format(d, 'MMMM', { locale: ptBR }) };
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 1 + i);

  const handlePrint = () => {
    // Generate CSV
    const headers = ['Dia', 'Cirurgia Geral (Dia)', 'Cirurgia Geral (Noite)', 'Urologia'];
    const csvRows = [headers.join(',')];

    daysInMonth.forEach(day => {
      const autoShift = getShiftForDate(day);
      const geralDoc = DOCTORS_INFO[autoShift.geral];
      const uroDoc = DOCTORS_INFO[autoShift.uro];
      
      const row = [
        format(day, 'dd/MM/yyyy'),
        `"${geralDoc?.name || autoShift.geral}"`,
        `"${geralDoc?.name || autoShift.geral}"`,
        `"${uroDoc?.name || autoShift.uro}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = "\uFEFF" + csvRows.join('\n'); // Add BOM for Excel compatibility
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Escala_${format(currentDate, 'MMMM_yyyy', { locale: ptBR })}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Trigger Print
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="space-y-6">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          aside, nav, button, .no-print, header { display: none !important; }
          main { margin: 0 !important; padding: 0 !important; }
          .print-container { border: none !important; shadow: none !important; }
          .print-title { display: block !important; margin-bottom: 20px; }
          body { background: white !important; }
          table { width: 100% !important; border-collapse: collapse !important; }
          th, td { border: 1px solid #e2e8f0 !important; padding: 8px !important; }
        }
        .print-title { display: none; }
      `}} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Escala Completa</h2>
          <p className="text-slate-500 text-sm">Visualização da escala médica anual</p>
        </div>
        <button 
          onClick={handlePrint}
          className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 transition-colors"
        >
          <Printer className="w-4 h-4" />
          Imprimir Escala / Gerar PDF
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden print-container">
        <div className="print-title p-6 text-center border-b border-slate-100">
          <h1 className="text-xl font-bold uppercase">Escala Médica - Cirurgia Geral / Urologia</h1>
          <h2 className="text-lg font-semibold uppercase text-slate-600">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </h2>
          <p className="text-sm text-slate-500">Hospital Metropolitano Dom José Maria Pires</p>
        </div>

        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between bg-slate-50/50 gap-4 no-print">
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200">
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <button onClick={nextMonth} className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200">
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <select 
              value={currentDate.getMonth()} 
              onChange={handleMonthChange}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 capitalize focus:outline-none focus:ring-2 focus:ring-hospital-primary/20 cursor-pointer"
            >
              {months.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            
            <select 
              value={currentDate.getFullYear()} 
              onChange={handleYearChange}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-hospital-primary/20 cursor-pointer"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 w-24">Dia</th>
                  <th className="p-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Cirurgia Geral (Dia)</th>
                  <th className="p-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Cirurgia Geral (Noite)</th>
                  <th className="p-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Urologia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {daysInMonth.map((day, idx) => {
                  const autoShift = getShiftForDate(day);
                  const geralDoc = DOCTORS_INFO[autoShift.geral];
                  const uroDoc = DOCTORS_INFO[autoShift.uro];
                  
                  return (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700">{format(day, 'dd')}</span>
                          <span className="text-xs text-slate-400 capitalize">{format(day, 'EEE', { locale: ptBR })}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="text-sm font-medium text-slate-700">{geralDoc?.name || autoShift.geral}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-sm font-medium text-slate-700">{geralDoc?.name || autoShift.geral}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-sm font-medium text-slate-700">{uroDoc?.name || autoShift.uro}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Lista de Contatos dos Médicos */}
          <div className="mt-12 pt-8 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Phone className="w-4 h-4 text-hospital-primary" />
              Contatos da Equipe
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.values(DOCTORS_INFO).map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-sm font-semibold text-slate-700">{doc.name}</span>
                  <span className="text-sm font-mono text-slate-500">{doc.phone}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
