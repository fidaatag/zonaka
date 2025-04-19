import { HeroCanvas } from "@/components/hero/hero-canvas";
import { NavbarMain } from "@/components/navbar-main";
import { HydrateClient } from "@/trpc/server";

export default async function Home() {

  return (
    <HydrateClient>
      <NavbarMain />
      <HeroCanvas />
    </HydrateClient>
  );
}
