"use client";
import { Checkbox, Col, DatePicker, Form, Row, Select } from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { useLocations } from "../hooks/useLocations";

export default function LevelFields({ level }) {
  const [countrySearch, setCountrySearch] = useState("");
  const [stateSearch, setStateSearch] = useState("");
  const [cityHotelSearch, setCityHotelSearch] = useState("");
  // ================= DEBOUNCE =================

  const [debouncedCountrySearch] = useDebounce(countrySearch, 500);
  const [debouncedStateSearch] = useDebounce(stateSearch, 500);
  const [debouncedCityHotelSearch] = useDebounce(cityHotelSearch, 500);

  // ================= FORM =================

  const form = Form.useFormInstance();
  const countryCode = Form.useWatch("countryCode", form);
  const addDateRange = Form.useWatch("addDateRange", form);

  // ================= COUNTRIES =================

  const { data: countries = [], isLoading: countriesLoading } = useLocations({
    type: "countries",
    search: debouncedCountrySearch,
    enabled: level === "country" || level === "state",
  });

  // ================= STATES =================

  const { data: states = [], isLoading: statesLoading } = useLocations({
    type: "states",
    search: debouncedStateSearch,
    countryCode,
    enabled: !!countryCode && level === "state",
  });

  // ================= CITY / HOTEL =================

  const { data: locations = [], isLoading: locationsLoading } = useLocations({
    type: "cities-hotels",
    search: debouncedCityHotelSearch,
    enabled: level === "city" || level === "hotel",
  });

  // ================= CITY OPTIONS =================

  const cityOptions = useMemo(() => {
    if (!Array.isArray(locations)) return [];
    return locations?.map((item) => ({
      label: `${item?.name} (${item?.type})`,
      value: JSON.stringify({
        cityId: item?.id,
        cityName: item?.name,
        type: item?.type,
      }),
    }));
  }, [locations]);

  // ================= HOTEL OPTIONS =================

  const hotelOptions = useMemo(() => {
    if (!Array.isArray(locations)) return [];
    return locations
      ?.filter((item) => item?.type === "Hotel")
      ?.map((item) => ({
        label: item?.name,
        value: JSON.stringify({
          hotelId: item?.id,
          hotelName: item?.name,
        }),
      }));
  }, [locations]);

  return (
    <>
      {/* ================= COUNTRY + STATE ================= */}

      {(level === "country" || level === "state") && (
        <Row gutter={16}>
          {/* COUNTRY */}

          <Col xs={24} md={level === "state" ? 12 : 24}>
            <Form.Item
              label="Country"
              name="countryCode"
              rules={[
                {
                  required: true,
                  message: "Please select country",
                },
              ]}
            >
              <Select
                size="large"
                showSearch
                allowClear
                placeholder="Select Country"
                loading={countriesLoading}
                onSearch={setCountrySearch}
                filterOption={false}
                optionFilterProp="label"
                notFoundContent="No countries found"
                onChange={() => {
                  form.setFieldValue("stateName", undefined);
                }}
                options={
                  Array.isArray(countries)
                    ? countries?.map((item) => ({
                        label: item?.countryName || item?.name,

                        value: item?.countryCode || item?.code,
                      }))
                    : []
                }
              />
            </Form.Item>
          </Col>

          {/* STATE */}

          {level === "state" && (
            <Col xs={24} md={12}>
              <Form.Item
                label="State"
                name="stateName"
                rules={[
                  {
                    required: true,
                    message: "Please select state",
                  },
                ]}
              >
                <Select
                  size="large"
                  showSearch
                  allowClear
                  placeholder={
                    countryCode ? "Select State" : "Select country first"
                  }
                  disabled={!countryCode}
                  loading={statesLoading}
                  onSearch={setStateSearch}
                  filterOption={false}
                  optionFilterProp="label"
                  notFoundContent="No states found"
                  options={
                    Array.isArray(states)
                      ? states?.map((item) => ({
                          label: item?.stateName || item?.name,

                          value: item?.stateName || item?.name,
                        }))
                      : []
                  }
                />
              </Form.Item>
            </Col>
          )}
        </Row>
      )}

      {/* ================= CITY ================= */}

      {level === "city" && (
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="City"
              name="cityData"
              rules={[
                {
                  required: true,
                  message: "Please select city",
                },
              ]}
            >
              <Select
                size="large"
                showSearch
                labelInValue
                allowClear
                placeholder="Search City"
                loading={locationsLoading}
                onSearch={setCityHotelSearch}
                filterOption={false}
                optionFilterProp="label"
                notFoundContent={
                  debouncedCityHotelSearch?.length < 1
                    ? "Search city"
                    : "No cities found"
                }
                options={cityOptions}
              />
            </Form.Item>
          </Col>
        </Row>
      )}

      {/* ================= HOTEL ================= */}

      {level === "hotel" && (
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Hotel"
              name="hotelData"
              rules={[
                {
                  required: true,
                  message: "Please select hotel",
                },
              ]}
            >
              <Select
                size="large"
                showSearch
                allowClear
                labelInValue
                placeholder="Search Hotel"
                loading={locationsLoading}
                onSearch={setCityHotelSearch}
                filterOption={false}
                optionFilterProp="label"
                notFoundContent={
                  debouncedCityHotelSearch?.length < 1
                    ? "Search hotel"
                    : "No hotels found"
                }
                options={hotelOptions}
              />
            </Form.Item>
          </Col>
        </Row>
      )}

      {/* ================= DATE RANGE ================= */}

      {["country", "state", "city", "hotel"]?.includes(level) && (
        <>
          {/* CHECKBOX */}

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="addDateRange"
                valuePropName="checked"
                style={{
                  marginBottom: 14,
                }}
              >
                <Checkbox>Add Date Range</Checkbox>
              </Form.Item>
            </Col>
          </Row>

          {/* DATE RANGE */}

          {addDateRange && (
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Date Range"
                  name="dateRange"
                  rules={[
                    {
                      required: true,
                      message: "Please select date range",
                    },
                  ]}
                >
                  <DatePicker.RangePicker
                    size="large"
                    style={{
                      width: "100%",
                    }}
                    format="DD MMM YYYY"
                    disabledDate={(current) =>
                      current && current < dayjs().startOf("day")
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          )}
        </>
      )}
    </>
  );
}
