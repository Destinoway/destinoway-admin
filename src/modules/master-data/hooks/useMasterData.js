"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createDestinationApi,
  deleteDestinationApi,
  getDestinationsApi,
  updateDestinationApi,
} from "../api/destination.service";

export const useMasterData = (params = {}, enabled = true) => {
  const queryClient = useQueryClient();

  const queryKey = ["master-data", params];

  // ===================== GET =====================

  const { data = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => getDestinationsApi(params),
    enabled,
    keepPreviousData: true,
  });

  // ===================== CREATE =====================

  const createMasterData = useMutation({
    mutationFn: createDestinationApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["master-data"],
      });
    },
  });

  // ===================== UPDATE =====================

  const updateMasterData = useMutation({
    mutationFn: ({ id, data }) =>
      updateDestinationApi({
        id,
        data,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["master-data"],
      });
    },
  });

  // ===================== DELETE =====================

  const deleteMasterData = useMutation({
    mutationFn: deleteDestinationApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["master-data"],
      });
    },
  });

  return {
    masterData: data,
    isLoading,
    createMasterData,
    updateMasterData,
    deleteMasterData,
  };
};
