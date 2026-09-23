"use client";

import { Card, Spin } from "antd";
import { useState } from "react";

import BannerSection from "../components/BannerSection";
import HomeContentDrawer from "../components/HomeContentDrawer";

import PopularDestinationsSection from "../components/PopularDestinationsSection";
import TopRatedHotelsSection from "../components/TopRatedHotelsSection";
import VibeSection from "../components/VibeSection";
import { useHomeContent } from "../hooks/useHomeContent";

export default function HomeContentPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const {
    banner,
    vibes,
    topRatedHotels,
    popularDestinations,

    isLoading,

    createHomeContent,
    updateHomeContent,
    deleteHomeContent,
  } = useHomeContent();

  const handleCreate = (mode) => {
    setDrawerMode(mode);
    setEditingData(null);
    setDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteHomeContent.mutateAsync(id);
    } catch (error) {}
  };

  const handleEdit = (mode, data = null) => {
    setDrawerMode(mode);
    setEditingData(data);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setDrawerMode(null);
    setEditingData(null);
  };

  if (isLoading) {
    return (
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: 80,
          }}
        >
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6!">
      <BannerSection banner={banner[0] || null} onEdit={handleEdit} />

      <VibeSection
        vibes={vibes}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <TopRatedHotelsSection
        data={topRatedHotels[0] || null}
        onEdit={handleEdit}
      />

      <PopularDestinationsSection
        destinations={popularDestinations}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <HomeContentDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        mode={drawerMode}
        editingData={editingData}
        createHomeContent={createHomeContent}
        updateHomeContent={updateHomeContent}
      />
    </div>
  );
}
