import * as yup from "yup";

export const resourceSchema = yup.object({
  title: yup
    .string()
    .required("عنوان الزامی است")
    .max(255, "عنوان حداکثر ۲۵۵ کاراکتر است"),
  type: yup
    .mixed<"link" | "file">()
    .oneOf(["link", "file"], "نوع منبع نامعتبر است")
    .required("انتخاب نوع منبع الزامی است"),
  description: yup.string().nullable(),
  link: yup.string().when("type", {
    is: "link",
    then: (schema) =>
      schema
        .required("لینک الزامی است")
        .url("لینک معتبر وارد کنید")
        .max(255, "لینک حداکثر ۲۵۵ کاراکتر است"),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  file: yup.mixed().when("type", {
    is: "file",
    then: (schema) => schema.required("فایل الزامی است"),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
});
