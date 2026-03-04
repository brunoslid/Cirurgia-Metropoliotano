import { Surgery, Patient, Protocol, Doctor, OnCallShift, ImportantLink, Notification } from './types';
import { format } from 'date-fns';

export const MOCK_SURGERIES: Surgery[] = [
  {
    id: '1',
    patientName: 'Maria das Graças',
    procedure: 'Gastrostomia Via Endoscópica',
    surgeon: 'Dr. Bruno Melo',
    time: '08:00',
    status: 'scheduled',
    room: 'Sala 01',
  },
  {
    id: '2',
    patientName: 'José de Arimatéia',
    procedure: 'Debridamento Cirúrgico de Ferida',
    surgeon: 'Dr. Arthur Bezerra',
    time: '09:30',
    status: 'scheduled',
    room: 'Sala 02',
  },
  {
    id: '3',
    patientName: 'Antônio Carlos',
    procedure: 'Traqueostomia Eletiva',
    surgeon: 'Dr. Carlos Roberto',
    time: '11:00',
    status: 'scheduled',
    room: 'Sala 01',
  },
  {
    id: '4',
    patientName: 'Francisca Helena',
    procedure: 'Gastrostomia',
    surgeon: 'Dr. Ernesto de Souza',
    time: '14:00',
    status: 'scheduled',
    room: 'Sala 03',
  },
];

export const MOCK_PATIENTS: Patient[] = [];

export const MOCK_PROTOCOLS: Protocol[] = [
  {
    id: '1',
    title: 'Checklist de Cirurgia Segura',
    category: 'Segurança',
    content: '# Checklist de Cirurgia Segura\n\n## Antes da Indução Anestésica\n- O paciente confirmou sua identidade, o sítio cirúrgico, o procedimento e o consentimento?\n- O sítio cirúrgico foi demarcado?\n- O equipamento de anestesia e a medicação foram verificados?\n- O oxímetro de pulso está instalado e funcionando?\n\n## Antes da Incisão Cirúrgica\n- Confirmar que todos os membros da equipe se apresentaram pelo nome e função.\n- Confirmar a identidade do paciente, o sítio cirúrgico e o procedimento.\n- A profilaxia antibiótica foi administrada nos últimos 60 minutos?\n\n## Antes do Paciente Sair da Sala de Cirurgia\n- O profissional de enfermagem confirma verbalmente o nome do procedimento registrado.',
  },
  {
    id: '2',
    title: 'Profilaxia Antibiótica',
    category: 'Protocolo Clínico',
    content: '# Profilaxia Antibiótica em Cirurgia Geral\n\n## Colecistectomia Eletiva\n- Cefazolina 2g IV na indução.\n\n## Cirurgia Colorretal\n- Cefoxitina 2g IV OU Cefazolina 2g + Metronidazol 500mg IV.\n\n## Hérnias com Prótese\n- Cefazolina 2g IV.',
  },
];

export const MOCK_DOCTORS: Doctor[] = [
  { id: '1', name: 'Dr. Ricardo Santos', specialty: 'Cirurgia Geral', phone: '(83) 99999-1111' },
  { id: '2', name: 'Dra. Ana Costa', specialty: 'Cirurgia Geral', phone: '(83) 99999-2222' },
  { id: '3', name: 'Dr. Marcos Lima', specialty: 'Cirurgia Geral', phone: '(83) 99999-3333' },
  { id: '4', name: 'Dra. Beatriz Melo', specialty: 'Cirurgia Geral', phone: '(83) 99999-4444' },
  { id: '5', name: 'Dr. Carlos Eduardo', specialty: 'Urologia', phone: '(83) 98888-1111' },
  { id: '6', name: 'Dra. Fernanda Alves', specialty: 'Urologia', phone: '(83) 98888-2222' },
];

export const MOCK_TODAY_SHIFT: OnCallShift = {
  date: format(new Date(), 'yyyy-MM-dd'),
  generalSurgery: [MOCK_DOCTORS[0], MOCK_DOCTORS[1]],
  urology: [MOCK_DOCTORS[4]],
};

export const MOCK_LINKS: ImportantLink[] = [
  { 
    id: '2', 
    title: 'Contracheque / Informe de Rendimentos', 
    url: 'https://sistema-contracheques-rh.onrender.com/login', 
    icon: 'file-text' 
  },
  { 
    id: '3', 
    title: 'Imagens no Sistema (Laudos)', 
    url: 'https://laudos.mobilemed.com.br/exames', 
    icon: 'clipboard-list',
    credentials: 'Login: enfneuro.hm@brasillaudos.com.br\nSenha: Blaudos@2025'
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Informe de Rendimentos 2025 (PB Saúde)',
    content: 'O Informe de Rendimentos ano base 2025 já está disponível para consulta e download. O acesso deve ser realizado com as mesmas credenciais do contracheque. Em caso de dificuldades, procure o RH da unidade.',
    date: format(new Date(), 'dd/MM/yyyy'),
    priority: 'high',
    imageUrl: 'https://i.imgur.com/G5qWb06.png' // Placeholder image representing the PDF screenshot
  },
  {
    id: '3',
    title: 'Atualização da Escala de Março',
    content: 'A escala do mês de Março foi atualizada no sistema. Por favor, verifiquem seus plantões.',
    date: format(new Date(Date.now() - 86400000), 'dd/MM/yyyy'),
    priority: 'normal',
  },
];




