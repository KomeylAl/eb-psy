import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useGetNotifications(
  page: number = 1,
  pageSize: number = 10,
  search: string = ""
) {
  return useQuery({
    queryKey: ["notifications", page, pageSize, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        search,
      });

      const res = await fetch(`/api/notifications?${params.toString()}`);
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

export function useGetUnreadNotifications(
  page: number = 1,
  pageSize: number = 10
) {
  return useQuery({
    queryKey: ["unreadNotifications", page, pageSize],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });

      const res = await fetch(
        `/api/notifications/unread?${params.toString()}`
      );
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

export function useMarkNotif() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notifId: string) => {
      const res = await fetch(`/api/notifications/${notifId}/read`, {
        method: "POST",
      });

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(payload?.message ?? "خطا در علامت گذاری اعلان!");
      }

      return payload;
    },
    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      toast.success("اعلان با موفقت علامت‌گذاری شد");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotifications"] });
    },
  });
}
