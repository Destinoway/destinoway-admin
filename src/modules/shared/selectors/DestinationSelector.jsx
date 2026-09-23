"use client";

import { Select } from "antd";
import { useEffect, useState } from "react";

import { getDestinationsApi } from "@/modules/master-data/api/destination.service";

export default function DestinationSelector({
  type,

  value,

  onChange,

  placeholder = "Select Category",

  disabled = false,
}) {
  const [options, setOptions] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDestinations = async () => {
      if (!type) return;

      try {
        setLoading(true);

        const data = await getDestinationsApi({
          type,
        });

        setOptions(
          data.map((item) => ({
            label: item.placeName,
            value: item.placeName,
          })),
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDestinations();
  }, [type]);

  return (
    <Select
      size="large"
      showSearch
      value={value}
      onChange={onChange}
      loading={loading}
      disabled={disabled}
      placeholder={placeholder}
      options={options}
      filterOption={(input, option) =>
        option?.label?.toLowerCase()?.includes(input.toLowerCase())
      }
    />
  );
}
