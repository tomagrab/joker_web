import DynamicBreadcrumbs from "@/components/modules/dynamic/breadcrumbs/dynamic-breadcrumbs";

export default function SettingsPage() {
  return (
    <div>
      <h2>Settings Page</h2>

      <DynamicBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Settings", href: "/tools/settings" },
        ]}
        showParentButton={true}
      />
    </div>
  );
}
