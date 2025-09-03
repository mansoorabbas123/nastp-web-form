import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Student from "@/models/Student";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    console.log("Received body:", body);

    // 🔎 Check if student already exists by email
    const existingStudent = await Student.findOne({ email: body.email });
    if (existingStudent) {
      return NextResponse.json(
        { success: false, message: "Student is already registered" },
        { status: 409 } // Conflict
      );
    }

    // ✅ Create new student
    const newStudent = await Student.create(body);

    return NextResponse.json(
      { success: true, data: newStudent },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error in POST /api/students:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}











// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import Student from "@/models/Student";

// export async function POST(req: Request) {
//   try {
//     await connectDB();
//     const body = await req.json();
//     console.log("Received body:", body);
//     const newStudent = await Student.create(body);

//     return NextResponse.json({ success: true, data: newStudent }, { status: 201 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
//   }
// }
