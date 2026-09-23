"use client";
import { usePermission } from "@/modules/shared/hooks/usePermission";
import { Card, Empty } from "antd";

import CMSForm from "../components/CMSForm";

export default function CMSFormPage({ id }) {
  const { canCreate, canEdit, isAdmin } = usePermission("cmsPages");

  const hasAccess = id ? canEdit || isAdmin : canCreate || isAdmin;

  if (!hasAccess) {
    return <Empty description="You don't have permission" />;
  }

  return (
    <Card title={id ? "Edit CMS Page" : "Create CMS Page"}>
      <CMSForm id={id} />
    </Card>
  );
}
