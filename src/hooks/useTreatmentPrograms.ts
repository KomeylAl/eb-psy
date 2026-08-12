import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useDoctorTreatmentPrograms(page = 1) {
  return useQuery({
    queryKey: ["doctor-treatment-programs", page],
    queryFn: async () => {
      const res = await fetch(
        `/api/treatment-programs?page=${page}&per_page=20`
      );
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(payload?.message || "خطا در دریافت برنامه‌ها");
        throw new Error(payload?.message || "خطا");
      }
      return payload;
    },
  });
}

export function useDoctorProgramRecord(programId: string) {
  return useQuery({
    queryKey: ["doctor-program-record", programId],
    enabled: Boolean(programId),
    queryFn: async () => {
      const res = await fetch(
        `/api/treatment-programs/${programId}/medical-record`
      );
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(payload?.message || "خطا در دریافت پرونده");
        throw new Error(payload?.message || "خطا");
      }
      return payload;
    },
  });
}

export function useSaveDoctorProgramRecord(onSuccess?: () => void) {
  return useMutation({
    mutationFn: async ({
      programId,
      formData,
    }: {
      programId: string;
      formData: FormData;
    }) => {
      const res = await fetch(
        `/api/treatment-programs/${programId}/medical-record`,
        { method: "POST", body: formData }
      );
      const payload = await res.json().catch(() => null);
      if (!res.ok) throw new Error(payload?.message || "خطا در ذخیره");
      return payload;
    },
    onError(e) {
      toast.error(e.message);
    },
    onSuccess: () => {
      toast.success("بخش بالینی ذخیره شد");
      onSuccess?.();
    },
  });
}

export function useUpdateSessionNotes(onSuccess?: () => void) {
  return useMutation({
    mutationFn: async ({
      appointmentId,
      session_notes,
    }: {
      appointmentId: string;
      session_notes: string;
    }) => {
      const res = await fetch(
        `/api/appointments/${appointmentId}/session-notes`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_notes }),
        }
      );
      const payload = await res.json().catch(() => null);
      if (!res.ok) throw new Error(payload?.message || "خطا در ذخیره یادداشت");
      return payload;
    },
    onError(e) {
      toast.error(e.message);
    },
    onSuccess: () => {
      toast.success("یادداشت جلسه ذخیره شد");
      onSuccess?.();
    },
  });
}

export function useAppointmentHomeworks(appointmentId: string) {
  return useQuery({
    queryKey: ["appointment-homeworks", appointmentId],
    enabled: Boolean(appointmentId),
    queryFn: async () => {
      const res = await fetch(
        `/api/appointments/${appointmentId}/homeworks`
      );
      const payload = await res.json().catch(() => null);
      if (!res.ok) throw new Error(payload?.message || "خطا");
      return payload;
    },
  });
}

export function useStoreHomework(onSuccess?: () => void) {
  return useMutation({
    mutationFn: async ({
      appointmentId,
      body,
    }: {
      appointmentId: string;
      body: Record<string, unknown>;
    }) => {
      const res = await fetch(
        `/api/appointments/${appointmentId}/homeworks`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const payload = await res.json().catch(() => null);
      if (!res.ok) throw new Error(payload?.message || "خطا در ثبت تکلیف");
      return payload;
    },
    onError(e) {
      toast.error(e.message);
    },
    onSuccess: () => {
      toast.success("تکلیف ثبت شد");
      onSuccess?.();
    },
  });
}

export function useUpdateHomework(onSuccess?: () => void) {
  return useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: string;
      body: Record<string, unknown>;
    }) => {
      const res = await fetch(`/api/homeworks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) throw new Error(payload?.message || "خطا");
      return payload;
    },
    onError(e) {
      toast.error(e.message);
    },
    onSuccess: () => {
      toast.success("تکلیف به‌روزرسانی شد");
      onSuccess?.();
    },
  });
}
