import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const formatterCache = new Map<string, Intl.NumberFormat>();

const getFormatter = (options?: Intl.NumberFormatOptions) => {
  const key = JSON.stringify(options ?? {});
  if (!formatterCache.has(key)) {
    formatterCache.set(key, new Intl.NumberFormat("fa-IR", options));
  }
  return formatterCache.get(key)!;
};

export const formatNumber = (value: number, options?: Intl.NumberFormatOptions) => {
  return getFormatter(options).format(value);
};

export const formatMillions = (
  value: number,
  options?: Intl.NumberFormatOptions,
) => {
  return formatNumber(value / 1_000_000, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
    ...options,
  });
};

export const formatCurrency = (
  value: number,
  options?: Intl.NumberFormatOptions,
) => {
  return formatNumber(value, {
    maximumFractionDigits: 0,
    ...options,
  });
};

export const formatPercentage = (
  value: number,
  options?: Intl.NumberFormatOptions,
) => {
  return `${formatNumber(value, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
    ...options,
  })}٪`;
};

export const formatDurationMinutes = (
  minutes: number,
  suffix = "دقیقه",
) => {
  return `${formatNumber(minutes)} ${suffix}`;
};

export const formatRating = (
  value: number,
  options?: Intl.NumberFormatOptions,
) => {
  return formatNumber(value, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    ...options,
  });
};
