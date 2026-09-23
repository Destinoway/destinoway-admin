import { useMutation } from "@tanstack/react-query";
import { uploadMediaApi } from "../services/media.service";

export const useMediaUpload = () => {
  const uploadMedia = useMutation({
    mutationFn: uploadMediaApi,
  });

  return {
    uploadMedia,
  };
};
