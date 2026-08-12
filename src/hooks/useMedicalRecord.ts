import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useDoctorClientRecord(clientId: string) {
  return useQuery({
    queryKey: ["doctor-client-record", clientId],
    queryFn: async () => {
      const res = await fetch(`/api/clients/${clientId}/medical-record`);
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(payload?.message || "خطا در دریافت پرونده پزشکی");
        throw new Error(payload?.message || "خطا در دریافت پرونده پزشکی");
      }
      return payload;
    },
    enabled: Boolean(clientId),
  });
}

export function useSaveDoctorClientRecord(onSuccess: () => void) {
  return useMutation({
    mutationFn: async ({
      clientId,
      formData,
    }: {
      clientId: string;
      formData: FormData;
    }) => {
      const res = await fetch(`/api/clients/${clientId}/medical-record`, {
        method: "POST",
        body: formData,
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(payload?.message || "خطا در ذخیره پرونده");
      }
      return payload;
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("بخش بالینی پرونده ذخیره شد");
      onSuccess();
    },
  });
}
