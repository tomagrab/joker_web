import ModeToggle from "@/components/modules/mode/mode-toggle/mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";

type AppHeaderProps = Readonly<{
  appHeader?: string;
}>;

export default function AppHeader({
  appHeader = "App Header",
}: AppHeaderProps) {
  return (
    <header className="flex shrink-0 flex-row items-center justify-between border-b p-4">
      <div className="flex flex-row">
        <SidebarTrigger />
      </div>
      <div className="flex flex-row">
        <h1>{appHeader}</h1>
      </div>
      <div className="flex flex-row">
        <ModeToggle />
      </div>
    </header>
  );
}
