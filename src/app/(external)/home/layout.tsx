import { Navbar } from "../_components/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <main className="xs:pt-20 container mx-auto px-4 pt-16 sm:px-6 sm:pt-24 lg:px-8">{children}</main>
    </div>
  );
}
