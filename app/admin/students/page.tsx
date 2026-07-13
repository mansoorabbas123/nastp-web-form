"use client";
import React, { useMemo } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getStudents } from "./actions";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import type { TStudent } from "@/types/student";

const columnHelper = createColumnHelper<TStudent>();

export const columns = [
  columnHelper.accessor("_id", {
    header: "ID",
  }),
  columnHelper.accessor("name", {
    header: "Name",
  }),
  columnHelper.accessor("fatherName", {
    header: "Father's Name",
  }),
  columnHelper.accessor("cnic", {
    header: "CNIC",
  }),
  columnHelper.accessor("phone", {
    header: "Phone",
  }),
  columnHelper.accessor("createdAt", {
    header: "Created At",
    cell: (info) => new Date(info.getValue()).toLocaleString(),
  }),
];

const page = () => {
  const [students, setStudents] = React.useState<TStudent[]>([]);

  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["repoData"],
    queryFn: async () => {
      return await getStudents();
    },
});

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  if (isPending) return <div>Loading...</div>;

  if (error) return "An error has occurred: " + error.message;

  console.log(table.getHeaderGroups());
  return (
    <div>
      <h2>Students</h2>
    </div>
  );
};

export default page;
