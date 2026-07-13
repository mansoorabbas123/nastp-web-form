'use server';

import { connectDB } from "@/lib/mongodb";
import Student from "@/models/Student";

export async function getStudents() {
  try {
    await connectDB();
    const students = await Student.find().lean();
    return JSON.parse(JSON.stringify(students));
  } catch (error) {
    console.log("error",error);
  }
}
