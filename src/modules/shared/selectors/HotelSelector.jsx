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
    setLoading(true);

    try {
      const data = await getCitiesHotelsApi(keyword);

      const hotels = data.filter((item) => item.type === "Hotel");

      setOptions(
        hotels.map((item) => ({
          label: item.name,
          value: item.id,
          raw: item,
        })),
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
      onFocus={() => fetchHotels()}
      onSearch={fetchHotels}
      onChange={(value, option) => {
        onChange?.({
          hotelId: option.raw.id,
          name: option.raw.name,
          city: option.raw.city || "",
          value,
        });
      }}
    />
  );
}
