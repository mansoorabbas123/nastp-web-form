"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import InputMask from "react-input-mask-next";

const qualifications = ["MS", "BS", "FA", "FSC", "Matric"] as const;

// Validation schema
const formSchema = z.object({
  name: z.string().min(3, "Name is required"),
  fatherName: z.string().min(3, "Father/Guardian Name is required"),
  fatherNumber: z
    .string()
    .regex(/^\+92\d{10}$/, "Father's number must be in +92XXXXXXXXXX format"),
  cnic: z
  .string()
  .regex(/^\d{5}-\d{7}-\d$/, "CNIC must be in 14242-4466754-9 format"),
  qualification: z.string().refine(
  (val) => qualifications.includes(val as any),
  { message: "Select a valid qualification" }
),
  gender: z.enum(["Male", "Female"] as const).refine(
  (val) => ["Male", "Female"].includes(val),
  { message: "Select gender" }
),
  phone: z
    .string()
    .regex(/^\+92\d{10}$/, "Phone number must be in +92XXXXXXXXXX format"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address is required"),
  district: z.string().min(2, "District is required"),
  birthDate: z.string().nonempty("Birth date is required"),
  courses: z.array(z.string()).min(1, "Select at least one course"),
  priority1: z.string().nonempty("Select 1st priority"),
  priority2: z.string().nonempty("Select 2nd priority"),
});

type FormData = z.infer<typeof formSchema>;

const coursesList = [
  "Digital Forensic & Cyber Security",
  "Digital Marketing & SEO",
  "Graphic Designing",
  "Mobile Development",
  "Web App Development",
];

export default function StudentRegistrationForm() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // const onSubmit = (data: FormData) => {
  //   console.log("Form Submitted:", data);
  //   alert("Form submitted successfully!");
  // };

  const onSubmit = async (data: FormData) => {
        console.log("Form Submitted:", data);
  try {
    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert("Form submitted successfully!");
    } else {
      alert("Failed to submit form");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
};


  const selectedCourses = watch("courses") || [];

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Student Enrollment Form
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Student Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Student’s Name</label>
            <input
              type="text"
              placeholder="Student’s Name"
              {...register("name")}
              className="border p-2 rounded w-full"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Father/Guardian Name</label>
            <input
              type="text"
              placeholder="Father/Guardian Name"
              {...register("fatherName")}
              className="border p-2 rounded w-full"
            />
            {errors.fatherName && (
              <p className="text-red-500 text-sm">{errors.fatherName.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Father/Guardian Number</label>
            <Controller
              name="fatherNumber"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  {...field}
                  defaultCountry="PK"
                  international
                  className="border p-2 rounded w-full"
                  placeholder="Father/Guardian Number"
                />
              )}
            />
            {errors.fatherNumber && (
              <p className="text-red-500 text-sm">
                {errors.fatherNumber.message}
              </p>
            )}
          </div>

          <div>
       <div>
        <label className="block mb-1 font-medium">CNIC</label>
  <input
    type="text"
    placeholder="CNIC (e.g. 14242-4466754-9)"
    {...register("cnic")}
    className="border p-2 rounded w-full"
  />
  {errors.cnic && (
    <p className="text-red-500 text-sm">{errors.cnic.message}</p>
  )}
</div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Qualification</label>
            <select
              {...register("qualification")}
              className="border p-2 rounded w-full"
            >
              <option value="">Select Qualification</option>
              <option value="MS">MS</option>
              <option value="BS">BS</option>
              <option value="FA">FA</option>
              <option value="FSC">FSC</option>
              <option value="Matric">Matric</option>
            </select>
            {errors.qualification && (
              <p className="text-red-500 text-sm">
                {errors.qualification.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font">Select Gender</label>
            <select
              {...register("gender")}
              className="border p-2 rounded w-full"
            >
              {/* <option value="">Select Gender</option> */}
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Phone Number</label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  {...field}
                  defaultCountry="PK"
                  international
                  className="border p-2 rounded w-full"
                  placeholder="Phone Number"
                />
              )}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Email Address</label>
            <input
              type="email"
              placeholder="Email Address"
              {...register("email")}
              className="border p-2 rounded w-full"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">District</label>
            <input
              type="text"
              placeholder="District"
              {...register("district")}
              className="border p-2 rounded w-full"
            />
            {errors.district && (
              <p className="text-red-500 text-sm">{errors.district.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Birth Date</label>
            <input
              type="date"
              {...register("birthDate")}
              className="border p-2 rounded w-full"
            />
            {errors.birthDate && (
              <p className="text-red-500 text-sm">{errors.birthDate.message}</p>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block mb-1 font-medium">Present Address</label> 
          <textarea
            placeholder="Present Address"
            {...register("address")}
            className="border p-2 rounded w-full"
            rows={3}
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address.message}</p>
          )}
        </div>

        {/* Courses */}
        <div>
          <h2 className="text-lg font-semibold mb-2">
            Skill Enhancement Programs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {coursesList.map((course) => (
              <label key={course} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={course}
                  {...register("courses")}
                  className="accent-blue-600"
                />
                {course}
              </label>
            ))}
          </div>
          {errors.courses && (
            <p className="text-red-500 text-sm">{errors.courses.message}</p>
          )}
        </div>

        {/* Priorities */}
                <h2 className="text-lg font-semibold mb-2">
            Select Your Priorities
          </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            {...register("priority1")}
            className="border p-2 rounded w-full"
          >
            <option value="">Select 1st Priority</option>
            {coursesList.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
          {errors.priority1 && (
            <p className="text-red-500 text-sm">{errors.priority1.message}</p>
          )}
          <select
            {...register("priority2")}
            className="border p-2 rounded w-full"
          >
            <option value="">Select 2nd Priority</option>
            {coursesList.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
          {errors.priority2 && (
            <p className="text-red-500 text-sm">{errors.priority2.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}







// "use client";

// import { useState } from "react";

// type FormData = {
//   name: string;
//   fatherName: string;
//   fatherNumber: string;
//   cnic: string;
//   qualification: string;
//   gender: "Male" | "Female" | "";
//   phone: string;
//   email: string;
//   address: string;
//   district: string;
//   birthDate: string;
//   courses: string[];
//   priority1: string;
//   priority2: string;
// };

// const coursesList = [
//   "Digital Forensic & Cyber Security",
//   "Digital Marketing & SEO",
//   "Graphic Designing",
//   "Mobile Development",
//   "Web App Development",
//   "Python Programming",
//   "Sales Force Administrator",
//   "Excel (Financial Excel)",
//   "Big Data Analytics",
//   "Generative AI Essential",
//   "Power BI",
// ];

// export default function home() {
//   const [form, setForm] = useState<FormData>({
//     name: "",
//     fatherName: "",
//     fatherNumber: "",
//     cnic: "",
//     qualification: "",
//     gender: "",
//     phone: "",
//     email: "",
//     address: "",
//     district: "",
//     birthDate: "",
//     courses: [],
//     priority1: "",
//     priority2: "",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCheckboxChange = (course: string) => {
//     setForm((prev) => {
//       const alreadySelected = prev.courses.includes(course);
//       return {
//         ...prev,
//         courses: alreadySelected
//           ? prev.courses.filter((c) => c !== course)
//           : [...prev.courses, course],
//       };
//     });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Form Submitted:", form);
//     alert("Form submitted! Check console for data.");
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-8">
//       <h1 className="text-2xl font-bold mb-6 text-center">Student Enrollment Form</h1>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Student Info */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input
//             type="text"
//             name="name"
//             placeholder="Student’s Name"
//             value={form.name}
//             onChange={handleChange}
//             className="border p-2 rounded w-full"
//             required
//           />
//           <input
//             type="text"
//             name="fatherName"
//             placeholder="Father/Guardian Name"
//             value={form.fatherName}
//             onChange={handleChange}
//             className="border p-2 rounded w-full"
//             required
//           />
//           <input
//             type="text"
//             name="fatherNumber"
//             placeholder="Father/Guardian Number"
//             value={form.fatherNumber}
//             onChange={handleChange}
//             className="border p-2 rounded w-full"
//           />
//           <input
//             type="text"
//             name="cnic"
//             placeholder="CNIC Number"
//             value={form.cnic}
//             onChange={handleChange}
//             className="border p-2 rounded w-full"
//             required
//           />
//           <input
//             type="text"
//             name="qualification"
//             placeholder="Qualification"
//             value={form.qualification}
//             onChange={handleChange}
//             className="border p-2 rounded w-full"
//           />
//           <select
//             name="gender"
//             value={form.gender}
//             onChange={handleChange}
//             className="border p-2 rounded w-full"
//             required
//           >
//             <option value="">Select Gender</option>
//             <option value="Male">Male</option>
//             <option value="Female">Female</option>
//           </select>
//           <input
//             type="tel"
//             name="phone"
//             placeholder="Phone Number"
//             value={form.phone}
//             onChange={handleChange}
//             className="border p-2 rounded w-full"
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="Email Address"
//             value={form.email}
//             onChange={handleChange}
//             className="border p-2 rounded w-full"
//           />
//           <input
//             type="text"
//             name="district"
//             placeholder="District"
//             value={form.district}
//             onChange={handleChange}
//             className="border p-2 rounded w-full"
//           />
//           <input
//             type="date"
//             name="birthDate"
//             value={form.birthDate}
//             onChange={handleChange}
//             className="border p-2 rounded w-full"
//           />
//         </div>

//         <textarea
//           name="address"
//           placeholder="Present Address"
//           value={form.address}
//           onChange={handleChange}
//           className="border p-2 rounded w-full"
//           rows={3}
//         />

//         {/* Courses Checklist */}
//         <div>
//           <h2 className="text-lg font-semibold mb-2">Skill Enhancement Programs</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//             {coursesList.map((course) => (
//               <label key={course} className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={form.courses.includes(course)}
//                   onChange={() => handleCheckboxChange(course)}
//                   className="accent-blue-600"
//                 />
//                 {course}
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Priorities */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <select
//             name="priority1"
//             value={form.priority1}
//             onChange={handleChange}
//             className="border p-2 rounded w-full"
//           >
//             <option value="">Select 1st Priority</option>
//             {coursesList.map((course) => (
//               <option key={course} value={course}>
//                 {course}
//               </option>
//             ))}
//           </select>
//           <select
//             name="priority2"
//             value={form.priority2}
//             onChange={handleChange}
//             className="border p-2 rounded w-full"
//           >
//             <option value="">Select 2nd Priority</option>
//             {coursesList.map((course) => (
//               <option key={course} value={course}>
//                 {course}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
//         >
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// }
