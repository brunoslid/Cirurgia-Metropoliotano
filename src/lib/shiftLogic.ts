export const CYCLE_GERAL = [
  'ERNESTO', 'CARLOS', 'ARTHUR', 'ARTHUR', 'BRUNO', 'GERALDO', 'BRUNO',
  'ERNESTO', 'CARLOS', 'EDUARDO', 'BRUNO', 'ARTHUR', 'GERALDO', 'EDUARDO'
];

export const CYCLE_URO = [
  'EDUARDO', 'EDUARDO', 'EMERSON', 'EDUARDO', 'EMERSON', 'EMERSON', 'EMERSON'
];

export const DOCTORS_INFO: Record<string, { name: string, phone: string, specialty: string }> = {
  'ERNESTO': { name: 'Dr. Ernesto de Souza', phone: '(83) 99121-9277', specialty: 'Cirurgia Geral' },
  'CARLOS': { name: 'Dr. Carlos Roberto', phone: '(83) 99399-6941', specialty: 'Cirurgia Geral' },
  'ARTHUR': { name: 'Dr. Arthur Bezerra', phone: '(83) 99808-9000', specialty: 'Cirurgia Geral' },
  'BRUNO': { name: 'Dr. Bruno Melo', phone: '(83) 99933-0500', specialty: 'Cirurgia Geral' },
  'GERALDO': { name: 'Dr. Geraldo Camilo', phone: '(83) 99121-9160', specialty: 'Cirurgia Geral' },
  'EDUARDO': { name: 'Dr. Eduardo Motta', phone: '(83) 99903-4000', specialty: 'Cirurgia Geral / Urologia' },
  'EMERSON': { name: 'Dr. Emerson Oliveira', phone: '(83) 99984-5055', specialty: 'Urologia' },
};

export function getShiftForDate(date: Date) {
  // Usando UTC para evitar problemas com fuso horário e horário de verão
  const anchor = Date.UTC(2026, 0, 1); // 1 de Janeiro de 2026 é a nossa âncora (Index 0)
  const target = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor((target - anchor) / (1000 * 60 * 60 * 24));

  // Lógica de módulo circular que funciona tanto para datas futuras quanto passadas
  const geralIdx = ((diffDays % 14) + 14) % 14;
  const uroIdx = ((diffDays % 7) + 7) % 7;

  return {
    geral: CYCLE_GERAL[geralIdx],
    uro: CYCLE_URO[uroIdx]
  };
}
