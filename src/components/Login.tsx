import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Lock, User } from 'lucide-react';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.toLowerCase() === 'brunomesousa@gmail.com' && password === '123456b') {
      navigate('/admin');
    } else {
      setError('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <img 
            src="https://www.hospitalmetropolitano.pb.gov.br/wp-content/uploads/logo-1-2.png" 
            alt="Hospital Metropolitano PB" 
            className="h-16 object-contain mb-6"
            referrerPolicy="no-referrer"
          />
          <h1 className="text-2xl font-bold text-slate-900 text-center">Acesso Restrito</h1>
          <p className="text-slate-500 text-sm text-center mt-1">Gestão da Cirurgia Geral</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm text-center border border-red-100 mb-4">
              {error}
            </div>
          )}
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 ml-1">Usuário</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hospital-primary/20 transition-all"
                placeholder="E-mail"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 ml-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hospital-primary/20 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-hospital-primary text-white font-semibold py-3 rounded-xl hover:bg-hospital-primary/90 transition-colors shadow-lg shadow-hospital-primary/20 mt-4"
          >
            Entrar no Sistema
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-sm text-slate-500 hover:text-hospital-primary transition-colors"
          >
            Voltar para o Painel Geral
          </button>
        </div>
      </div>
    </div>
  );
}

