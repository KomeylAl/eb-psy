import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useComments(page: number = 1, pageSize: number = 10) {
  return useQuery({
    queryKey: ["doctor-comments", page, pageSize],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });

      const res = await fetch(`/api/comments?${params.toString()}`);
      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(payload?.message || "خطا در دریافت نظرات");
        throw new Error(payload?.message || "خطا در دریافت نظرات");
      }

      return payload;
    },
    placeholderData: (prev) => prev,
  });
}
