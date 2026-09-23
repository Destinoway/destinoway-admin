"use client";

import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Empty } from "antd";
import { useState } from "react";

import { usePermission } from "@/modules/shared/hooks/usePermission";

import MasterDataFilters from "../components/MasterDataFilters";
import MasterDataForm from "../components/MasterDataForm";
import MasterDataTable from "../components/MasterDataTable";

import { useMasterData } from "../hooks/useMasterData";

import {
  MASTER_DATA_LABELS,
  MASTER_DATA_TYPES,
} from "../constants/masterData.constants";

export default function MasterDataPage() {
  const [type, setType] = useState(MASTER_DATA_TYPES.ALL);
  const [open, setOpen] = useState(false);
  const [editingMasterData, setEditingMasterData] = useState(null);

  const { canRead, canCreate, canEdit, canDelete, isAdmin } =
    usePermission("destination"); // Backend permission rename hone ke baad "masterData" kar dena

  const canFetch = canRead || isAdmin;

  const params = {
    ...(type !== MASTER_DATA_TYPES.ALL && {
      type,
    }),
  };

  const {
    masterData,
    isLoading,
    createMasterData,
    updateMasterData,
    deleteMasterData,
  } = useMasterData(params, canFetch);

  const currentLabel = MASTER_DATA_LABELS[type];

  const handleCloseDrawer = () => {
    setOpen(false);
    setEditingMasterData(null);
  };

  return (
    <>
      <Card
        title="Master Data"
        extra={
          canCreate && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingMasterData(null);
                setOpen(true);
              }}
            >
              Add {currentLabel}
            </Button>
          )
        }
      >
        <MasterDataFilters
          type={type}
          setType={setType}
        />

        {canFetch ? (
          <MasterDataTable
            masterData={masterData}
            isLoading={isLoading}
            deleteMasterData={deleteMasterData}
            canEdit={canEdit || isAdmin}
            canDelete={canDelete || isAdmin}
            onEdit={(record) => {
              setEditingMasterData(record);
              setOpen(true);
            }}
          />
        ) : (
          <Empty description="No permission to view master data" />
        )}
      </Card>

      <MasterDataForm
        open={open}
        onClose={handleCloseDrawer}
        editingMasterData={editingMasterData}
        createMasterData={createMasterData}
        updateMasterData={updateMasterData}
        selectedType={type}
      />
    </>
  );
}