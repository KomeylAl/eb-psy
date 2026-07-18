import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useAppointments(
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  date: string = ""
) {
  return useQuery({
    queryKey: ["appointments", page, pageSize, search, date],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        search,
        date,
      });

      const res = await fetch(`/api/appointments?${params.toString()}`);
      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(payload?.message || "خطا در دریافت اطلاعات");
        throw new Error(payload?.message || "خطا در دریافت اطلاعات");
      }

      return payload;
    },
    placeholderData: (prev) => prev,
  });
}
