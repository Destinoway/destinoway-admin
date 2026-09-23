"use client";

import { Form, Select, Spin } from "antd";
import { useEffect, useState } from "react";

import { searchCMSHotelsApi } from "@/modules/markeups/services/markup.service";

export default function CMSHotelSelector({ form }) {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const cityMeta = Form.useWatch("cityMeta", form);
  const selectedHotelId = Form.useWatch("selectedHotel", form);

  const loadHotels = async (searchText = "") => {
    const city = cityMeta?.city || cityMeta?.destination || "";
    const state = cityMeta?.state || cityMeta?.stateName || "";
    const country = cityMeta?.country || "";

    if (!cityMeta?.destinationId || !city) {
      setOptions([]);
      return;
    }

    setLoading(true);

    try {
      const response = await searchCMSHotelsApi({
        search: searchText,
        city,
        state,
        country,
        page: 1,
        limit: 20,
      });

      const hotels = Array.isArray(response?.data?.hotels)
        ? response.data.hotels
        : Array.isArray(response?.data)
          ? response.data
          : [];

      const mappedHotels = hotels
        .map((hotel) => {
          const hotelId = hotel?.id || hotel?.hotelId || hotel?.HotelId || "";
          const hotelName =
            hotel?.hotelName || hotel?.name || hotel?.HotelName || "";
          if (!hotelId || !hotelName) {
            return null;
          }

          return {
            label: hotelName,
            value: hotelId,
            hotel,
          };
        })
        .filter(Boolean);

      setOptions(mappedHotels);

      if (selectedHotelId) {
        const existingHotel = mappedHotels.find(
          (item) => String(item.value) === String(selectedHotelId),
        );

        if (existingHotel) {
          const hotel = existingHotel.hotel;

          form.setFieldValue(["data", "hotelMeta"], {
            hotelId: hotel?.id || hotel?.hotelId || existingHotel.value,
            hotelName: hotel?.hotelName || hotel?.name || existingHotel.label,
          });
        }
      }
    } catch (error) {
      console.error("CMS HOTEL SEARCH ERROR:", error);

      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotels();
  }, [
    cityMeta?.destinationId,
    cityMeta?.city,
    cityMeta?.destination,
    cityMeta?.state,
    cityMeta?.stateName,
    cityMeta?.country,
  ]);

  const handleHotelChange = (value) => {
    const selectedHotel = options.find(
      (item) => String(item.value) === String(value),
    );

    if (!selectedHotel) {
      form.setFieldValue("entityId", null);
      form.setFieldValue(["data", "hotelMeta"], null);
      return;
    }

    const hotel = selectedHotel.hotel || {};
    const hotelId =
      hotel?.id || hotel?.hotelId || hotel?.HotelId || selectedHotel.value;
    const hotelName =
      hotel?.hotelName ||
      hotel?.name ||
      hotel?.HotelName ||
      selectedHotel.label;

    form.setFieldValue("entityId", hotelId);
    form.setFieldValue("selectedHotel", hotelId);
    form.setFieldValue(["data", "hotelMeta"], {
      hotelId,
      hotelName,
    });

    console.log(
      "CMS FORM HOTEL META:",
      form.getFieldValue(["data", "hotelMeta"]),
    );
  };

  return (
    <Form.Item
      label={<span className="font-bold">Select Hotel</span>}
      name="selectedHotel"
      rules={[
        {
          required: true,
        },
      ]}
    >
      <Select
        showSearch
        loading={loading}
        disabled={!cityMeta?.destinationId}
        placeholder={
          !cityMeta?.destinationId
            ? "Select city first"
            : loading
              ? "Loading hotels..."
              : "Select hotel"
        }
        options={options}
        virtual
        listHeight={320}
        filterOption={false}
        onSearch={loadHotels}
        notFoundContent={loading ? <Spin size="small" /> : "No hotels found"}
        onChange={handleHotelChange}
      />
    </Form.Item>
  );
}
