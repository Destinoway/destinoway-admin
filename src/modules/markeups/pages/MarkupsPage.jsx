"use client";
import { PlusOutlined } from "@ant-design/icons";

import { usePermission } from "@/modules/shared/hooks/usePermission";
import { Button, Card, Empty } from "antd";
import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import MarkupFilters from "../componants/MarkupFilters";
import MarkupFormModal from "../componants/MarkupFormModal";
import MarkupTable from "../componants/MarkupTable";
import { useMarkups } from "../hooks/useMarkups";

export default function MarkupsPage() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isTaxEdit, setIsTaxEdit] = useState(false);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [page, setPage] = useState(1);

  const { canRead, canCreate, canEdit, canDelete, isAdmin } =
    usePermission("Markups");

  const canFetch = canRead || isAdmin;

  const [limit, setLimit] = useState(10);
  const [debouncedSearch] = useDebounce(search, 500);
  const showSearch = !["all", "worldwide"].includes(levelFilter);
  const hasActiveFilters =
    statusFilter !== "all" || levelFilter !== "all" || search?.trim();

  // ================= RESET =================

  const handleResetFilters = useCallback(() => {
    setStatusFilter("all");
    setLevelFilter("all");
    setSearch("");
  }, []);

  // ================= API =================

  const queryParams = useMemo(
    () => ({
      page,
      limit,

      ...(statusFilter !== "all" && {
        isActive: statusFilter,
      }),

      ...(levelFilter !== "all" && {
        level: levelFilter,
      }),

      ...(showSearch &&
        debouncedSearch && {
          search: debouncedSearch,
        }),
    }),
    [page, limit, statusFilter, levelFilter, showSearch, debouncedSearch],
  );

  const {
    markups,
    meta,
    isLoading,

    taxes,
    taxMeta,
    taxLoading,

    deleteMarkup,
    updateStatus,
    deleteTax,
    updateTaxStatus,
  } = useMarkups(queryParams, canFetch);

  // ================= EDIT =================

  const handleEdit = useCallback((record, isTax = false) => {
    setEditData(record);
    setIsTaxEdit(isTax);
    setOpen(true);
  }, []);

  return (
    <>
      <Card
        title={
          levelFilter === "serviceTax"
            ? "Service Tax Management"
            : "Markup Management"
        }
        extra={
          canCreate && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditData(null);
                setIsTaxEdit(false);
                setOpen(true);
              }}
            >
              {levelFilter === "serviceTax" ? "Create Tax" : "Create Markup"}
            </Button>
          )
        }
      >
        {/* FILTERS */}

        <MarkupFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          levelFilter={levelFilter}
          setLevelFilter={setLevelFilter}
          search={search}
          setSearch={setSearch}
          showSearch={showSearch}
          hasActiveFilters={hasActiveFilters}
          handleResetFilters={handleResetFilters}
        />

        {/* TABLE */}

        {canFetch ? (
          <MarkupTable
            markups={markups}
            levelFilter={levelFilter}
            meta={meta}
            page={page}
            limit={limit}
            setPage={setPage}
            setLimit={setLimit}
            isLoading={isLoading}
            deleteMarkup={deleteMarkup}
            updateStatus={updateStatus}
            handleEdit={handleEdit}
            taxes={taxes}
            taxMeta={taxMeta}
            taxLoading={taxLoading}
            deleteTax={deleteTax}
            updateTaxStatus={updateTaxStatus}
            canEdit={canEdit || isAdmin}
            canDelete={canDelete || isAdmin}
          />
        ) : (
          <Empty description="No permission to view markups" />
        )}
      </Card>

      {/* MODAL */}

      {(canCreate || canEdit || isAdmin) && (
        <MarkupFormModal
          open={open}
          setOpen={setOpen}
          editData={editData}
          isTaxEdit={isTaxEdit}
          setEditData={setEditData}
          setIsTaxEdit={setIsTaxEdit}
        />
      )}
    </>
  );
}
