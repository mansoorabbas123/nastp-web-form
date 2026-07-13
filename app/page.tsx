"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useState } from "react";
import { is } from "zod/locales";
import AdmissionClosed from "@/components/AdmissionClosed";

const qualifications = ["MS", "BS", "FA", "FSC", "Matric"] as const;

// Validation schema
const formSchema = z.object({
  name: z.string().nonempty({ message: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(50, { message: "Name must not exceed 50 characters" }),
  fatherName: z.string().nonempty({ message: "Father/Guardian Name is required" })
    .min(3, { message: "Father/Guardian Name must be at least 3 characters long" })
    .max(50, { message: "Father/Guardian Name must not exceed 50 characters" }),
  fatherNumber: z
    .string().nonempty({ message: "Father/Guardian Number is required" })
    .regex(/^\+92\d{10}$/, "Father/Guardian Number must be in +92XXXXXXXXXX format"),
  cnic: z
    .string().nonempty({ message: "CNIC / Form B is required" })
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
  city: z.string().min(2, "Current City is required"),
  birthDate: z.string().nonempty("Birth date is required"),
  courses: z.array(z.string()).min(1, "Select at least one course").max(2, "You can only select up to 2 courses"),
  priority1: z.string().optional(),
  priority2: z.string().optional(),
  courseSlots: z.record(z.string(), z.enum(["Morning", "Evening"])).optional(),
}).superRefine((data, ctx) => {
  if (data.courses.length === 2) {
    if (!data.priority1) {
      ctx.addIssue({
        code: "custom",
        message: "Select 1st priority",
        path: ["priority1"],
      });
    }
    if (!data.priority2) {
      ctx.addIssue({
        code: "custom",
        message: "Select 2nd priority",
        path: ["priority2"],
      });
    }
  }
});

type FormData = z.infer<typeof formSchema>;

const coursesList = [
  // "Digital Forensic & Cyber Security",
  "Digital Marketing & SEO",
  "Graphic Designing",
  "Mobile Development",
  "Web App Development",
  "CCTV Operational & Maintenance"
];

/* ---------------------------------------------------------------------- */
/* Small inline icons (no extra dependency) — purely decorative UI helpers */
/* ---------------------------------------------------------------------- */
const IconWrap = ({ children }: { children: React.ReactNode }) => (
  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#00308F]/10 text-[#00308F]">
    {children}
  </span>
);

const Svg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
    {...props}
  />
);

const UserIcon = () => (
  <Svg><path d="M20 21a8 8 0 1 0-16 0" /><circle cx="12" cy="7" r="4" /></Svg>
);
const PhoneIcon = () => (
  <Svg><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></Svg>
);
const IdIcon = () => (
  <Svg><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M15 8h4M15 12h4M7 16h10" /></Svg>
);
const CalendarIcon = () => (
  <Svg><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></Svg>
);
const MailIcon = () => (
  <Svg><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></Svg>
);
const GradCapIcon = () => (
  <Svg><path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" /></Svg>
);
const PinIcon = () => (
  <Svg><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></Svg>
);
const HomeIcon = () => (
  <Svg><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /></Svg>
);
const LayersIcon = () => (
  <Svg><path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 17l9 5 9-5" /></Svg>
);
const ClockIcon = () => (
  <Svg><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></Svg>
);
const ListIcon = () => (
  <Svg><path d="M10 6h11M10 12h11M10 18h11" /><path d="M4 6h.01M4 12h.01M4 18h.01" /></Svg>
);
const InfoIcon = () => (
  <Svg className="h-4 w-4"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></Svg>
);
const AlertIcon = () => (
  <Svg className="h-3.5 w-3.5"><path d="M12 9v4M12 17h.01" /><path d="m10.29 3.86-8.18 14.14A1 1 0 0 0 3 19.5h18a1 1 0 0 0 .89-1.5L13.71 3.86a1 1 0 0 0-1.72 0Z" /></Svg>
);
const SendIcon = () => (
  <Svg className="h-4 w-4"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></Svg>
);

/* Shared field styles */
const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-[#00308F] focus:ring-4 focus:ring-[#00308F]/10";
const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";
const errorClass = "mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600";

export default function StudentRegistrationForm() {
  const regOpen = false; 
  const [loading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      fatherName: "",
      fatherNumber: "",
      cnic: "",
      qualification: "",
      gender: "Male",
      phone: "",
      email: "",
      address: "",
      city: "",
      birthDate: "",
      courses: [],
      priority1: "",
      priority2: "",
    },
  });

  // console.log("Form Errors:", errors);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    // console.log("Form Submitted:", data);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setIsLoading(false);
        alert("✅ Form submitted successfully!");
      } else {
        // Show backend message if available, otherwise generic
        alert(result.message || result.error || "❌ Failed to submit form");
      }
    } catch (err) {
      setIsLoading(false);
      // console.error(err);
      alert("❌ Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCourses = watch("courses") || [];
  const priority1 = watch("priority1");

  // Ensure only max 2 checkboxes can be checked
  const handleCourseChange = (course: string, checked: boolean) => {
    const current = getValues("courses") || [];
    if (checked) {
      if (current.length < 2) {
        setValue("courses", [...current, course]);
      }
    } else {
      setValue(
        "courses",
        current.filter((c) => c !== course)
      );
    }
  };
  if(!regOpen){
    return <AdmissionClosed />
  }
  return (
    <div className="min-h-screen bg-[#F4F6FA] px-4 py-10 md:py-14">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#001B4D] via-[#00308F] to-[#0B3FA6] px-6 py-10 text-white md:px-10">
          {/* subtle runway / radar stripe pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(115deg, #fff 0px, #fff 2px, transparent 2px, transparent 26px)",
            }}
          />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/90">
              NASTP &middot; Skill Enhancement Program
            </span>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight md:text-3xl">
              Student Enrollment Form
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80">
              Fill the details below to register for NASTP&apos;s skill
              enhancement courses.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-6 py-8 md:px-10 md:py-10">
          {/* Personal Information */}
          <section className="rounded-xl border border-slate-200 p-5 md:p-6">
            <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
              <IconWrap><UserIcon /></IconWrap>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#00308F]">Step 1</p>
                <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>Student&rsquo;s Name</label>
                <input
                  type="text"
                  {...register("name")}
                  className={inputClass}
                />
                {errors.name && (
                  <p className={errorClass}><AlertIcon />{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Phone Number</label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <PhoneInput
                      {...field}
                      defaultCountry="PK"
                      international
                      className={inputClass + " flex items-center [&_input]:bg-transparent [&_input]:outline-none"}
                      placeholder="Phone Number"
                    />
                  )}
                />
                {errors.phone && (
                  <p className={errorClass}><AlertIcon />{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Select Gender</label>
                <select
                  {...register("gender")}
                  className={inputClass}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.gender && (
                  <p className={errorClass}><AlertIcon />{errors.gender.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Birth Date</label>
                <input
                  type="date"
                  {...register("birthDate")}
                  className={inputClass}
                />
                {errors.birthDate && (
                  <p className={errorClass}><AlertIcon />{errors.birthDate.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>CNIC / Form B</label>
                <input
                  type="text"
                  placeholder="e.g. 14242-4466754-9"
                  {...register("cnic")}
                  className={inputClass}
                />
                {errors.cnic && (
                  <p className={errorClass}><AlertIcon />{errors.cnic.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  type="email"
                  {...register("email")}
                  className={inputClass}
                />
                {errors.email && (
                  <p className={errorClass}><AlertIcon />{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Qualification</label>
                <select
                  {...register("qualification")}
                  className={inputClass}
                >
                  <option value="">Select Qualification</option>
                  <option value="MS">MS</option>
                  <option value="BS">BS</option>
                  <option value="FA">FA</option>
                  <option value="FSC">FSC</option>
                  <option value="Matric">Matric</option>
                </select>
                {errors.qualification && (
                  <p className={errorClass}><AlertIcon />{errors.qualification.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Father/Guardian Name</label>
                <input
                  type="text"
                  {...register("fatherName")}
                  className={inputClass}
                />
                {errors.fatherName && (
                  <p className={errorClass}><AlertIcon />{errors.fatherName.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Father/Guardian Number</label>
                <Controller
                  name="fatherNumber"
                  control={control}
                  render={({ field }) => (
                    <PhoneInput
                      {...field}
                      defaultCountry="PK"
                      international
                      className={inputClass + " flex items-center [&_input]:bg-transparent [&_input]:outline-none"}
                      placeholder="Father/Guardian Number"
                    />
                  )}
                />
                {errors.fatherNumber && (
                  <p className={errorClass}><AlertIcon />{errors.fatherNumber.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Current City</label>
                <input
                  type="text"
                  {...register("city")}
                  className={inputClass}
                />
                {errors.city && (
                  <p className={errorClass}><AlertIcon />{errors.city.message}</p>
                )}
              </div>
            </div>
          </section>

          {/* Address */}
          <section className="rounded-xl border border-slate-200 p-5 md:p-6">
            <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
              <IconWrap><HomeIcon /></IconWrap>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#00308F]">Step 2</p>
                <h2 className="text-base font-bold text-slate-900">Present Address</h2>
              </div>
            </div>
            <textarea
              {...register("address")}
              className={inputClass}
              rows={3}
            />
            {errors.address && (
              <p className={errorClass}><AlertIcon />{errors.address.message}</p>
            )}
          </section>

          {/* Info note */}
          <div className="flex items-start gap-3 rounded-lg border-l-4 border-[#00308F] bg-[#00308F]/5 p-4 text-sm text-slate-700">
            <span className="mt-0.5 text-[#00308F]"><InfoIcon /></span>
            <p>
              You can select either 1 course or 2 courses if there is no clash in
              timings. Kindly bring your passport-size pictures (at least 02), a
              copy of your CNIC, and also bring a document showing your latest
              degree.
            </p>
          </div>

          {/* Courses */}
          <section className="rounded-xl border border-slate-200 p-5 md:p-6">
            <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
              <IconWrap><LayersIcon /></IconWrap>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#00308F]">Step 3</p>
                <h2 className="text-base font-bold text-slate-900">Skill Enhancement Programs</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {coursesList.map((course) => {
                const isSelected = selectedCourses.includes(course);
                const disableCheckbox =
                  !isSelected && selectedCourses.length >= 2;
                return (
                  <label
                    key={course}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3.5 text-sm font-medium transition ${
                      isSelected
                        ? "border-[#00308F] bg-[#00308F]/5 text-[#00308F]"
                        : disableCheckbox
                        ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                        : "border-slate-300 text-slate-700 hover:border-[#00308F]/40 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={course}
                      checked={isSelected}
                      onChange={(e) =>
                        handleCourseChange(course, e.target.checked)
                      }
                      disabled={disableCheckbox}
                      className="h-4 w-4 accent-[#00308F]"
                    />
                    {course}
                  </label>
                );
              })}
            </div>
            {errors.courses && (
              <p className={errorClass}><AlertIcon />{errors.courses.message}</p>
            )}
          </section>

          {/* Course Slots (Morning/Evening) */}
          {selectedCourses.length > 0 && (
            <section className="rounded-xl border border-slate-200 p-5 md:p-6">
              <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
                <IconWrap><ClockIcon /></IconWrap>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-[#00308F]">Step 4</p>
                  <h2 className="text-base font-bold text-slate-900">Select Slots for Your Courses</h2>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {selectedCourses.map((course) => (
                  <div key={course}>
                    <label className={labelClass}>{course} Slot</label>
                    <select
                      {...register(`courseSlots.${course}` as const, {
                        required: `Please select a slot for ${course}`,
                      })}
                      className={inputClass}
                    >
                      <option value="">Select Slot</option>
                      <option value="Morning">Morning</option>
                      <option value="Evening">Evening</option>
                    </select>
                    {errors.courseSlots?.[course] && (
                      <p className={errorClass}>
                        <AlertIcon />
                        {errors.courseSlots[course]?.message as string}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
          {/* Course Slots (Morning/Evening) */}
{/* {selectedCourses.length > 0 && (
  <div>
    <h2 className="text-lg font-semibold mb-2">Select Slots for Your Courses</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {selectedCourses.map((course) => {
        const courseSlots = watch("courseSlots") || {};
        const selectedSlot = courseSlots[course];

        // Collect slots chosen by *other* courses
        const takenSlots = Object.entries(courseSlots)
          .filter(([c]) => c !== course)
          .map(([_, slot]) => slot);

        // Only show slots that are not already taken
        const availableSlots = ["Morning", "Evening"].filter(
          (slot) => !takenSlots.includes(slot as any)
        );

        return (
          <div key={course}>
            <label className="block mb-1 font-medium">{course} Slot</label>
            <select
              {...register(`courseSlots.${course}` as const, {
                required: `Please select a slot for ${course}`,
              })}
              className="border p-2 rounded w-full"
              value={selectedSlot || ""}
              onChange={(e) =>
                setValue(`courseSlots.${course}` as const, e.target.value as any)
              }
            >
              <option value="">Select Slot</option>
              {availableSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {errors.courseSlots?.[course] && (
              <p className="text-red-500 text-sm">
                {errors.courseSlots[course]?.message as string}
              </p>
            )}
          </div>
        );
      })}
    </div>
  </div>
)} */}


          {/* Priorities */}
          {selectedCourses.length > 1 && (
            <section className="rounded-xl border border-slate-200 p-5 md:p-6">
              <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
                <IconWrap><ListIcon /></IconWrap>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-[#00308F]">Step 5</p>
                  <h2 className="text-base font-bold text-slate-900">Select Your Priorities</h2>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Priority 1</label>
                  <select {...register("priority1")} className={inputClass}>
                    <option value="">Select 1st Priority</option>
                    {selectedCourses.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                  {errors.priority1 && (
                    <p className={errorClass}><AlertIcon />{errors.priority1.message}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Priority 2</label>
                  <select {...register("priority2")} className={inputClass}>
                    <option value="">Select 2nd Priority</option>
                    {selectedCourses
                      .filter((course) => course !== priority1)
                      .map((course) => (
                        <option key={course} value={course}>
                          {course}
                        </option>
                      ))}
                  </select>
                  {errors.priority2 && (
                    <p className={errorClass}><AlertIcon />{errors.priority2.message}</p>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Submission note */}
          <div className="flex items-start gap-3 rounded-lg border-l-4 border-[#C9A227] bg-[#C9A227]/10 p-4 text-sm text-slate-700">
            <span className="mt-0.5 text-[#B4890F]"><InfoIcon /></span>
            <p>
              Please submit your updated CV, qualification copies and CNIC
              (front &amp; back) to{" "}
              <span className="font-semibold text-slate-900">
                trg.coord.khrn@nastp.gov.pk
              </span>{" "}
              for course registration. Contact{" "}
              <span className="font-semibold text-slate-900">+92 308 8045070</span>{" "}
              for further information.
            </p>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              disabled={loading}
              type="submit"
              className={`inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-md transition ${
                isSubmitting
                  ? "cursor-not-allowed bg-slate-400"
                  : "bg-gradient-to-r from-[#00308F] to-[#0B3FA6] hover:from-[#001B4D] hover:to-[#00308F]"
              }`}
            >
              <SendIcon />
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



