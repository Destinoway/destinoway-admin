"use client";

import { Form, Select } from "antd";
import { useEffect, useState } from "react";
import { getCitiesHotelsApi } from "@/modules/markeups/services/markup.service";

export default function CMSCitySelector({ form }) {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const selectedCity = Form.useWatch("selectedCity", form);

  useEffect(() => {
    const cityMeta = form.getFieldValue("cityMeta");
    if (
      selectedCity &&
      cityMeta?.destination &&
      !options.some((option) => option.value === selectedCity)
    ) {
      setOptions((previous) => [
        ...previous,
        {
          label: cityMeta.destination,
          value: selectedCity,
          raw: {
            name: cityMeta.destination,
            id: selectedCity,
            type: "city",
          },
        },
      ]);
    }
  }, [selectedCity, form, options]);

  const fetchCities = async (value = "") => {
    const searchText = value?.trim();

    if (!searchText || searchText.length < 2) {
      return;
    }

    setLoading(true);

    try {
      const data = await getCitiesHotelsApi(searchText);

      const cities = Array.isArray(data)
        ? data.filter((item) => item?.type?.toLowerCase() === "city")
        : [];

      setOptions(
        cities.map((item) => ({
          label: item?.displayName || item?.name || item?.city || "",
          value: item?.id || item?.destinationId || item?.name || "",
          raw: item,
        })),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form.Item
      label={<span className="font-bold">Select City</span>}
      name="selectedCity"
      rules={[
        {
          required: true,
        },
      ]}
    >
      <Select
        showSearch
        filterOption={false}
        placeholder="Search city"
        options={options}
        loading={loading}
        onSearch={fetchCities}
        onChange={(value, option) => {
          const city = option?.raw || {};
          form.setFieldValue("entityId", value);
          form.setFieldValue("selectedCity", value);
          form.setFieldValue("cityMeta", {
            destination: city?.displayName || city?.name || city?.city || "",
            destinationId: city?.id || city?.destinationId || value,
            city: city?.city || city?.name || "",
            state: city?.state || city?.stateName || "",
            stateName: city?.stateName || city?.state || "",
            country: city?.country || "",
            countryCode: city?.countryCode || "",
            type: city?.type || "city",
          });
          form.setFieldValue("selectedHotel", null);
        }}
      />
    </Form.Item>
  );
}
