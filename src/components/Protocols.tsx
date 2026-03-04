import React, { useState } from 'react';
import { MOCK_PROTOCOLS } from '../data';
import Markdown from 'react-markdown';
import { Search, ChevronRight, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';

export function Protocols() {
  const [selectedProtocol, setSelectedProtocol] = useState(MOCK_PROTOCOLS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProtocols = MOCK_PROTOCOLS.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      {/* Sidebar List */}
      <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar protocolos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hospital-primary/20"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {filteredProtocols.map((protocol) => (
            <button
              key={protocol.id}
              onClick={() => setSelectedProtocol(protocol)}
              className={cn(
                "w-full p-4 text-left flex items-center justify-between transition-colors hover:bg-slate-50",
                selectedProtocol.id === protocol.id && "bg-hospital-secondary border-l-4 border-hospital-primary"
              )}
            >
              <div>
                <p className={cn(
                  "text-sm font-semibold",
                  selectedProtocol.id === protocol.id ? "text-hospital-primary" : "text-slate-900"
                )}>
                  {protocol.title}
                </p>
                <p className="text-xs text-slate-500 mt-1">{protocol.category}</p>
              </div>
              <ChevronRight className={cn(
                "w-4 h-4",
                selectedProtocol.id === protocol.id ? "text-hospital-primary" : "text-slate-300"
              )} />
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        {selectedProtocol ? (
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-2 text-hospital-primary mb-6">
                <BookOpen className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">{selectedProtocol.category}</span>
              </div>
              <div className="markdown-body">
                <Markdown>{selectedProtocol.content}</Markdown>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
            <BookOpen className="w-12 h-12 mb-4 opacity-20" />
            <p>Selecione um protocolo para visualizar</p>
          </div>
        )}
      </div>
    </div>
  );
}
