import { authOptions } from "@/server/auth/config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function PageBoard() {

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }


  return (
    <div>
      <h1>Hello, World!</h1>
    </div>
  );
}