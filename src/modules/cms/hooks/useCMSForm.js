"use client";

import { App } from "antd";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import {
  getCMSPageApi,
  getCMSPageBySlugApi,
  previewSlugApi,
} from "../api/cms.service";
import { useCMS } from "./useCMS";
import { slugify } from "../utils/cmsUrl";

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
          blogMeta: {
            ...page?.blogMeta,
            featuredImage: page?.featuredImage ?? page?.blogMeta?.featuredImage,
          },
          keywords: page?.keywords?.join(", "),
          cityMeta: page?.data?.cityMeta,

          selectedCity: page?.data?.cityMeta?.destinationId || page?.entityId,

          selectedHotel:
            page?.data?.hotelMeta?.supplierHotelId ||
            page?.data?.hotelMeta?.hotelId ||
            page?.entityId,

          data: page?.data,

          entityId: page?.entityId,
          url: page?.url,
          canonicalUrl: page?.canonicalUrl ?? "",
          featuredImageAlt: page?.featuredImageAlt ?? "",
          originalSlug: page?.slug,
          originalUrl: page?.url,
        });
      } catch {
        message.error("Failed to load page");
      }
    };

    load();
  }, [id, form, message]);

  const previewSlug = useCallback(async () => {
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
  }, [form]);

  const handleSubmit = async (values) => {
    const formValues = form.getFieldsValue(true);

    if (formValues.entityType === "hotelCity") {
      const c = formValues.cityMeta;
      const hasCoords =
        (c?.coordinates?.lat ?? c?.latitude) != null &&
        (c?.coordinates?.long ?? c?.longitude) != null;
      if (!c?.destination || !c?.destinationId || !hasCoords) {
        message.warning(
          "City name, destination ID and coordinates are required",
        );
        return;
      }
    }

    if (formValues.entityType === "hotel") {
      if (!formValues.cityMeta?.destination || !formValues.entityId) {
        message.warning("City and hotel selection are required");
        return;
      }
    }

    const finalSlug = slugify(formValues.slug || "");
    if (finalSlug !== (formValues.slug || "")) {
      form.setFieldsValue({ slug: finalSlug });
    }

    if (finalSlug) {
      try {
        const existing = await getCMSPageBySlugApi(finalSlug);
        if (existing && (existing._id || existing.id) !== id) {
          message.warning(
            `Slug "${finalSlug}" already exists. Please change it.`,
          );
          return;
        }
      } catch (err) {
        if (err?.response?.status !== 404) {
          message.error("Could not verify whether this slug is available.");
          return;
        }
      }
    }

    try {
      const payload = {
        title: formValues.title,
        ...(finalSlug && { slug: finalSlug }),
        entityType: formValues.entityType,
        description: formValues.description,
        featuredImage: formValues?.blogMeta?.featuredImage,
        featuredImageAlt: (formValues.featuredImageAlt ?? "").trim(),
        entityId: formValues.entityId,
        metaTitle: formValues.metaTitle,
        metaDescription: formValues.metaDescription,
        canonicalUrl: (formValues.canonicalUrl ?? "").trim(),
        isPublished: formValues.isPublished,
        categoryId: formValues.categoryId,
        keywords: (formValues?.keywords || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        data: {
          ...(formValues?.data || {}),
          cityMeta: formValues?.cityMeta || null,
        },
      };

      let savedPage;
      if (id) {
        const response = await updateCMS.mutateAsync({
          id,
          data: payload,
        });
        savedPage = response?.data?.data;
        await verifyPublishedPage(savedPage);
        router.push("/dashboard/cms/pages");
      } else {
        const response = await createCMS.mutateAsync(payload);
        savedPage = response?.data?.data;
        await verifyPublishedPage(savedPage);

        form.resetFields();

        form.setFieldsValue({
          isPublished: true,
          entityType: "static",
        });
      }
    } catch (err) {
      const apiMessage = err?.response?.data?.message;
      // The API client already toasts the error; also pin slug errors to the field.
      if (/slug/i.test(apiMessage || "")) {
        form.setFields([{ name: "slug", errors: [apiMessage] }]);
      }
    }
  };

  const verifyPublishedPage = async (page) => {
    if (!page?.isPublished || !page?.slug) return;

    try {
      const publicPage = await getCMSPageBySlugApi(page.slug);
      if (publicPage?.slug !== page.slug) {
        message.warning("Saved, but public CMS verification did not match.");
      }
    } catch {
      message.warning("Saved, but public CMS verification could not complete.");
    }
  };

  return {
    handleSubmit,
    previewSlug,
    isSubmitting: createCMS.isPending || updateCMS.isPending,
  };
}
