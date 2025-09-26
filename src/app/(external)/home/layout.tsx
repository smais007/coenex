import { Navbar } from "../_components/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <main className="xs:pt-20 pt-16 sm:pt-24">{children}</main>
    </div>
  );
}
