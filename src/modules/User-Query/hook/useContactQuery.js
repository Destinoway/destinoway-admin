import { useQuery } from "@tanstack/react-query";
import { getContactQuery } from "../api/query.service";

export const useContactQuery = (params, enabled = true) => {
  return useQuery({
    queryKey: ["query", params],
    queryFn: () =>
      getContactQuery({
        ...params,
      }),
    keepPreviousData: true,
    enabled,
    retry: false,
  });
};
