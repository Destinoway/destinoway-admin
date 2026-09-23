import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createMarkupApi,
  createTaxApi,
  deleteMarkupApi,
  deleteTaxApi,
  getMarkupsApi,
  getTaxesApi,
  updateMarkupApi,
  updateMarkupStatusApi,
  updateTaxApi,
  updateTaxStatusApi,
} from "../services/markup.service";

export const useMarkups = (params = {}) => {
  const queryClient = useQueryClient();

  // ================= GET =================

  const { data, isLoading } = useQuery({
    queryKey: ["markups", params],

    queryFn: () => getMarkupsApi(params),

    keepPreviousData: true,
  });

  // ================= CREATE =================

  const createMarkup = useMutation({
    mutationFn: createMarkupApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["markups"],
      });
    },
  });

  // ================= UPDATE =================

  const updateMarkup = useMutation({
    mutationFn: ({ id, data }) =>
      updateMarkupApi({
        id,
        data,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["markups"],
      });
    },
  });

  // ================= DELETE =================

  const deleteMarkup = useMutation({
    mutationFn: deleteMarkupApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["markups"],
      });
    },
  });

  // ================= STATUS UPDATE =================

  const updateStatus = useMutation({
    mutationFn: ({ id, data }) =>
      updateMarkupStatusApi({
        id,
        data,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["markups"],
      });
    },
  });

  // ================= CREATE TAX =================

  const createTax = useMutation({
    mutationFn: createTaxApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["markups"],
      });
    },
  });

  const { data: taxData, isLoading: taxLoading } = useQuery({
    queryKey: ["taxes", params],

    queryFn: () => getTaxesApi(params),

    enabled: params?.level === "serviceTax",
  });

  const updateTax = useMutation({
    mutationFn: ({ id, data }) =>
      updateTaxApi({
        id,
        data,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["taxes"],
      });
    },
  });

  const deleteTax = useMutation({
    mutationFn: deleteTaxApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["taxes"],
      });
    },
  });

  const updateTaxStatus = useMutation({
    mutationFn: ({ id, data }) =>
      updateTaxStatusApi({
        id,
        data,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["taxes"],
      });
    },
  });

  return {
    markups: data?.markups || [],
    meta: data?.meta || {},
    isLoading,
    createMarkup,
    createTax,
    updateTax,
    deleteTax,
    updateTaxStatus,
    updateMarkup,
    deleteMarkup,
    updateStatus,
    taxes: taxData?.taxes || [],
    taxMeta: taxData?.meta || {},
    taxLoading,
  };
};
