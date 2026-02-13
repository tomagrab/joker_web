type AppFooterProps = Readonly<{
  appCompany?: string;
  appCompanyStartYear?: number;
}>;

export default function AppFooter({
  appCompany = "My Company",
  appCompanyStartYear = 2024,
}: AppFooterProps) {
  return (
    <footer className="w-full shrink-0 border-t px-4 py-2 text-center text-sm text-gray-500">
      © {appCompanyStartYear} - {new Date().getFullYear()} {appCompany}. All
      rights reserved.
    </footer>
  );
}
