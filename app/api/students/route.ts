import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Student from "@/models/Student";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    console.log("Received body:", body);
    const newStudent = await Student.create(body);

    return NextResponse.json({ success: true, data: newStudent }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
