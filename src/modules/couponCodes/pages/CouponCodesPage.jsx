"use client";

import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Empty } from "antd";
import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

import { usePermission } from "@/modules/shared/hooks/usePermission";
import CouponFilters from "../components/CouponFilters";
import CouponFormModal from "../components/CouponFormModal";
import CouponTable from "../components/CouponTable";
import { useCouponCodes } from "../hooks/useCouponCodes";

export default function CouponCodesPage() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // ================= FILTERS =================

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [validityFilter, setValidityFilter] = useState(null);

  // ================= PAGINATION =================

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [debouncedSearch] = useDebounce(search, 500);

  const { canRead, canCreate, canEdit, canDelete, isAdmin } =
    usePermission("couponCodes");

  const canFetch = canRead || isAdmin;

  // ================= FILTERS =================

  const hasActiveFilters =
    search.trim() ||
    statusFilter !== "all" ||
    moduleFilter !== "all" ||
    validityFilter;

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setModuleFilter("all");
    setValidityFilter(null);
    setPage(1);
  };

  // ================= QUERY =================

  const queryParams = useMemo(
    () => ({
      page,
      limit,

      ...(debouncedSearch && {
        search: debouncedSearch,
      }),

      ...(statusFilter !== "all" && {
        isActive: statusFilter,
      }),

      ...(moduleFilter !== "all" && {
        module: moduleFilter,
      }),

      ...(validityFilter && {
        startDate: validityFilter[0]?.startOf("day")?.toISOString(),

        endDate: validityFilter[1]?.endOf("day")?.toISOString(),
      }),
    }),
    [page, limit, debouncedSearch, statusFilter, moduleFilter, validityFilter],
  );

  // ================= API =================

  const { coupons, meta, isLoading, updateStatus, deleteCoupon } =
    useCouponCodes(queryParams, canFetch);

  console.log("React Query Data in pages =>", coupons);

  // ================= EDIT =================

  const handleEdit = (record) => {
    setEditData(record);
    setOpen(true);
  };

  return (
    <>
      <Card
        title="Coupon Management"
        extra={
          canCreate && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditData(null);
                setOpen(true);
              }}
            >
              Create Coupon
            </Button>
          )
        }
      >
        {/* FILTERS */}

        <CouponFilters
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          moduleFilter={moduleFilter}
          setModuleFilter={setModuleFilter}
          validityFilter={validityFilter}
          setValidityFilter={setValidityFilter}
          hasActiveFilters={hasActiveFilters}
          handleResetFilters={handleResetFilters}
        />

        {/* TABLE */}

        {canFetch ? (
          <CouponTable
            coupons={coupons}
            meta={meta}
            page={page}
            limit={limit}
            setPage={setPage}
            setLimit={setLimit}
            isLoading={isLoading}
            updateStatus={updateStatus}
            deleteCoupon={deleteCoupon}
            handleEdit={handleEdit}
            canEdit={canEdit || isAdmin}
            canDelete={canDelete || isAdmin}
          />
        ) : (
          <Empty description="No permission to view coupons" />
        )}
      </Card>

      {/* MODAL */}
      
      {(canCreate || canEdit || isAdmin) && (
        <CouponFormModal
          open={open}
          setOpen={setOpen}
          editData={editData}
          setEditData={setEditData}
        />
      )}
    </>
  );
}
