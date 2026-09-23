export const MASTER_DATA_TYPES = {
  ALL: "all",
  DESTINATIONS: "POPULAR_DESTINATIONS",
  VACATION_TYPES: "YOUR_VIBE",
  BLOG_CATEGORIES: "BLOGS",
};

export const MASTER_DATA_LABELS = {
  [MASTER_DATA_TYPES.ALL]: "Master Data",
  [MASTER_DATA_TYPES.DESTINATIONS]: "Destination",
  [MASTER_DATA_TYPES.VACATION_TYPES]: "Vacation Type",
  [MASTER_DATA_TYPES.BLOG_CATEGORIES]: "Blog Category",
};

export const MASTER_DATA_FILTER_OPTIONS = [
  {
    label: "All",
    value: MASTER_DATA_TYPES.ALL,
  },
  {
    label: "Destinations",
    value: MASTER_DATA_TYPES.DESTINATIONS,
  },
  {
    label: "Vacation Types",
    value: MASTER_DATA_TYPES.VACATION_TYPES,
  },
  {
    label: "Blog Categories",
    value: MASTER_DATA_TYPES.BLOG_CATEGORIES,
  },
];

export const MASTER_DATA_TYPE_OPTIONS = [
  {
    label: "Destination",
    value: MASTER_DATA_TYPES.DESTINATIONS,
  },
  {
    label: "Vacation Type",
    value: MASTER_DATA_TYPES.VACATION_TYPES,
  },
  {
    label: "Blog Category",
    value: MASTER_DATA_TYPES.BLOG_CATEGORIES,
  },
];
