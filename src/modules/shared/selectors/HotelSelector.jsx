"use client";

import { Select } from "antd";
import { useEffect, useState } from "react";
import { getCitiesHotelsApi } from "@/modules/markeups/services/markup.service";

export default function HotelSelector({
  value,
  initialLabel,
  onChange,
  placeholder = "Search Hotel",
}) {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (
      value &&
      initialLabel &&
      !options.some((item) => item.value === value)
    ) {
      setOptions((prev) => [
        ...prev,
        {
          label: initialLabel,
          value,
          raw: {
            id: value,
            name: initialLabel,
          },
        },
      ]);
    }
  }, [value, initialLabel]);

  const fetchHotels = async (keyword = "") => {
    const searchText = keyword?.trim();

    if (!searchText) {
      setOptions([]);
      return;
    }

    setLoading(true);

    try {
      const data = await getCitiesHotelsApi(searchText);
      const hotels = (Array.isArray(data) ? data : []).filter(
        (item) => item?.type?.toLowerCase() === "hotel",
      );

      setOptions(
        hotels.map((item) => {
          const name = item.displayName || item.name || item.id;
          const label = item.city ? `${name} — ${item.city}` : name;

          return {
            label,
            value: item.id,
            raw: { ...item, displayName: name },
          };
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Select
      showSearch
      filterOption={false}
      value={value}
      loading={loading}
      placeholder={placeholder}
      options={options}
      onSearch={fetchHotels}
      onChange={(value, option) => {
        const hotelName =
          option?.raw?.displayName || option?.raw?.name || option?.label || "";

        onChange?.({
          hotelId: option?.raw?.id || value,
          name: hotelName,
          city: option?.raw?.city || "",
          value,
        });
      }}
    />
  );
}
