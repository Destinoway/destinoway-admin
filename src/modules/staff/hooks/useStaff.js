import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/user.service";

export const useStaff = (params) => {
  return useQuery({
    queryKey: ["staff", params],
    queryFn: () =>
      getUsers({
        type: "staff",
        ...params,
      }),
  });
};
