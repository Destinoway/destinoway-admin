import { useMemo } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createHomeContentApi,
  deleteHomeContentApi,
  getHomeContentApi,
  updateHomeContentApi,
} from "../api/homeContent.service";

export const useHomeContent = () => {
  const queryClient = useQueryClient();

  /*
  |--------------------------------------------------------------------------
  | GET
  |--------------------------------------------------------------------------
  */

  const { data = [], isLoading } = useQuery({
    queryKey: ["homeContent"],

    queryFn: getHomeContentApi,
  });
  console.log("DATA:", data);
  console.log("IS ARRAY:", Array.isArray(data));

  /*
  |--------------------------------------------------------------------------
  | CREATE
  |--------------------------------------------------------------------------
  */

  const createHomeContent = useMutation({
    mutationFn: createHomeContentApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["homeContent"],
      });
    },
  });

  /*
  |--------------------------------------------------------------------------
  | UPDATE
  |--------------------------------------------------------------------------
  */

  const updateHomeContent = useMutation({
    mutationFn: updateHomeContentApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["homeContent"],
      });
    },
  });

  /*
  |--------------------------------------------------------------------------
  | DELETE
  |--------------------------------------------------------------------------
  */

  const deleteHomeContent = useMutation({
    mutationFn: deleteHomeContentApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["homeContent"],
      });
    },
  });

  /*
  |--------------------------------------------------------------------------
  | GROUP DATA
  |--------------------------------------------------------------------------
  */

  const groupedData = useMemo(() => {
    return {
      banner: data.filter((item) => item.sectionType === "banner"),

      vibes: data.filter((item) => item.sectionType === "vibe"),

      topRatedHotels: data.filter(
        (item) => item.sectionType === "topRatedHotels",
      ),

      popularDestinations: data.filter(
        (item) => item.sectionType === "popularDestinations",
      ),
    };
  }, [data]);

  return {
    ...groupedData,

    isLoading,

    createHomeContent,

    updateHomeContent,

    deleteHomeContent,
  };
};
