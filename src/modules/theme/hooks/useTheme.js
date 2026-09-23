import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getThemeApi, updateThemeApi } from "../api/theme.service";

export const useTheme = () => {
  const queryClient = useQueryClient();

  /* -------------------------------------------------------------------------- */
  /*                                    GET                                     */
  /* -------------------------------------------------------------------------- */

  const {
    data: theme = {},
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["theme"],
    queryFn: getThemeApi,
  });

  console.log("getThemeApi", theme);

  /* -------------------------------------------------------------------------- */
  /*                                  UPDATE                                    */
  /* -------------------------------------------------------------------------- */

  const updateTheme = useMutation({
    mutationFn: updateThemeApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["theme"],
      });
    },
  });

  return {
    theme,

    isLoading,

    isFetching,

    updateTheme,
  };
};
