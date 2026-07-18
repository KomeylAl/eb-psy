import { InferType } from "yup";
import { resourceSchema } from "../../validations";

export type resourceType = InferType<typeof resourceSchema>;

export interface resourceApiType {
  id: string;
  doctor_id?: string;
  title: string;
  type: "link" | "file" | string;
  description?: string | null;
  link?: string | null;
  file_path?: string | null;
  file_url?: string | null;
  created_at?: string;
  updated_at?: string;
}
