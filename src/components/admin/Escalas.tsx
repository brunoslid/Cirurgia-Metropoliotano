import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Save, RotateCcw, Sparkles, Loader2 } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, setMonth, setYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getShiftForDate } from '../../lib/shiftLogic';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export function Escalas() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [manualEdits, setManualEdits] = useState<Record<string, { geralDia?: string, geralNoite?: string, uro?: string }>>({});
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

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

  const handleEdit = (dateStr: string, field: 'geralDia' | 'geralNoite' | 'uro', value: string) => {
    setManualEdits(prev => ({
      ...prev,
      [dateStr]: {
        ...prev[dateStr],
        [field]: value
      }
    }));
  };

  const resetEdits = () => {
    if (window.confirm('Deseja restaurar a escala automática para este mês? Todas as alterações manuais serão perdidas.')) {
      const newEdits = { ...manualEdits };
      daysInMonth.forEach(day => {
        delete newEdits[format(day, 'yyyy-MM-dd')];
      });
      setManualEdits(newEdits);
    }
  };

  const handleAiAssist = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);

    try {
      const prompt = `
        Você é um assistente de alocação de escalas médicas.
        O mês atual visualizado é ${format(currentDate, 'MM/yyyy')}.
        O usuário solicitou a seguinte alteração: "${aiPrompt}"
        
        Retorne APENAS um array JSON válido com as alterações. Formato:
        [
          { "date": "YYYY-MM-DD", "field": "geralDia" | "geralNoite" | "uro", "value": "NOME DO MEDICO EM MAIUSCULO" }
        ]
        Não inclua crases (\`\`\`json) nem texto adicional. Apenas o array.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const jsonStr = response.text?.replace(/```json/g, '').replace(/```/g, '').trim();
      if (jsonStr) {
        const edits = JSON.parse(jsonStr);
        const newEdits = { ...manualEdits };
        
        edits.forEach((edit: any) => {
          if (edit.date && edit.field && edit.value) {
            if (!newEdits[edit.date]) newEdits[edit.date] = {};
            newEdits[edit.date][edit.field as 'geralDia' | 'geralNoite' | 'uro'] = edit.value;
          }
        });
        
        setManualEdits(newEdits);
        setAiPrompt('');
      }
    } catch (error) {
      console.error('Erro ao processar IA:', error);
      alert('Não foi possível processar a alteração. Tente novamente.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(i);
    return { value: i, label: format(d, 'MMMM', { locale: ptBR }) };
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 1 + i);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gerador de Escalas</h2>
          <p className="text-slate-500 text-sm">Distribuição automática de plantões por médico e dia</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={resetEdits}
            className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-slate-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Restaurar Automático
          </button>
          <button className="bg-hospital-primary text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-hospital-primary/90 transition-colors">
            <Save className="w-4 h-4" />
            Salvar Escala
          </button>
        </div>
      </div>

      {/* AI Assistant Box */}
      <div className="bg-hospital-secondary/30 p-4 rounded-2xl border border-hospital-primary/20 flex flex-col sm:flex-row gap-3">
        <input 
          type="text" 
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAiAssist()}
          placeholder="Ex: Troque o plantão do Ernesto pelo Carlos no dia 15..."
          className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hospital-primary/20"
        />
        <button 
          onClick={handleAiAssist}
          disabled={isAiLoading || !aiPrompt.trim()}
          className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Atualizar com IA
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between bg-slate-50/50 gap-4">
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
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const autoShift = getShiftForDate(day);
                  const edits = manualEdits[dateStr] || {};

                  return (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700">{format(day, 'dd')}</span>
                          <span className="text-xs text-slate-400 capitalize">{format(day, 'EEE', { locale: ptBR })}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <input 
                          type="text" 
                          value={edits.geralDia !== undefined ? edits.geralDia : autoShift.geral}
                          onChange={(e) => handleEdit(dateStr, 'geralDia', e.target.value)}
                          className="w-full bg-transparent border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-hospital-primary focus:ring-1 focus:ring-hospital-primary" 
                        />
                      </td>
                      <td className="p-3">
                        <input 
                          type="text" 
                          value={edits.geralNoite !== undefined ? edits.geralNoite : autoShift.geral}
                          onChange={(e) => handleEdit(dateStr, 'geralNoite', e.target.value)}
                          className="w-full bg-transparent border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-hospital-primary focus:ring-1 focus:ring-hospital-primary" 
                        />
                      </td>
                      <td className="p-3">
                        <input 
                          type="text" 
                          value={edits.uro !== undefined ? edits.uro : autoShift.uro}
                          onChange={(e) => handleEdit(dateStr, 'uro', e.target.value)}
                          className="w-full bg-transparent border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-hospital-primary focus:ring-1 focus:ring-hospital-primary" 
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


