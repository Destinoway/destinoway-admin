/*
|--------------------------------------------------------------------------
| SECTION TYPES
|--------------------------------------------------------------------------
*/

export const HOME_CONTENT_SECTIONS = {
  BANNER: "banner",

  VIBE: "vibe",

  TOP_RATED_HOTELS: "topRatedHotels",

  POPULAR_DESTINATIONS: "popularDestinations",
};

/*
|--------------------------------------------------------------------------
| SECTION OPTIONS
|--------------------------------------------------------------------------
*/

export const HOME_CONTENT_SECTION_OPTIONS = [
  {
    label: "Banner",
    value: HOME_CONTENT_SECTIONS.BANNER,
  },

  {
    label: "Places As Per Your Vibe",
    value: HOME_CONTENT_SECTIONS.VIBE,
  },

  {
    label: "Top Rated Hotels",
    value: HOME_CONTENT_SECTIONS.TOP_RATED_HOTELS,
  },

  {
    label: "Popular Destinations",
    value: HOME_CONTENT_SECTIONS.POPULAR_DESTINATIONS,
  },
];

/*
|--------------------------------------------------------------------------
| DRAWER MODE
|--------------------------------------------------------------------------
*/

export const HOME_CONTENT_DRAWER_MODE = {
  CREATE: "create",

  EDIT: "edit",
};
