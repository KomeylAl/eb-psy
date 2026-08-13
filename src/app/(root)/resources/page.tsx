"use client";

import { useCallback, useState } from "react";
import { debounce } from "lodash";
import { PuffLoader } from "react-spinners";
import Table from "@/components/common/Table";
import { resourceColumns } from "@/lib/columns";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/common/modal/Modal";
import AddDoctorTherapyResourcesForm from "@/components/common/form/DoctorTherapyResources";
import { useDeleteResource, useResources } from "@/hooks/useResources";
import { resourceApiType } from "@/types";

const Resources = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [resource, setResource] = useState<resourceApiType | null>(null);

  const {
    data: baseData,
    isLoading: baseLoading,
    error: baseError,
    refetch,
  } = useResources(page, pageSize, search);

  const { isOpen, openModal, closeModal } = useModal();
  const {
    isOpen: editOpen,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();
  const {
    isOpen: deleteOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const { mutate: deleteResource, isPending: isDeleting } = useDeleteResource(
    () => {
      closeDeleteModal();
      setResource(null);
      refetch();
    }
  );

  const debouncedSearch = useCallback(
    debounce(() => {
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
      <div className="w-full flex flex-col p-4 sm:p-6 md:p-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 lg:items-center lg:justify-between">
          <div className="w-full flex items-center justify-between">
            <h2 className="text-xl font-bold">منابع درمانی پیشنهادی</h2>
            <Button
              className="py-2 bg-blue-600 rounded-md text-white text-center placeholder-white"
              onClick={() => {
                setResource(null);
                openModal();
              }}
            >
              افزودن منبع
            </Button>
          </div>
        </div>
        <div className="w-full h-full flex items-center justify-center mt-8">
          {baseLoading && <PuffLoader size={60} color="#3e86fa" />}

          {baseError && (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-rose-500">خطا در دریافت اطلاعات</p>
            </div>
          )}

          {baseData && (
            <Table
              data={baseData.data}
              columns={resourceColumns}
              currentPage={baseData.meta.current_page}
              pageSize={baseData.meta.per_page}
              totalItems={baseData.meta.total}
              showActions
              onPageChange={(newPage) => {
                setPage(newPage);
              }}
              onEdit={(item: resourceApiType) => {
                setResource(item);
                openEditModal();
              }}
              onDelete={(item: resourceApiType) => {
                setResource(item);
                openDeleteModal();
              }}
            />
          )}
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        showCloseButton={false}
        className="max-w-[700px] bg-white"
      >
        <AddDoctorTherapyResourcesForm
          mode="create"
          onClose={closeModal}
          onSuccess={() => {
            closeModal();
            refetch();
          }}
        />
      </Modal>

      <Modal
        isOpen={editOpen}
        onClose={closeEditModal}
        showCloseButton={false}
        className="max-w-[700px] bg-white"
      >
        <AddDoctorTherapyResourcesForm
          mode="edit"
          resource={resource}
          onClose={closeEditModal}
          onSuccess={() => {
            closeEditModal();
            setResource(null);
            refetch();
          }}
        />
      </Modal>

      <Modal
        isOpen={deleteOpen}
        onClose={closeDeleteModal}
        showCloseButton={false}
        className="max-w-[480px] bg-white"
      >
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-bold">حذف منبع</h3>
          <p className="text-sm text-gray-600">
            آیا از حذف «{resource?.title}» مطمئن هستید؟
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={closeDeleteModal}>
              انصراف
            </Button>
            <Button
              variant="destructive"
              disabled={!resource?.id || isDeleting}
              onClick={() => {
                if (resource?.id) deleteResource(resource.id);
              }}
            >
              {isDeleting ? "در حال حذف..." : "حذف"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Resources;
