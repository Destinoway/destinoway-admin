"use client";

import { useQuery } from "@tanstack/react-query";
import { Alert, Empty, Table, Tag } from "antd";
import { getCMSRedirectsApi } from "../api/cms.service";

const formatDate = (value) =>
  value ? new Date(value).toLocaleString("en-IN") : "-";

export default function CMSRedirectHistory({ id }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["cmsRedirects", id],
    queryFn: () => getCMSRedirectsApi(id),
    enabled: Boolean(id),
    retry: false,
  });

  return (
    <div style={{ marginTop: 16 }}>
      <div className="font-bold" style={{ marginBottom: 8 }}>
        Slug Redirect History
      </div>

      {isError ? (
        <Alert
          type="info"
          showIcon
          message="Redirect history could not be loaded."
        />
      ) : (
        <>
          <Table
            rowKey={(record) => record._id || record.fromPath}
            size="small"
            bordered
            loading={isLoading}
            dataSource={data || []}
            pagination={false}
            locale={{ emptyText: <Empty description="No redirects recorded" /> }}
            columns={[
              { title: "Old path", dataIndex: "fromPath" },
              { title: "Redirects to", dataIndex: "toPath" },
              {
                title: "Status",
                dataIndex: "statusCode",
                width: 90,
                render: (code) => <Tag>{code || 301}</Tag>,
              },
              {
                title: "Recorded",
                dataIndex: "createdAt",
                render: formatDate,
              },
              {
                title: "Updated",
                dataIndex: "updatedAt",
                render: formatDate,
              },
            ]}
            scroll={{ x: 600 }}
          />
          <div style={{ marginTop: 6, opacity: 0.65, fontSize: 12 }}>
            Redirects recorded by the CMS when a page URL changed. This is
            history only; it does not confirm the public website is serving
            these redirects.
          </div>
        </>
      )}
    </div>
  );
}
