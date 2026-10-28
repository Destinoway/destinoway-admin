"use client";

import { useQuery } from "@tanstack/react-query";
import { Form, Select, Spin } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useDebounce } from "use-debounce";

import {
  getCMSHotelSearchResultsApi,
  startCMSHotelSearchApi,
} from "@/modules/markeups/services/markup.service";

export default function CMSHotelSelector({ form }) {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText] = useDebounce(searchText, 300);
  const cityMeta = Form.useWatch("cityMeta", form);
  const geoCode = cityMeta?.geoCode || cityMeta?.coordinates || {
    lat: cityMeta?.latitude,
    long: cityMeta?.longitude,
  };
  const hasCoordinates =
    geoCode?.lat !== null &&
    geoCode?.lat !== undefined &&
    geoCode?.long !== null &&
    geoCode?.long !== undefined;
  const startSearch = useQuery({
    queryKey: [
      "cmsHotelSearchStart",
      cityMeta?.destinationId,
      geoCode?.lat,
      geoCode?.long,
      cityMeta?.countryCode,
    ],
    queryFn: async () => {
      const today = dayjs();
      return startCMSHotelSearchApi({
        locationId: cityMeta.destinationId,
        geoCode,
        checkIn: today.format("YYYY-MM-DD"),
        checkOut: today.add(1, "day").format("YYYY-MM-DD"),
        rooms: [{ adults: 1, children: 0, childAges: [] }],
        destinationCountryCode: cityMeta.countryCode,
      });
    },
    enabled: Boolean(cityMeta?.destinationId && hasCoordinates),
    staleTime: 5 * 60 * 1000,
  });
  const resultsQuery = useQuery({
    queryKey: [
      "cmsHotelSearchResults",
      startSearch.data?.searchId,
      debouncedSearchText,
    ],
    queryFn: () =>
      getCMSHotelSearchResultsApi({
        searchId: startSearch.data.searchId,
        page: 1,
        limit: 5000,
        hotelName: debouncedSearchText,
      }),
    enabled: Boolean(startSearch.data?.searchId),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
    refetchInterval: (query) => {
      const result = query.state.data;
      const status = result?.status?.toLowerCase();
      const contentStatus = result?.contentStatus?.toLowerCase();
      const rateStatus = result?.rateStatus?.toLowerCase();
      const hasCompletePage =
        Array.isArray(result?.items) && result?.pagination?.hasMore === false;
      const pendingStatuses = [
        "processing",
        "pending",
        "queued",
        "starting",
        "running",
      ];
      const isProcessing = [status, contentStatus, rateStatus].some((value) =>
        pendingStatuses.includes(value),
      );

      return isProcessing && !hasCompletePage ? 2000 : false;
    },
    refetchIntervalInBackground: false,
  });
  const hotels = resultsQuery.data?.items || [];
  const loading = startSearch.isLoading || resultsQuery.isFetching;
  const searchError = startSearch.error || resultsQuery.error;
  const backendError = resultsQuery.data?.error;

  const options = hotels
    .map((hotel) => {
      const supplierHotelId = hotel?.supplierHotelId;
      const hotelName = hotel?.name;
      if (!supplierHotelId || !hotelName) return null;

      return {
        label: `${hotelName}${hotel?.starRating ? ` - ${hotel.starRating} stars` : ""}`,
        value: supplierHotelId,
        hotel,
      };
    })
    .filter(Boolean)
    .filter((option) =>
      option.label.toLowerCase().includes(searchText.trim().toLowerCase()),
    );

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
    const hotelName = hotel?.name || selectedHotel.label;

    form.setFieldValue("entityId", selectedHotel.value);
    form.setFieldValue("selectedHotel", selectedHotel.value);
    form.setFieldValue(["data", "hotelMeta"], {
      hotelName,
      supplierHotelId: selectedHotel.value,
      image: hotel?.heroImage || hotel?.images?.[0] || "",
      images: hotel?.images || [],
      starRating: hotel?.starRating ?? null,
      address: hotel?.address || "",
      city: cityMeta?.city || cityMeta?.destination || "",
      stateName: cityMeta?.stateName || "",
      country: hotel?.country || "",
      rating: hotel?.userReview?.rating ?? null,
      reviews: hotel?.userReview?.count ?? null,
      amenities: hotel?.facilities || [],
      priceRange: hotel?.price?.totalPrice
        ? `${hotel.price.currency || ""} ${hotel.price.totalPrice}`.trim()
        : "",
    });
  };

  return (
    <div>
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
          disabled={!cityMeta?.destinationId || !hasCoordinates}
          placeholder={
            !cityMeta?.destinationId || !hasCoordinates
              ? "Select city first"
              : loading
                ? "Loading hotels..."
                : "Select hotel"
          }
          options={options}
          virtual
          listHeight={320}
          filterOption={false}
          onSearch={setSearchText}
          notFoundContent={loading ? <Spin size="small" /> : "No hotels found"}
          onChange={handleHotelChange}
        />
      </Form.Item>
      {(searchError || backendError) && (
        <div role="alert" className="mt-1 text-sm text-red-600">
          {searchError?.message || backendError || "Hotel search failed. Try selecting the destination again."}
        </div>
      )}
    </div>
  );
}
