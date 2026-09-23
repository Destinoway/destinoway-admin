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

  const fetchCities = async (keyword = "jaipur") => {
    setLoading(true);

    try {
      const data = await getCitiesHotelsApi(keyword);

      const cities = data.filter((item) => item.type !== "Hotel");

      console.log("cities in cityselector", cities);

      setOptions(
        cities.map((item) => ({
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
      onFocus={() => fetchCities()}
      onSearch={fetchCities}
      onChange={(selectedValue, option) => {
        onChange?.({
          value: selectedValue,

          cityId: option.raw.id,

          city: option.raw.name,

          name: option.raw.name,
        });
      }}
    />
  );
}
