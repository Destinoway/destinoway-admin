import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/user.service";

export const useCustomers = (params) => {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () =>
      getUsers({
        ...params,
        type: "customer",
      }),
    keepPreviousData: true,
  });
};
