"use client";

import { getCitiesHotelsApi } from "@/modules/markeups/services/markup.service";
import { Form, Select } from "antd";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function CMSCitySelector({ form, entityType }) {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const selectedCity = Form.useWatch("selectedCity", form);
  const cityMeta = Form.useWatch("cityMeta", form);
  const selectOptions =
    selectedCity &&
    cityMeta?.destination &&
    !options.some((option) => option.value === selectedCity)
      ? [
          ...options,
          {
            label: cityMeta.destination,
            value: selectedCity,
            raw: {
              name: cityMeta.destination,
              id: selectedCity,
              type: "city",
            },
          },
        ]
      : options;

  const fetchCities = useDebouncedCallback(async (value = "") => {
    const searchText = value?.trim();

    if (!searchText || searchText.length < 2) {
      return;
    }

    setLoading(true);

    try {
      const data = await getCitiesHotelsApi(searchText);

      const destinations = Array.isArray(data) ? data : [];

      setOptions(
        destinations.map((item) => ({
          label: `${item?.type || "destination"} - ${item?.displayName || item?.name || item?.city || item?.id || ""}`,
          value: item?.id || item?.destinationId || item?.name || "",
          raw: item,
        })),
      );
    } finally {
      setLoading(false);
    }
  }, 300);

  return (
    <Form.Item
      label={<span className="font-bold">Select Destination</span>}
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
        placeholder="Search destinations"
        options={selectOptions}
        loading={loading}
        onSearch={fetchCities}
        onChange={(value, option) => {
          const city = option?.raw || {};
          const coordinates = city?.coordinates || {
            lat: city?.latitude ?? null,
            long: city?.longitude ?? null,
          };
          const displayName =
            city?.displayName || city?.name || city?.city || "";
          const cityId = city?.id || city?.destinationId || value;

          form.setFieldValue(
            "entityId",
            entityType === "hotelCity" ? value : null,
          );
          form.setFieldValue("selectedCity", value);
          form.setFieldValue("cityMeta", {
            ...city,
            name: city?.name || displayName,
            displayName,
            destination: displayName,
            destinationId: cityId,
            city: city?.city || city?.name || displayName,
            state: city?.state || city?.stateName || "",
            stateName: city?.stateName || city?.state || "",
            country: city?.country || "",
            countryCode: city?.countryCode || "",
            type: city?.type || "city",
            coordinates,
            latitude: city?.latitude ?? coordinates?.lat ?? null,
            longitude: city?.longitude ?? coordinates?.long ?? null,
            geoCode: {
              lat: city?.geoCode?.lat ?? coordinates?.lat ?? null,
              long: city?.geoCode?.long ?? coordinates?.long ?? null,
            },
          });
          form.setFieldValue("selectedHotel", null);
          form.setFieldValue(["data", "hotelMeta"], null);
        }}
      />
    </Form.Item>
  );
}
