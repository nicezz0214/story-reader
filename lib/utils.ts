import { clsx } from "clsx";

export function cn(...values: Array<string | false | null | undefined>) {
  return clsx(values);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("zh-CN").format(value);
}
