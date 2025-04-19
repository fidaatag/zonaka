import { Button } from "@/components/ui/button";
import { HydrateClient } from "@/trpc/server";

export default async function Home() {

  return (
    <HydrateClient>
      <div>
        "Hello world!"
      </div>
      <Button>Ok button</Button>
    </HydrateClient>
  );
}
