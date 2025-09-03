import mongoose, { Schema, Document } from "mongoose";
import { optional } from "zod";

export interface IStudent extends Document {
  name: string;
  fatherName: string;
  fatherNumber: string;
  cnic: string;
  qualification: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  birthDate: string;
  courses: string[];
  priority1: string;
  priority2: string;
  courseSlots?: Record<string, "Morning" | "Evening">;
}

const StudentSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    fatherName: { type: String, required: true },
    fatherNumber: { type: String, required: true },
    cnic: { type: String, required: true },
    qualification: { type: String, required: true },
    gender: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    birthDate: { type: String, required: true },
    courses: [{ type: String }],
    priority1: { type: String, optional: true },
    priority2: { type: String, optional: true },
      courseSlots: {
      type: Map,
      of: {
        type: String,
        enum: ["Morning", "Evening"],
      },
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.models.Student ||
  mongoose.model<IStudent>("Student", StudentSchema);
