"use client";

import { PlusOutlined } from "@ant-design/icons";

import { usePermission } from "@/modules/shared/hooks/usePermission";
import { Button, Card, Empty } from "antd";
import { useState } from "react";
import { useDebounce } from "use-debounce";

import CMSFilters from "../components/CMSFilters";
import CMSTable from "../components/CMSTable";
import { useCMS } from "../hooks/useCMS";

export default function CMSListPage() {
  const [search, setSearch] = useState("");
  const [entityType, setEntityType] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [debouncedSearch] = useDebounce(search, 500);

  const { canRead, canCreate, canEdit, canDelete, isAdmin } =
    usePermission("cmsPages");

  const canFetch = canRead || isAdmin;

  const queryParams = {
    page,
    limit,

    ...(entityType !== "all" && {
      entityType,
    }),

    ...(debouncedSearch && {
      search: debouncedSearch,
    }),
  };

  const { pages, meta, isLoading, deleteCMS } = useCMS(queryParams, canFetch);

  return (
    <Card
      title="CMS Pages"
      extra={
        canCreate && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            href="/dashboard/cms/create"
          >
            Create Page
          </Button>
        )
      }
    >
      <CMSFilters
        search={search}
        setSearch={setSearch}
        entityType={entityType}
        setEntityType={setEntityType}
      />

      {canFetch ? (
        <CMSTable
          pages={pages}
          meta={meta}
          page={page}
          limit={limit}
          setPage={setPage}
          setLimit={setLimit}
          isLoading={isLoading}
          deleteCMS={deleteCMS}
          canEdit={canEdit || isAdmin}
          canDelete={canDelete || isAdmin}
        />
      ) : (
        <Empty description="No permission to view CMS pages" />
      )}
    </Card>
  );
}
