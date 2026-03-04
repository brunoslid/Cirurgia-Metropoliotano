import React, { useState, useRef } from 'react';
import { FileSpreadsheet, Download, MessageSquare, Send, Loader2, Upload, FileCheck, AlertCircle, Calendar } from 'lucide-react';
import { getShiftForDate, DOCTORS_INFO } from '../../lib/shiftLogic';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as XLSX from 'xlsx';
import { GoogleGenAI, Type } from '@google/genai';

interface SheetData {
  name: string;
  data: any[][];
}

export function Planilhas() {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [modelSheets, setModelSheets] = useState<SheetData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const sheets: SheetData[] = wb.SheetNames.map(name => ({
          name,
          data: XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1 }) as any[][]
        }));
        setModelSheets(sheets);
        setChatHistory(prev => [...prev, { 
          role: 'assistant', 
          content: `Modelo "${file.name}" carregado com sucesso! Identifiquei ${sheets.length} abas. Agora você pode me pedir para gerar a escala de qualquer mês baseado neste modelo ou solicitar alterações específicas.` 
        }]);
      } catch (error) {
        console.error(error);
        alert('Erro ao ler o arquivo Excel. Verifique se o formato é válido.');
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();
    
    if (modelSheets.length > 0) {
      // Use the modified model data
      modelSheets.forEach(sheet => {
        const ws = XLSX.utils.aoa_to_sheet(sheet.data);
        XLSX.utils.book_append_sheet(wb, ws, sheet.name);
      });
    } else {
      // Fallback to default generation if no model is uploaded
      const year = parseInt(selectedMonth.split('-')[0]);
      const month = parseInt(selectedMonth.split('-')[1]) - 1;
      const startDate = startOfMonth(new Date(year, month));
      const endDate = endOfMonth(new Date(year, month));
      const days = eachDayOfInterval({ start: startDate, end: endDate });

      const createDefaultData = (type: 'geral' | 'uro') => {
        const data: any[] = [['DATA', 'DIA DA SEMANA', 'PLANTONISTA', 'TELEFONE']];
        days.forEach(day => {
          const shift = getShiftForDate(day);
          const docId = type === 'geral' ? shift.geral : shift.uro;
          const doctor = DOCTORS_INFO[docId];
          if (doctor) {
            data.push([
              format(day, 'dd/MM/yyyy'),
              format(day, 'EEEE', { locale: ptBR }).toUpperCase(),
              doctor.name,
              doctor.phone
            ]);
          }
        });
        return data;
      };

      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(createDefaultData('geral')), "GERAL SES DIURNO");
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(createDefaultData('geral')), "GERAL SES NOTURNO");
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(createDefaultData('geral')), "GERAL PBSAUDE DIURNO");
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(createDefaultData('geral')), "GERAL PBSAUDE NOTURNO");
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(createDefaultData('uro')), "UROLOGIA DIURNO");
    }

    XLSX.writeFile(wb, `Escala_Modificada_${selectedMonth}.xlsx`);
  };

  const handleAiChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsAiLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      // We send the current state of the sheets to Gemini so it can "see" and "modify" them
      const context = modelSheets.length > 0 
        ? `Dados atuais das planilhas (JSON): ${JSON.stringify(modelSheets.map(s => ({ name: s.name, sample: s.data.slice(0, 10) })))}`
        : "Nenhum modelo carregado ainda. O usuário quer gerar uma nova escala.";

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: `Você é um especialista em gestão de escalas médicas hospitalares.
        Contexto do Sistema:
        - Mês selecionado: ${selectedMonth}
        - ${context}
        
        Instrução:
        O usuário quer modificar ou gerar planilhas. Se o usuário pedir para alterar dados, você deve responder em formato JSON estruturado que eu possa usar para atualizar o estado da aplicação, seguido de uma explicação amigável.
        
        Se for uma alteração de dados, retorne um objeto JSON com a chave "updatedSheets" contendo o array completo de SheetData.
        
        Pedido do usuário: "${userMsg}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              explanation: { type: Type.STRING },
              updatedSheets: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    data: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.STRING } } }
                  }
                }
              }
            },
            required: ["explanation"]
          }
        }
      });

      const result = JSON.parse(response.text);
      
      if (result.updatedSheets) {
        setModelSheets(result.updatedSheets);
      }
      
      setChatHistory(prev => [...prev, { role: 'assistant', content: result.explanation }]);
    } catch (error) {
      console.error(error);
      setChatHistory(prev => [...prev, { role: 'assistant', content: 'Desculpe, ocorreu um erro ao processar sua solicitação com o Gemini 3.1. Verifique a conexão ou tente novamente.' }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleGenerateForMonth = async () => {
    if (modelSheets.length === 0) return;
    
    setIsAiLoading(true);
    setChatHistory(prev => [...prev, { role: 'user', content: `Gere a escala para ${format(parseISO(selectedMonth + '-01'), 'MMMM yyyy', { locale: ptBR })} mantendo exatamente este layout.` }]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      // We send the structure and the shift logic rules to Gemini
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: `Você é um especialista em Excel e escalas médicas.
        
        OBJETIVO:
        Atualizar as planilhas anexadas para o mês de ${selectedMonth}.
        
        REGRAS DE NEGÓCIO (SEQUÊNCIA DE PLANTÃO):
        - A sequência de médicos é cíclica e baseada em uma data âncora (01/01/2026).
        - Você deve calcular o médico correto para cada dia do mês de ${selectedMonth} usando a lógica de rotação do hospital.
        - Ciclo Geral (14 dias): ERNESTO, CARLOS, ARTHUR, ARTHUR, BRUNO, GERALDO, BRUNO, ERNESTO, CARLOS, EDUARDO, BRUNO, ARTHUR, GERALDO, EDUARDO.
        - Ciclo Urologia (7 dias): EDUARDO, EDUARDO, EMERSON, EDUARDO, EMERSON, EMERSON, EMERSON.
        
        INSTRUÇÕES DE FORMATAÇÃO:
        1. Mantenha EXATAMENTE a estrutura de colunas e linhas do modelo.
        2. Identifique as colunas de "Data", "Dia da Semana" e "Plantonista".
        3. Atualize as datas para o mês de ${selectedMonth}.
        4. Se o mês tiver mais ou menos dias que o modelo, ajuste as linhas mantendo o padrão.
        5. Preencha os nomes dos médicos seguindo a sequência correta para cada dia.
        
        DADOS DO MODELO:
        ${JSON.stringify(modelSheets.map(s => ({ name: s.name, data: s.data })))}
        
        Retorne o JSON atualizado com a chave "updatedSheets".`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              explanation: { type: Type.STRING },
              updatedSheets: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    data: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.STRING } } }
                  }
                }
              }
            },
            required: ["explanation", "updatedSheets"]
          }
        }
      });

      const result = JSON.parse(response.text);
      setModelSheets(result.updatedSheets);
      setChatHistory(prev => [...prev, { role: 'assistant', content: result.explanation }]);
    } catch (error) {
      console.error(error);
      setChatHistory(prev => [...prev, { role: 'assistant', content: 'Erro ao processar a escala inteligente. Tente novamente ou verifique o modelo.' }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gerador Inteligente de Planilhas</h2>
          <p className="text-slate-500 text-sm">Suba seus modelos e use a IA Gemini 3.1 para criar e modificar escalas</p>
        </div>
        <div className="flex gap-2">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx, .xls, .csv"
            className="hidden"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Subir Modelo (.xlsx)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Control Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-green-600" />
              Status do Modelo
            </h3>
            
            {modelSheets.length > 0 ? (
              <div className="space-y-4">
                <div className="p-3 bg-green-50 border border-green-100 rounded-xl">
                  <p className="text-xs text-green-700 font-bold uppercase mb-2">Abas Detectadas:</p>
                  <div className="flex flex-wrap gap-2">
                    {modelSheets.map((s, i) => (
                      <span key={i} className="text-[10px] bg-white text-green-600 border border-green-200 px-2 py-0.5 rounded-md font-medium">
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Mês para Gerar</label>
                  <input 
                    type="month" 
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hospital-primary/20"
                  />
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <button 
                    onClick={handleGenerateForMonth}
                    disabled={isAiLoading}
                    className="w-full bg-hospital-primary text-white px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-hospital-primary/90 transition-colors shadow-lg shadow-hospital-primary/20 disabled:opacity-50"
                  >
                    {isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calendar className="w-5 h-5" />}
                    Gerar Escala do Mês
                  </button>
                  
                  <button 
                    onClick={handleExportExcel}
                    className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                  >
                    <Download className="w-5 h-5" />
                    Baixar Arquivo (.xlsx)
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-sm text-slate-500">Nenhum modelo carregado. Suba um arquivo Excel para começar a usar a IA.</p>
              </div>
            )}
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl text-white">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              Gemini 3.1 Pro Ativo
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              A IA está pronta para analisar seus modelos. Você pode pedir para:
              <br/><br/>
              • "Gere a escala de Março baseada neste modelo"
              <br/>
              • "Troque todos os plantões de Domingo para o Dr. Bruno"
              <br/>
              • "Adicione uma nova coluna para observações"
            </p>
          </div>
        </div>

        {/* AI Chat Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[600px]">
            <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-hospital-primary/5">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-hospital-primary" />
                <h3 className="font-semibold text-slate-800">Chat de Modificação (IA)</h3>
              </div>
              {modelSheets.length > 0 && (
                <span className="text-[10px] font-bold text-hospital-primary bg-white px-2 py-1 rounded-lg border border-hospital-primary/20">
                  MODELO EM MEMÓRIA
                </span>
              )}
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-slate-100">
                    <MessageSquare className="w-8 h-8 opacity-20" />
                  </div>
                  <p className="text-sm text-center max-w-sm">
                    Suba um modelo de planilha e converse comigo para realizar as alterações necessárias.
                  </p>
                </div>
              ) : (
                chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-hospital-primary text-white rounded-tr-none' 
                        : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              {isAiLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-hospital-primary animate-spin" />
                    <span className="text-sm text-slate-500 font-medium">Gemini 3.1 Pro analisando e modificando...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-white">
              <form onSubmit={handleAiChat} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={modelSheets.length > 0 ? "O que deseja alterar no modelo?" : "Suba um modelo primeiro..."}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hospital-primary/20 text-sm"
                  disabled={isAiLoading || modelSheets.length === 0}
                />
                <button
                  type="submit"
                  disabled={isAiLoading || !chatInput.trim() || modelSheets.length === 0}
                  className="bg-hospital-primary text-white p-3 rounded-xl hover:bg-hospital-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-hospital-primary/20"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
