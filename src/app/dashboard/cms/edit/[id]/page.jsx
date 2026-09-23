import CMSFormPage from "@/modules/cms/pages/CMSFormPage";

export default async function Page({ params }) {
  const { id } = await params;

  return <CMSFormPage id={id} />;
}
