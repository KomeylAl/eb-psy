"use client";

import { useLayoutEffect, useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  BookOpen,
  CalendarCheck,
  ChevronDown,
  ClipboardList,
  FileUser,
  FolderHeart,
  LayoutDashboard,
  MessageSquareText,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { PuffLoader } from "react-spinners";
import { useUser } from "@/contexts/UserContext";
import { useSidebar } from "@/contexts/SidebarContext";
import TransitionLink from "../common/TransitionLink";
import { cn } from "@/lib/utils";

type NavLink = {
  title: string;
  link: string;
  icon: LucideIcon;
};

type NavSection = {
  id: string;
  title: string;
  items: NavLink[];
};

const sections: NavSection[] = [
  {
    id: "general",
    title: "عمومی",
    items: [
      {
        title: "داشبورد",
        link: "/",
        icon: LayoutDashboard,
      },
      {
        title: "اعلانات",
        link: "/notifications",
        icon: Bell,
      },
      {
        title: "تنظیمات",
        link: "/settings",
        icon: Settings,
      },
    ],
  },
  {
    id: "profile",
    title: "پروفایل و محتوا",
    items: [
      {
        title: "رزومه",
        link: "/resume",
        icon: FileUser,
      },
      {
        title: "منابع",
        link: "/resources",
        icon: BookOpen,
      },
      {
        title: "نظرات",
        link: "/comments",
        icon: MessageSquareText,
      },
    ],
  },
  {
    id: "clinical",
    title: "نوبت‌دهی و درمان",
    items: [
      {
        title: "نوبت ها",
        link: "/appointments",
        icon: CalendarCheck,
      },
      {
        title: "برنامه‌های درمان",
        link: "/treatment-programs",
        icon: FolderHeart,
      },
      {
        title: "ارزیابی ها",
        link: "/assessments",
        icon: ClipboardList,
      },
    ],
  },
];

const Navbar = () => {
  const pathName = usePathname();
  const { user } = useUser();
  const {
    isExpanded,
    isMobileOpen,
    closeMobileSidebar,
    openSections,
    toggleSection,
    openSection,
  } = useSidebar();
  const showLabels = isExpanded || isMobileOpen;

  const isActive = (link: string) => {
    if (link === "/") return pathName === "/";
    return pathName === link || pathName.startsWith(`${link}/`);
  };

  const visibleSections = useMemo(() => sections, []);

  useLayoutEffect(() => {
    visibleSections.forEach((section) => {
      if (section.items.some((item) => isActive(item.link))) {
        openSection(section.id);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- open active section on route change
  }, [pathName, openSection]);

  return (
    <div className="flex w-full flex-col gap-3">
      {!user && (
        <div className="flex h-24 w-full items-center justify-center">
          <PuffLoader color="#3b82f6" size={36} />
        </div>
      )}

      {user &&
        visibleSections.map((section, sectionIndex) => {
          const isOpen = !showLabels || openSections.includes(section.id);
          const sectionHasActive = section.items.some((item) =>
            isActive(item.link)
          );

          return (
            <div key={section.id} className="flex flex-col">
              {showLabels ? (
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className={cn(
                    "mb-1 flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-[11px] font-semibold tracking-wide transition-colors",
                    sectionHasActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-400 hover:bg-gray-50 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-800/60 dark:hover:text-gray-300"
                  )}
                  aria-expanded={isOpen}
                >
                  <span>{section.title}</span>
                  <ChevronDown
                    className={cn(
                      "size-3.5 shrink-0 stroke-[2] transition-transform duration-300",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
              ) : (
                sectionIndex > 0 && (
                  <div className="mx-auto mb-1.5 h-px w-6 bg-gray-200 dark:bg-gray-800" />
                )
              )}

              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-300 ease-in-out",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <div
                    className={cn(
                      "flex flex-col",
                      showLabels ? "gap-1" : "gap-1.5"
                    )}
                  >
                    {section.items.map((link) => {
                      const active = isActive(link.link);
                      const Icon = link.icon;

                      return (
                        <TransitionLink
                          key={link.link}
                          href={link.link}
                          title={link.title}
                          onClick={closeMobileSidebar}
                          className={cn(
                            "group flex items-center rounded-lg text-sm font-medium transition-all duration-200",
                            showLabels
                              ? "gap-3 px-3 py-2.5"
                              : "justify-center px-2 py-2.5",
                            active
                              ? "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/80 dark:hover:text-gray-100",
                            !isOpen && showLabels && "opacity-0"
                          )}
                        >
                          <Icon
                            className={cn(
                              "size-[1.15rem] shrink-0 stroke-[1.75]",
                              active
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-500 group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-100"
                            )}
                          />
                          {showLabels && (
                            <span className="truncate leading-none">
                              {link.title}
                            </span>
                          )}
                        </TransitionLink>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Navbar;
