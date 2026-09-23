import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCMSPageApi,
  deleteCMSPageApi,
  getCMSPagesApi,
  updateCMSPageApi,
} from "../api/cms.service";

export const useCMS = (params = {}, enabled = true) => {
  const queryClient = useQueryClient();

  /*
  GET
  */
   const { data, isLoading } = useQuery({
    queryKey: ["cmsPages", params],
    queryFn: () => getCMSPagesApi(params),
    enabled,
    keepPreviousData: true,
  });

  /*
  CREATE
  */
  const createCMS = useMutation({
    mutationFn: createCMSPageApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cmsPages"],
      });
    },
  });

  /*
  UPDATE
  */
  const updateCMS = useMutation({
    mutationFn: ({ id, data }) =>
      updateCMSPageApi({
        id,
        data,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cmsPages"],
      });
    },
  });

  /*
  DELETE
  */
  const deleteCMS = useMutation({
    mutationFn: deleteCMSPageApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cmsPages"],
      });
    },
  });

  return {
    pages: data?.pages || [],

    meta: data?.meta || {},

    isLoading,

    createCMS,
    updateCMS,
    deleteCMS,
  };
};
