import {
  EnvironmentOutlined,
  GlobalOutlined,
  HomeOutlined,
  PercentageOutlined,
  ShopOutlined,
} from "@ant-design/icons";

export const LEVEL_OPTIONS = [
  {
    label: "Worldwide",
    value: "worldwide",
    icon: <GlobalOutlined />,
    color: "#722ed1",
  },

  {
    label: "Country",
    value: "country",
    icon: <EnvironmentOutlined />,
    color: "#1677ff",
  },

  {
    label: "State",
    value: "state",
    icon: <EnvironmentOutlined />,
    color: "#fa8c16",
  },

  {
    label: "City",
    value: "city",
    icon: <ShopOutlined />,
    color: "#13c2c2",
  },

  {
    label: "Hotel",
    value: "hotel",
    icon: <HomeOutlined />,
    color: "#eb2f96",
  },
  {
    label: "Service Tax",
    value: "serviceTax",
    icon: <PercentageOutlined />,
    color: "#722ed1",
  },
];

export const getLevelConfig = (record) => ({
  worldwide: {
    label: "Worldwide",
    color: "purple",
    value: "Global Pricing",
    subtitle: "Applied on all locations",
    icon: <GlobalOutlined />,
  },

  country: {
    label: "Country",
    color: "blue",
    value: record?.countryName || record?.countryCode,
    subtitle: `Country pricing • ${record?.countryName || ""}`,
  },

  state: {
    label: "State",
    color: "orange",
    value: record?.stateName,
    subtitle: `${record?.countryName} • State pricing`,
  },

  city: {
    label: "City",
    color: "cyan",
    value: record?.cityName,
    subtitle: "City specific pricing",
  },

  hotel: {
    label: "Hotel",
    color: "magenta",
    value: record?.hotelName,
    subtitle: "Hotel specific pricing",
  },

  serviceTax: {
    label: "Service Tax",
    color: "gold",
    value: "Service Tax",
    subtitle: "Applied on total booking amount",
  },
});

export const levelOptions = [
  {
    label: "All Levels",
    value: "all",
  },
  {
    label: "Worldwide",
    value: "worldwide",
  },
  {
    label: "Country",
    value: "country",
  },
  {
    label: "State",
    value: "state",
  },
  {
    label: "City",
    value: "city",
  },
  {
    label: "Hotel",
    value: "hotel",
  },
  {
    label: "serviceTax",
    value: "serviceTax",
  },
];

export const statusOptions = [
  {
    label: "All Status",
    value: "all",
  },

  {
    label: "Active",
    value: true,
  },

  {
    label: "Inactive",
    value: false,
  },
];
