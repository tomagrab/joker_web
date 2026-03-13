import DynamicBreadcrumbs from "@/components/modules/dynamic/breadcrumbs/dynamic-breadcrumbs";

export default function ToolsPage() {
  return (
    <div>
      <h2>Tools Page</h2>

      <DynamicBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
        ]}
        showParentButton={false}
      />
    </div>
  );
}
