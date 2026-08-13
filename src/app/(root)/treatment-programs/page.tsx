"use client";

import { useCallback, useState } from "react";
import Header from "@/components/layout/Header";
import { useDoctorTreatmentPrograms } from "@/hooks/useTreatmentPrograms";
import { PuffLoader } from "react-spinners";
import TransitionLink from "@/components/common/TransitionLink";
import Table from "@/components/common/Table";
import { debounce } from "lodash";
import { dateConvert } from "@/lib/utils";

const statusLabel = (status: string) => {
  switch (status) {
    case "active":
      return "فعال";
    case "completed":
      return "تکمیل‌شده";
    case "paused":
      return "متوقف";
    case "cancelled":
      return "لغو شده";
    default:
      return status || "—";
  }
};

const columns = [
  {
    header: "عنوان",
    accessor: (row: any) => (
      <TransitionLink
        href={`/treatment-programs/${row.id}`}
        className="text-blue-600 hover:underline font-medium"
      >
        {row.title || "برنامه درمان"}
      </TransitionLink>
    ),
  },
  {
    header: "مراجع",
    accessor: (row: any) => row.client?.name || "—",
    cellClassName: () => "text-violet-600",
  },
  {
    header: "وضعیت",
    accessor: (row: any) => statusLabel(row.status),
  },
  {
    header: "جلسات",
    accessor: (row: any) => row.appointments_count ?? 0,
  },
  {
    header: "شروع",
    accessor: (row: any) =>
      row.started_at ? dateConvert(row.started_at) : "—",
  },
];

const TreatmentProgramsPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const { data, isLoading, error, refetch } = useDoctorTreatmentPrograms({
    page,
    pageSize,
    search,
    status,
  });

  const debouncedSearch = useCallback(
    debounce(() => {
      setPage(1);
      refetch();
    }, 300),
    [refetch]
  );

  const onSearchChange = (e: any) => {
    setSearch(e.target.value);
    debouncedSearch();
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Header searchFn={onSearchChange} isShowSearch />
      <div className="p-4 sm:p-6 md:p-8 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-bold text-2xl">برنامه‌های درمان</h2>
          <select
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">همه وضعیت‌ها</option>
            <option value="active">فعال</option>
            <option value="completed">تکمیل‌شده</option>
            <option value="paused">متوقف</option>
            <option value="cancelled">لغو شده</option>
          </select>
        </div>

        {isLoading && (
          <div className="flex justify-center py-16">
            <PuffLoader size={60} color="#3e86fa" />
          </div>
        )}

        {error && (
          <div className="text-center space-y-2">
            <p className="text-rose-500">خطا در دریافت برنامه‌ها</p>
            <button onClick={() => refetch()} className="text-blue-600">
              تلاش مجدد
            </button>
          </div>
        )}

        {data && (
          <Table
            data={data.data ?? []}
            columns={columns}
            currentPage={data.meta?.current_page ?? page}
            pageSize={data.meta?.per_page ?? pageSize}
            totalItems={data.meta?.total ?? 0}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
};

export default TreatmentProgramsPage;
