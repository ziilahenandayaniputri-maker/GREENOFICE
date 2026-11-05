export type Period = 'harian' | 'mingguan' | 'bulanan' | 'tahunan';

export interface DateRange {
  start: string;
  end: string;
}

const toDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTodayDateKey = (): string => toDateKey(new Date());

export const getLatestDate = (dates: string[]): string => {
  const validDates = dates.filter(date => /^\d{4}-\d{2}-\d{2}$/.test(date)).sort();
  if (validDates.length > 0) return validDates[validDates.length - 1];
  return toDateKey(new Date());
};

export const getDateRange = (period: Period, anchor: string): DateRange => {
  const [year, month, day] = anchor.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  let start: Date;
  let end: Date;

  if (period === 'harian') {
    start = new Date(date);
    end = new Date(date);
  } else if (period === 'mingguan') {
    end = new Date(date);
    start = new Date(date);
    start.setDate(start.getDate() - 6);
  } else if (period === 'bulanan') {
    start = new Date(year, month - 1, 1);
    end = new Date(year, month, 0);
  } else {
    start = new Date(year, 0, 1);
    end = new Date(year, 11, 31);
  }

  return { start: toDateKey(start), end: toDateKey(end) };
};

export const getPeriodBuckets = (period: Period, range: DateRange) => {
  const [startYear, startMonth, startDay] = range.start.split('-').map(Number);
  const [endYear, endMonth, endDay] = range.end.split('-').map(Number);
  const start = new Date(startYear, startMonth - 1, startDay);
  const end = new Date(endYear, endMonth - 1, endDay);

  if (period === 'tahunan') {
    return Array.from({ length: 12 }, (_, index) => {
      const month = new Date(startYear, index, 1);
      return {
        key: `${startYear}-${String(index + 1).padStart(2, '0')}`,
        label: new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(month),
      };
    });
  }

  const buckets = [];
  for (const date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    const key = toDateKey(date);
    buckets.push({
      key,
      label: period === 'mingguan'
        ? new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(date)
        : period === 'bulanan'
          ? String(date.getDate())
          : new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(date),
    });
  }
  return buckets;
};

export const getBucketKey = (date: string, period: Period): string =>
  period === 'tahunan' ? date.slice(0, 7) : date;

export const formatDateRange = (range: DateRange): string => {
  const format = (date: string) => new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
  return `${format(range.start)} - ${format(range.end)}`;
};
