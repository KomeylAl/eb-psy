"use client";

import { useComments } from "@/hooks/useComments";
import { useState } from "react";
import { PuffLoader } from "react-spinners";
import Table from "@/components/common/Table";
import { commentsColumns } from "@/lib/columns";
import Header from "@/components/layout/Header";

const Comments = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const { data, isLoading, error } = useComments(page, pageSize);

  return (
    <div className="w-full h-full flex flex-col">
      <Header searchFn={() => {}} isShowSearch={false} />
      <div className="w-full flex flex-col p-12">
        <div className="w-full h-full space-y-6">
          <div className="flex flex-col gap-1">
            <h2 className="font-bold text-2xl">نظرات مراجعین</h2>
            <p className="text-sm text-muted-foreground">
              فقط نظرات تأییدشده درباره شما نمایش داده می‌شود.
            </p>
          </div>

          <div className="w-full h-full flex items-center justify-center">
            {isLoading && <PuffLoader size={60} color="#3e86fa" />}

            {error && (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-rose-500">خطا در دریافت اطلاعات</p>
              </div>
            )}

            {data && (
              <Table
                data={data.data ?? []}
                columns={commentsColumns}
                currentPage={data.meta?.current_page ?? page}
                pageSize={data.meta?.per_page ?? pageSize}
                totalItems={data.meta?.total ?? 0}
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

export default Comments;
