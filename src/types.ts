export interface Surgery {
  id: string;
  patientName: string;
  procedure: string;
  surgeon: string;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  room: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  bed: string;
  diagnosis: string;
  status: 'stable' | 'critical' | 'observation' | 'pre-op' | 'post-op';
}

export interface Protocol {
  id: string;
  title: string;
  category: string;
  content: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: 'Cirurgia Geral' | 'Urologia';
  phone: string;
}

export interface OnCallShift {
  date: string;
  generalSurgery: Doctor[];
  urology: Doctor[];
}

export interface ImportantLink {
  id: string;
  title: string;
  url: string;
  icon: string;
  credentials?: string;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'high' | 'normal' | 'low';
  imageUrl?: string;
}


