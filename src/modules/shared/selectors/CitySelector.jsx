"use client";

import { Select } from "antd";
import { useEffect, useState } from "react";

import { getCitiesHotelsApi } from "@/modules/markeups/services/markup.service";

export default function CitySelector({
  value,
  onChange,

  placeholder = "Search City",

  initialLabel,
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

  const fetchCities = async (keyword = "") => {
    const searchText = keyword?.trim();

    if (!searchText) {
      setOptions([]);
      return;
    }

    setLoading(true);

    try {
      const data = await getCitiesHotelsApi(searchText);

      setOptions(
        data.map((item) => {
          const label = item.displayName || item.name || item.city || item.id;

          return {
            label,
            value: item.id,
            raw: { ...item, displayName: label },
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
      onSearch={fetchCities}
      onChange={(selectedValue, option) => {
        const cityName =
          option.raw.displayName || option.raw.name || option.raw.city || "";

        onChange?.({
          value: selectedValue,

          cityId: option.raw.id,

          city: option.raw.city || cityName,

          name: cityName,
        });
      }}
    />
  );
}
