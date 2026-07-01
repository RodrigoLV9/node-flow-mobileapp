let _selectedDate: string | null = null;

export function setCalendarDate(date: string) {
  _selectedDate = date;
}

export function getCalendarDate(): string | null {
  return _selectedDate;
}

export function consumeCalendarDate(): string | null {
  const d = _selectedDate;
  _selectedDate = null;
  return d;
}
