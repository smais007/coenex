import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import { LayoutControls } from "@/app/(main)/dashboard/_components/sidebar/layout-controls";
import { ThemeSwitcher } from "@/app/(main)/dashboard/_components/sidebar/theme-switcher";
import {
  CONTENT_LAYOUT_VALUES,
  ContentLayout,
  NAVBAR_STYLE_VALUES,
  NavbarStyle,
  SIDEBAR_COLLAPSIBLE_VALUES,
  SIDEBAR_VARIANT_VALUES,
  SidebarCollapsible,
  SidebarVariant,
} from "@/types/preferences/layout";
import { getPreference } from "@/server/server-actions";

const Navbar = async () => {
  const [sidebarVariant, sidebarCollapsible, contentLayout, navbarStyle] = await Promise.all([
    getPreference<SidebarVariant>("sidebar_variant", SIDEBAR_VARIANT_VALUES, "inset"),
    getPreference<SidebarCollapsible>("sidebar_collapsible", SIDEBAR_COLLAPSIBLE_VALUES, "icon"),
    getPreference<ContentLayout>("content_layout", CONTENT_LAYOUT_VALUES, "centered"),
    getPreference<NavbarStyle>("navbar_style", NAVBAR_STYLE_VALUES, "scroll"),
  ]);

  const layoutPreferences = {
    contentLayout,
    variant: sidebarVariant,
    collapsible: sidebarCollapsible,
    navbarStyle,
  };
  return (
    <nav className="xs:h-16 bg-background/50 fixed inset-x-4 top-6 z-10 mx-auto h-14 max-w-screen-xl rounded-full border backdrop-blur-sm dark:border-slate-700/70">
      <div className="mx-auto flex h-full items-center justify-between px-4">
        <Logo />

        {/* Desktop Menu */}
        <NavMenu className="hidden md:block" />

        <div className="flex items-center gap-3">
          {/* <ThemeToggle /> */}
          <LayoutControls {...layoutPreferences} />
          <ThemeSwitcher />
          <Button variant="outline" className="hidden sm:inline-flex">
            Sign In
          </Button>
          <Button className="xs:inline-flex hidden">Get Started</Button>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
