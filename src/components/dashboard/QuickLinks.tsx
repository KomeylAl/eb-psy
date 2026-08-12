import TransitionLink from "@/components/common/TransitionLink";
import {
  Bell,
  CalendarCheck,
  CalendarFold,
  FileUser,
  FolderHeart,
  MessageSquareText,
  Settings,
  SwatchBook,
} from "lucide-react";

const links = [
  {
    title: "نوبت‌ها",
    href: "/appointments",
    description: "مشاهده نوبت‌های مراجعان",
    icon: CalendarCheck,
  },
  {
    title: "ارزیابی‌ها",
    href: "/assessments",
    description: "پیگیری ارزیابی‌های اولیه",
    icon: CalendarFold,
  },
  {
    title: "نظرات",
    href: "/comments",
    description: "مشاهده نظرات تأییدشده مراجعین",
    icon: MessageSquareText,
  },
  {
    title: "برنامه‌های درمان",
    href: "/treatment-programs",
    description: "پرونده و جلسات برنامه‌های درمانی",
    icon: FolderHeart,
  },
  {
    title: "رزومه",
    href: "/resume",
    description: "به‌روزرسانی رزومه عمومی",
    icon: FileUser,
  },
  {
    title: "منابع",
    href: "/resources",
    description: "مدیریت منابع پیشنهادی",
    icon: SwatchBook,
  },
  {
    title: "اعلانات",
    href: "/notifications",
    description: "مشاهده پیام‌های سیستم",
    icon: Bell,
  },
  {
    title: "تنظیمات",
    href: "/settings",
    description: "رمز عبور و ترجیحات",
    icon: Settings,
  },
];

export function QuickLinks() {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <h3 className="mb-4 text-lg font-semibold">دسترسی سریع</h3>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <TransitionLink
              key={link.href}
              href={link.href}
              className="group flex items-start gap-3 rounded-xl border border-transparent bg-gray-50 p-4 transition hover:border-blue-200 hover:bg-blue-50 dark:bg-gray-900 dark:hover:border-blue-900 dark:hover:bg-blue-950/40"
            >
              <div className="rounded-lg bg-white p-2 text-blue-600 shadow-sm dark:bg-gray-800 dark:text-blue-300">
                <Icon size={18} />
              </div>
              <div>
                <p className="font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300">
                  {link.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {link.description}
                </p>
              </div>
            </TransitionLink>
          );
        })}
      </div>
    </div>
  );
}
