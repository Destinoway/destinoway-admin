"use client";

import { useQuery } from "@tanstack/react-query";
import { Alert, Form, Input } from "antd";
import { useEffect, useMemo, useRef } from "react";
import { useDebounce } from "use-debounce";
import { checkCMSMetadataApi } from "../api/cms.service";

// Admin-side fallback only; /cms/templates returns page layouts, not SEO templates.
const DEFAULT_TEMPLATES = {
  metaTitle: "{title} | Destinoway",
  metaDescription:
    "Discover {title} with Destinoway. Find travel inspiration, stays, and experiences for your next trip.",
};

const interpolate = (template, values) =>
  String(template || "").replace(/\{\{\s*(\w+)\s*\}\}|\{\s*(\w+)\s*\}/g, (_, double, single) => {
    return values[double || single] ?? "";
  }).trim();

const CANONICAL_MAX_LENGTH = 2048;

const validateCanonicalUrl = (_, value) => {
  const url = String(value ?? "").trim();
  if (!url) return Promise.resolve();

  if (url.length > CANONICAL_MAX_LENGTH) {
    return Promise.reject(
      new Error(`Canonical URL must be at most ${CANONICAL_MAX_LENGTH} characters`),
    );
  }

  // Site-relative path; "//host" is protocol-relative, not a path.
  if (url.startsWith("/") && !url.startsWith("//")) return Promise.resolve();

  try {
    const { protocol } = new URL(url);
    if (protocol === "http:" || protocol === "https:") return Promise.resolve();
  } catch {
    // falls through to the error below
  }

  return Promise.reject(
    new Error("Enter an http(s) URL or a path starting with /"),
  );
};

export default function CMSSeoFields({ form, id }) {
  const title = Form.useWatch("title", form);
  const description = Form.useWatch("description", form);
  const slug = Form.useWatch("slug", form);
  const metaTitle = Form.useWatch("metaTitle", form);
  const metaDescription = Form.useWatch("metaDescription", form);
  const generatedValues = useRef({});

  const [debouncedTitle] = useDebounce((metaTitle || "").trim(), 600);
  const [debouncedDescription] = useDebounce(
    (metaDescription || "").trim(),
    600,
  );

  const metadataQuery = useQuery({
    queryKey: ["cmsMetadataCheck", debouncedTitle, debouncedDescription, id],
    queryFn: () =>
      checkCMSMetadataApi({
        metaTitle: debouncedTitle,
        metaDescription: debouncedDescription,
        excludeId: id,
      }),
    enabled: Boolean(debouncedTitle || debouncedDescription),
    retry: false,
  });

  const templateValues = useMemo(() => {
    const values = { title: title || "", description: description || "", slug: slug || "" };
    return {
      metaTitle: interpolate(DEFAULT_TEMPLATES.metaTitle, values),
      metaDescription: interpolate(DEFAULT_TEMPLATES.metaDescription, values),
    };
  }, [description, slug, title]);

  useEffect(() => {
    if (!title) return;

    const valuesToSet = {};
    for (const field of ["metaTitle", "metaDescription"]) {
      const currentValue = form.getFieldValue(field);
      const previousGenerated = generatedValues.current[field];
      if (
        (!currentValue || currentValue === previousGenerated) &&
        !form.isFieldTouched(field)
      ) {
        valuesToSet[field] = templateValues[field];
        generatedValues.current[field] = templateValues[field];
      }
    }

    if (Object.keys(valuesToSet).length) form.setFieldsValue(valuesToSet);
  }, [form, templateValues, title]);

  // Only trust a result that matches the values currently typed (ignores stale data).
  const duplicateOf = (field, current) => {
    const result = metadataQuery.data?.[field];
    return result?.duplicate && result.value === current ? result : null;
  };
  const titleDuplicate = duplicateOf("metaTitle", (metaTitle || "").trim());
  const descriptionDuplicate = duplicateOf(
    "metaDescription",
    (metaDescription || "").trim(),
  );

  const duplicateMessage = (label, result) =>
    `This ${label} is already used by ${result.count} other page${result.count > 1 ? "s" : ""}: ${result.pages
      .map((page) => page.title || page.slug)
      .filter(Boolean)
      .join(", ")}${result.count > result.pages.length ? ", …" : ""}. Saving is still allowed.`;

  return (
    <>
      <Form.Item name="metaTitle" label="Meta Title">
        <Input showCount maxLength={100} />
      </Form.Item>
      {titleDuplicate && (
        <Alert
          type="warning"
          showIcon
          message={duplicateMessage("meta title", titleDuplicate)}
          style={{ marginTop: -20, marginBottom: 16 }}
        />
      )}

      <Form.Item name="metaDescription" label="Meta Description">
        <Input.TextArea rows={3} showCount maxLength={1000} />
      </Form.Item>
      {descriptionDuplicate && (
        <Alert
          type="warning"
          showIcon
          message={duplicateMessage("meta description", descriptionDuplicate)}
          style={{ marginTop: -20, marginBottom: 16 }}
        />
      )}

      <Form.Item name="keywords" label="Keywords">
        <Input placeholder="comma separated" showCount maxLength={100} />
      </Form.Item>

      <Form.Item
        name="canonicalUrl"
        label="Canonical URL"
        extra="Optional. Leave empty to use the frontend's automatic canonical URL."
        rules={[{ validator: validateCanonicalUrl }]}
      >
        <Input placeholder="https://example.com/page or /page" />
      </Form.Item>

      {metadataQuery.isError && (
        <Alert
          type="info"
          showIcon
          message="Duplicate metadata check is unavailable right now."
        />
      )}
    </>
  );
}
