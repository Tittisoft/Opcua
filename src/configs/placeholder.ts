import { PLCItem } from '@/configs/interfaces';

export const SAMPLE_PLC_DATA: PLCItem[] = [
  {
    IPADDRESS: '192.168.1.10',
    mData: {
      LastRead: '2024-03-22T12:26:23.5137563+01:00',
      CODICE: 'ABC123',
      Valore: '42.0',
      Nome: 'PLC Name I',
      Versione: '1.0',
      Produttore: 'ACME Corp',
      Stato: 'Offline',
      Uri: 'https://example.com/sensor-data',
    },
  },
  {
    IPADDRESS: '192.168.1.20',
    mData: {
      LastRead: '2024-03-22T12:26:23.5137563+01:00',
      CODICE: 'DEF456',
      Valore: '200',
      Nome: 'PLC Name II',
      Versione: '2.1',
      Produttore: 'XYZ Inc',
      Stato: 'Online',
      Uri: 'https://example.com/pressure-data',
    },
  },
  {
    IPADDRESS: '192.168.1.30',
    mData: {
      LastRead: '2024-03-22T12:26:23.5137563+01:00',
      CODICE: 'GHI789',
      Valore: '1000',
      Nome: 'PLC Name III',
      Versione: '3.0',
      Produttore: 'ABC Inc',
      Stato: 'Sleep',
      Uri: 'https://example.com/flow-data',
    },
  },
  {
    IPADDRESS: '192.168.1.40',
    mData: {
      LastRead: '2024-03-22T12:26:23.5137563+01:00',
      CODICE: 'JKL1011',
      Valore: '50',
      Nome: 'PLC Name IV',
      Versione: '1.5',
      Produttore: 'XYZ Inc',
      Stato: 'Active',
      Uri: 'https://example.com/humidity-data',
    },
  },
] as const;
