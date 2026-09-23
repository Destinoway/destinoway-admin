"use client";

import { App } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getCMSPageApi, previewSlugApi } from "../api/cms.service";
import { useCMS } from "./useCMS";

export default function useCMSForm({ id, form }) {
  const router = useRouter();
  const { message } = App.useApp();
const { createCMS, updateCMS } = useCMS({}, false);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const page = await getCMSPageApi(id);

        console.log("use cms page", page);
        form.setFieldsValue({
          ...page,
          keywords: page?.keywords?.join(", "),
          cityMeta: page?.data?.cityMeta,

          selectedCity: page?.data?.cityMeta?.destinationId || page?.entityId,

          selectedHotel: page?.data?.hotelMeta?.hotelId || page?.entityId,

          data: page?.data,

          entityId: page?.entityId,
          url: page?.url,
        });
      } catch {
        message.error("Failed to load page");
      }
    };

    load();
  }, [id, form]);

  const previewSlug = async () => {
    const values = form.getFieldsValue(true);

    // Static / Marketing
    if (
      (values.entityType === "static" || values.entityType === "marketing") &&
      !values.title
    ) {
      return;
    }

    // Hotel City
    if (values.entityType === "hotelCity" && !values.cityMeta?.destination) {
      return;
    }

    // Hotel
    if (values.entityType === "hotel" && !values?.data?.hotelMeta?.hotelName) {
      return;
    }

    try {
      const payload = {
        title: values.title,
        entityType: values.entityType,
        entityId: values.entityId,
        data: {
          cityMeta: values.cityMeta || null,
          hotelMeta: values?.data?.hotelMeta || null,
        },
      };

      const res = await previewSlugApi(payload);

      form.setFieldsValue({
        slug: res.slug,
        url: res.url,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (values) => {
    const formValues = form.getFieldsValue(true);
    try {
      const payload = {
        title: formValues.title,
        entityType: formValues.entityType,
        description: formValues.description,
      featuredImage: formValues?.blogMeta?.featuredImage,
        entityId: formValues.entityId,
        metaTitle: formValues.metaTitle,
        metaDescription: formValues.metaDescription,
        isPublished: formValues.isPublished,
         categoryId: formValues.categoryId,
        keywords:
          formValues?.keywords?.split(",")?.map((item) => item.trim()) || [],
        data: {
          ...(formValues?.data || {}),
          cityMeta: formValues?.cityMeta || null,
        },
      };

      if (id) {
        await updateCMS.mutateAsync({
          id,
          data: payload,
        });

        router.push("/dashboard/cms/pages");
      } else {
        await createCMS.mutateAsync(payload);

        form.resetFields();

        form.setFieldsValue({
          isPublished: true,
          entityType: "static",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  return {
    handleSubmit,
    previewSlug,
    isSubmitting: createCMS.isPending || updateCMS.isPending,
  };
}
