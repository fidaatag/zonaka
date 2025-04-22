import CardCountingBoard from "@/components/card-counting-board";
import { DialogTamabahAnak } from "@/components/dialog-tambah-anak";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/server/auth/config";
import { Dialog } from "@radix-ui/react-dialog";
import { Users } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function PageBoard() {

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }


  return (
    <div className="">


      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div className="flex flex-col">
          <h2 className="text-3xl font-semibold tracking-tight">
            Selamat Datang, Nama User
          </h2>
          <p className="text-lg font-light">
            The king, seeing how much happier his subjects were, realized the error of
            his ways and repealed the joke tax.
          </p>
        </div>

        <DialogTamabahAnak />

      </section>


      <section className="grid gap-4 grid-cols-2 lg:grid-cols-4 mt-9">

        <CardCountingBoard
          title="Total Anak Terdata"
          value={12}
          icon={<Users className="h-4 w-4" />}
          description="Jumlah anak yang dibuat atau ditambahkan oleh parent (masih aktif atau pun sudah lulus)"
        />

        <CardCountingBoard
          title="Total Sekolah Terhubung"
          value={12}
          icon={<Users className="h-4 w-4" />}
          description="Jumlah semua sekolah yang berkah dikaitkan dengan anak"
        />

        <CardCountingBoard
          title="Dokumen Akademik"
          value={12}
          icon={<Users className="h-4 w-4" />}
          description="Jumlah semua dokumen yang tersimpan di sistem *tanpa terkecuali"
        />

        <CardCountingBoard
          title="Patner Pendidikan Aktif"
          value={12}
          icon={<Users className="h-4 w-4" />}
          description="Jumlah partner pendidikan yang sudah dikaitkan dengan akun parent atau anak (misalnya transportasi anak, kursus yang pernah diikuti)"
        />

      </section>


    </div>
  );
}