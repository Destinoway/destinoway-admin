"use client";

import { Drawer } from "antd";

import { HOME_CONTENT_SECTIONS } from "../constants/homeContent.constants";
import BannerForm from "../forms/BannerForm";
import PopularDestinationsForm from "../forms/PopularDestinationsForm";
import TopRatedHotelsForm from "../forms/TopRatedHotelsForm";
import VibeForm from "../forms/VibeForm";

export default function HomeContentDrawer({
  open,
  onClose,

  mode,

  editingData,

  createHomeContent,
  updateHomeContent,
}) {
  const getTitle = () => {
    switch (mode) {
      case HOME_CONTENT_SECTIONS.BANNER:
        return "Banner";

      case HOME_CONTENT_SECTIONS.VIBE:
        return "Places As Per Your Vibe";

      case HOME_CONTENT_SECTIONS.TOP_RATED_HOTELS:
        return "Top Rated Hotels";

      case HOME_CONTENT_SECTIONS.POPULAR_DESTINATIONS:
        return "Popular Destinations";

      default:
        return "Home Content";
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size={700}
      destroyOnClose
      title={getTitle()}
    >
      {/* Form will come here */}

      {mode === HOME_CONTENT_SECTIONS.BANNER && (
        <BannerForm
          editingData={editingData}
          createHomeContent={createHomeContent}
          updateHomeContent={updateHomeContent}
          onSuccess={onClose}
        />
      )}

      {mode === HOME_CONTENT_SECTIONS.VIBE && (
        <VibeForm
          editingData={editingData}
          createHomeContent={createHomeContent}
          updateHomeContent={updateHomeContent}
          onSuccess={onClose}
        />
      )}

      {mode === HOME_CONTENT_SECTIONS.TOP_RATED_HOTELS && (
        <TopRatedHotelsForm
          editingData={editingData}
          createHomeContent={createHomeContent}
          updateHomeContent={updateHomeContent}
          onSuccess={onClose}
        />
      )}

      {mode === HOME_CONTENT_SECTIONS.POPULAR_DESTINATIONS && (
        <PopularDestinationsForm
          editingData={editingData}
          createHomeContent={createHomeContent}
          updateHomeContent={updateHomeContent}
          onSuccess={onClose}
        />
      )}
    </Drawer>
  );
}
