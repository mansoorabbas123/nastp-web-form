export type TStudent = {
  _id: string;
  name: string;
  fatherName: string;
  fatherNumber: string;
  cnic: string;
  qualification: string;
  gender: "Male" | "Female" | "Other"; // adjust/narrow based on your actual allowed values
  phone: string;
  email: string;
  address: string;
  city: string;
  birthDate: string; // ISO date string, e.g. "2007-11-20"
  courses: string[];
  priority1: string;
  priority2: string;
  courseSlots: Record<string, string>; // e.g. { "Graphic Designing": "Evening" }
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
  __v: number;
};