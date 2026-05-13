// src/utils/date.ts
import { format, isToday, isYesterday } from 'date-fns';
import { vi } from 'date-fns/locale';

export const getTodayFormatted = (date: Date = new Date()): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const dayOfWeek = dayNames[date.getDay()];
  return `${day}/${month}/${year} (${dayOfWeek})`;
};

export const getRelativeDate = (date: Date | string | number): string => {
  const d = new Date(date);
  if (isToday(d)) return 'Hôm nay';
  if (isYesterday(d)) return 'Hôm qua';
  return format(d, 'dd MMMM, yyyy', { locale: vi });
};