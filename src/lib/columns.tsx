import Link from "next/link";
import {
  convertNotifPriority,
  convertNotifStatus,
  convertNotifType,
  dateConvert,
} from "./utils";
import { PuffLoader } from "react-spinners";
import { ChartBar, Check } from "lucide-react";

export const appointmentColumns = [
  {
    header: "مراجع",
    accessor: (row: any) => (
      <div className="relative inline-block">{row.client?.name}</div>
    ),
    cellClassName: (row: any) => "text-violet-500",
  },
  {
    header: "مشاور",
    accessor: (row: any) => (
      <div className="relative inline-block">{row.doctor?.name}</div>
    ),
    cellClassName: (row: any) => "text-cyan-500",
  },
  {
    header: "تاریخ و ساعت",
    accessor: (row: any) => row.time + " - " + dateConvert(row.date),
  },
  {
    header: "وضعیت",
    accessor: (row: any) =>
      row.status === "done" ? "انجام شده" : "انجام نشده",
    cellClassName: (row: any) =>
      row.status === "done" ? "text-blue-600" : "text-amber-500",
  },
  {
    header: "مبلغ",
    accessor: (row: any) => row.amount ?? "ندارد",
  },
  {
    header: "پرداخت",
    accessor: (row: any) => {
      const status = row.payment?.status;
      if (status === "paid") return "پرداخت شده";
      if (status === "unpaid") return "پرداخت نشده";
      if (status === "pending") return "در انتظار";
      return "ندارد";
    },
    cellClassName: (row: any) =>
      row.payment?.status === "paid" ? "text-indigo-500" : "text-rose-500",
  },
];

export const resourceColumns = [
  {
    header: "عنوان",
    accessor: (row: any) => row.title,
    cellClassName: () => "text-violet-500",
  },
  {
    header: "نوع",
    accessor: (row: any) => (row.type === "file" ? "فایل" : "لینک"),
  },
  {
    header: "توضیحات",
    accessor: (row: any) => row.description || "—",
  },
  {
    header: "آدرس / فایل",
    accessor: (row: any) => {
      if (row.type === "link") {
        return row.link ? (
          <Link href={row.link} target="_blank" className="text-blue-500">
            مشاهده لینک
          </Link>
        ) : (
          "—"
        );
      }

      return row.file_url ? (
        <Link href={row.file_url} target="_blank" className="text-blue-500">
          دانلود فایل
        </Link>
      ) : (
        "—"
      );
    },
  },
];

export const AllNotificationsColumns = [
  {
    header: "عنوان",
    accessor: (row: any) => <p className="peer">{row.title}</p>,
    cellClassName: (row: any) => "text-violet-500",
  },
  {
    header: "اولویت",
    accessor: (row: any) => convertNotifPriority(row.priority),
    cellClassName: (row: any) =>
      `${
        row.priority === "high"
          ? "text-rose-500"
          : row.priority === "medium"
          ? "text-amber-500"
          : row.priority === "normal"
          ? "text-slate-500"
          : "text-cyan-500"
      }`,
  },
  { header: "وضعیت", accessor: (row: any) => convertNotifStatus(row.status) },
  {
    header: "نوع",
    accessor: (row: any) => convertNotifType(row.type),
  },
  {
    header: "زمان",
    accessor: (row: any) => dateConvert(row.created_at),
  },
];

export const unreadNotificationColumns = (
  isPending: boolean = false,
  loadingId: string | null = null,
  mutationFn: (notifId: string) => void
) => [
  {
    header: "عنوان",
    accessor: (row: any) => <p className="peer">{row.title}</p>,
    cellClassName: (row: any) => "text-violet-500",
  },
  {
    header: "اولویت",
    accessor: (row: any) => convertNotifPriority(row.priority),
    cellClassName: (row: any) =>
      `${
        row.priority === "high"
          ? "text-rose-500"
          : row.priority === "medium"
          ? "text-amber-500"
          : row.priority === "normal"
          ? "text-slate-500"
          : "text-cyan-500"
      }`,
  },
  { header: "وضعیت", accessor: (row: any) => convertNotifStatus(row.status) },
  { header: "نوع", accessor: (row: any) => convertNotifType(row.type) },
  {
    header: "علامت گذاری به عنوان خوانده شده",
    accessor: (item: any) => (
      <button
        disabled={isPending}
        onClick={() => mutationFn(item.id)}
        className="flex items-center w-full h-full"
      >
        {loadingId !== item.id ? (
          <Check className="text-blue-500 text-center" size={20} />
        ) : (
          <PuffLoader color="#3b82f6" size={20} />
        )}
      </button>
    ),
  },
];

export const doctorColumns = [
  { header: "نام", accessor: "name" },
  { header: "تلفن", accessor: "phone" },
  { header: "تاریخ تولد", accessor: (row: any) => dateConvert(row.birth_date) },
  {
    header: "پنل مشاور",
    accessor: (row: any) => (
      <Link href={`/admin/doctors/panel/${row.id}`}>
        <ChartBar size={25} className="text-blue-500" />
      </Link>
    ),
  },
];

export const clientColumns = [
  { header: "نام", accessor: "name" },
  { header: "تلفن", accessor: "phone" },
  { header: "تاریخ تولد", accessor: (row: any) => dateConvert(row.birth_date) },
  {
    header: "پنل مراجع",
    accessor: (row: any) => (
      <Link href={`/admin/clients/${row.id}`}>
        <ChartBar size={25} className="text-blue-500" />
      </Link>
    ),
  },
];

export const assessmentsColumns = [
  {
    header: "مراجع",
    accessor: (row: any) => (
      <div className="relative inline-block">{row.client?.name}</div>
    ),
    cellClassName: (row: any) => "text-violet-500",
  },
  {
    header: "مشاور",
    accessor: (row: any) => (
      <div className="relative inline-block">{row.doctor?.name}</div>
    ),
    cellClassName: (row: any) => "text-cyan-500",
  },
  { header: "تاریخ", accessor: (row: any) => dateConvert(row.date) },
  { header: "زمان", accessor: (row: any) => row.time },
  {
    header: "وضعیت",
    accessor: (row: any) =>
      row.status === "done" ? "انجام شده" : "انجام نشده",
    cellClassName: (row: any) =>
      row.status === "done" ? "text-blue-600" : "text-amber-500",
  },
];

export const commentsColumns = [
  {
    header: "نویسنده",
    accessor: (row: any) =>
      row.author_name ||
      `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim() ||
      "—",
  },
  {
    header: "متن نظر",
    accessor: (row: any) => {
      const body = row.body || "";
      return body.length > 80 ? `${body.slice(0, 80)}...` : body;
    },
  },
  {
    header: "امتیاز",
    accessor: (row: any) => `${row.rating ?? "—"} / 5`,
    cellClassName: () => "text-amber-500",
  },
  {
    header: "تاریخ",
    accessor: (row: any) =>
      row.created_at ? dateConvert(row.created_at) : "—",
  },
];

export const workshopColumns = [
  { header: "عنوان", accessor: "title" },
  { header: "روز های برگزاری", accessor: "week_day" },
  { header: "زمان برگزاری", accessor: "time" },
  {
    header: "پنل کارگاه",
    accessor: (row: any) => (
      <Link href={`/dashboard/workshops/${row.id}`}>
        <ChartBar size={25} className="text-blue-500" />
      </Link>
    ),
  },
];

export const categoryColumns = [
  { header: "عنوان", accessor: "name" },
  { header: "اسلاگ", accessor: "slug" },
];

export const tagColumns = [
  { header: "عنوان", accessor: "name" },
  { header: "اسلاگ", accessor: "slug" },
];

export const departmentColumns = [
  { header: "عنوان", accessor: "title" },
  { header: "اسلاگ", accessor: "slug" },
];

export const paymentColumns = [
  { header: "مراجع", accessor: (item: any) => item.referral.client.name },
  { header: "مشاور", accessor: (item: any) => item.referral.doctor.name },
  {
    header: "تاریخ مراجعه",
    accessor: (item: any) => dateConvert(item.referral.date),
  },
  {
    header: "مبلغ",
    accessor: (item: any) => item.referral.amount,
    cellClassName: (item: any) =>
      item.status === "unpaid" ? "text-amber-500" : "text-sky-600",
  },
  {
    header: "وضعیت",
    accessor: (item: any) =>
      item.status === "paid" ? "پرداخت شده" : "پرداخت نشده",
    cellClassName: (item: any) =>
      item.status === "unpaid" ? "text-rose-500" : "text-green-500",
  },
];
