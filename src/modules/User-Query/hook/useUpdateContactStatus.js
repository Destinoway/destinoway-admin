import { useMutation } from "@tanstack/react-query";
import { updateContactStatus } from "../api/query.service";

export const useUpdateContactStatus = () => {
  return useMutation({
    mutationFn: ({ id, payload }) => updateContactStatus(id, payload),

    onSuccess: () => {},
  });
};
