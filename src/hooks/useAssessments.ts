import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useAssessments(
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  status: string = ""
) {
  return useQuery({
    queryKey: ["assessments", page, pageSize, search, status],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        search,
        status,
      });

      const res = await fetch(`/api/assessments?${params.toString()}`);
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
