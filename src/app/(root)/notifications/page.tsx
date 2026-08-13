"use client";

import Table from "@/components/common/Table";
import { AllNotificationsColumns } from "@/lib/columns";
import { useState } from "react";
import { useGetNotifications } from "@/hooks/useNotifications";
import Header from "@/components/layout/Header";
import { PuffLoader } from "react-spinners";

const Notifications = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const { data, isLoading, error } = useGetNotifications(page, pageSize);

  return (
    <div className="w-full h-full flex flex-col">
      <Header searchFn={() => {}} isShowSearch={false} />
      <div className="w-full flex flex-col p-4 sm:p-6 md:p-8">
        <div className="w-full h-full space-y-6">
          <h2 className="font-bold text-2xl">اعلانات</h2>
          <div className="w-full h-full flex items-center justify-center">
            {isLoading && <PuffLoader size={60} color="#3e86fa" />}

            {error && (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-rose-500">خطا در دریافت اطلاعات</p>
              </div>
            )}

            {data && (
              <Table
                data={data.data}
                columns={AllNotificationsColumns}
                currentPage={data.meta.current_page}
                pageSize={data.meta.per_page}
                totalItems={data.meta.total}
                onPageChange={(newPage) => {
                  setPage(newPage);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
