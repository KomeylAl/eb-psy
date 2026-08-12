export type MedicalRecordApi = {
  id?: string;
  record_number?: string;
  reference_source?: string | null;
  admission_date?: string | null;
  visit_date?: string | null;
  chief_complaints?: string | null;
  present_illness?: string | null;
  past_history?: string | null;
  family_history?: string | null;
  personal_history?: string | null;
  mse?: string | null;
  diagnosis?: string | null;
  doctor?: { id: string; name?: string } | null;
  supervisor?: { id: string; name?: string } | null;
  admin?: { id: string; name?: string } | null;
  companion?: {
    name?: string | null;
    phone?: string | null;
    address?: string | null;
    birth_date?: string | null;
  } | null;
  images?: Array<{
    id: string;
    url?: string | null;
    file_path?: string | null;
  }>;
};

export type ClinicalFormValues = {
  visit_date?: string | null;
  chief_complaints?: string | null;
  present_illness?: string | null;
  past_history?: string | null;
  family_history?: string | null;
  personal_history?: string | null;
  mse?: string | null;
  diagnosis?: string | null;
  images?: File[];
};

export const clinicalFields: Array<{
  name: keyof ClinicalFormValues;
  label: string;
}> = [
  { name: "chief_complaints", label: "شکایت اصلی (Chief Complaints)" },
  { name: "present_illness", label: "بیماری فعلی (Present Illness)" },
  { name: "past_history", label: "سابقه قبلی (Past History)" },
  { name: "family_history", label: "سابقه خانوادگی (Family History)" },
  { name: "personal_history", label: "سابقه شخصی (Personal History)" },
  { name: "mse", label: "وضعیت روانی (MSE)" },
  { name: "diagnosis", label: "تشخیص (Diagnosis)" },
];

export function clinicalDefaults(
  record?: MedicalRecordApi | null
): ClinicalFormValues {
  return {
    visit_date: record?.visit_date || "",
    chief_complaints: record?.chief_complaints || "",
    present_illness: record?.present_illness || "",
    past_history: record?.past_history || "",
    family_history: record?.family_history || "",
    personal_history: record?.personal_history || "",
    mse: record?.mse || "",
    diagnosis: record?.diagnosis || "",
    images: [],
  };
}
