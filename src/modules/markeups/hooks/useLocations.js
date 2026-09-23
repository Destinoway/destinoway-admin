import { useQuery } from "@tanstack/react-query";
import {
  getCitiesHotelsApi,
  getCountriesApi,
  getStatesApi,
} from "../services/markup.service";

export const useLocations = ({
  type,
  search = "",
  countryCode = "",
  enabled = true,
}) =>
  useQuery({
    queryKey: ["locations", type, search, countryCode],
    queryFn: async () => {
      switch (type) {
        case "countries":
          return await getCountriesApi(search);
        case "states":
          return await getStatesApi({
            countryCode,
            search,
          });
        case "cities-hotels":
          return await getCitiesHotelsApi(search);
        default:
          return [];
      }
    },

    enabled,
  });
