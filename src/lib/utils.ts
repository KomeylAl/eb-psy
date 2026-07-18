import { clsx, type ClassValue } from "clsx";
import { DateObject } from "react-multi-date-picker";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFormattedDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  return `${year}-${month}-${day}`;
};

export function formatLocalDate(date: Date = new Date()) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

export function getPastLocalDates(days: number) {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - (days - 1 - index));
    return {
      date: formatLocalDate(date),
      label: date.toLocaleDateString("fa-IR", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
    };
  });
}

export function dateConvert(app_date: string) {
  const date = new Date(app_date);
  const jalali_date = date.toLocaleDateString("fa-IR");
  return jalali_date;
}

export function convertBaseDate(date: DateObject): string {
  return date
    .toDate()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ")
    .slice(0, 10);
}

export function convertNotifStatus(status: string) {
  let output: string = "";
  switch (status) {
    case "pending":
      output = "در حال ارسال";
      break;
    case "sent":
      output = "ارسال شده";
      break;
    case "failed":
      output = "خطا";
      break;
    case "active":
      output = "فعال";
      break;
    default:
      output = status || "";
      break;
  }
  return output;
}

export function convertNotifPriority(priority: string) {
  let output: string = "";
  switch (priority) {
    case "low":
      output = "پایین";
      break;
    case "normal":
      output = "عادی";
      break;
    case "medium":
      output = "متوسط";
      break;
    case "high":
      output = "بالا";
      break;
    default:
      output = priority || "";
      break;
  }
  return output;
}

export function convertNotifType(type: string) {
  let output: string = "";
  switch (type) {
    case "system":
      output = "سیستم";
      break;
    case "appointment":
      output = "نوبت";
      break;
    case "reminder":
      output = "یادآوری";
      break;
    case "message":
      output = "پیام";
      break;
    default:
      output = "";
      break;
  }
  return output;
}
