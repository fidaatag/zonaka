"use client";

import React from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { createActor } from "@/lib/icp/actor";
import type { Identity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";


interface CardListQueueProps {
  principal?: string
  identity?: Identity
}

const CardListQueue: React.FC<CardListQueueProps> = ({ principal, identity }) => {
  const { data, isLoading, isError } = api.cain.getAllQueuesByParent.useQuery();

  const handelSubmitToCain = async () => {

    const actor = await createActor("student", identity)

    const resumes = (data?.queue ?? []).map((item: any) => {
      const payload = item.payload;

      return {
        studentId: item.student.id,
        createdBy: Principal.fromText(principal!),
        owner: Principal.fromText(principal!),
        transferableAt: BigInt(Date.now()) * 1_000_000n, // ✅ Pakai BigInt literal

        parent: payload.parent,
        student: payload.student,

        grades: (payload.grades ?? []).map((g: any) => ({
          schoolId: g.schoolId,
          schoolName: g.schoolName,
          educationLevel: g.educationLevel,
          isCurrent: g.isCurrent,
          entryYear: g.entryYear ?? 0,
          academicRecords: (g.academicRecords ?? []).map((r: any) => ({
            gradeId: r.gradeId,
            semester: r.semester ?? 0,
            year: r.year ?? 0,
            gradeLevel: r.gradeLevel ?? 0,
            total: Number(r.total ?? 0), // ✅ ← perbaikan disini!
            average: r.average,
            subjects: r.subjects,
          })),
        })),

        targets: (payload.targets ?? []).map((t: any) => ({
          educationLevel: t.educationLevel,
          nextTargetJenjang: t.nextTargetJenjang,
          schools: (t.schools ?? []).map((s: any) => ({
            schoolId: s.schoolId,
            schoolName: s.schoolName,
            address: s.address,
            targetId: s.targetId ?? "", // fallback
          })),
        })),

      };
    });

    console.log("Resumes payload:", resumes);

    try {
      const result = await actor.submitMultipleResumes(resumes);
      console.log("✅ Hasil push:", result);
      alert("Berhasil submit ke Cain!");
    } catch (err) {
      console.error("❌ Gagal submit ke Cain:", err);
      const errorMessage = err instanceof Error ? err.message : JSON.stringify(err);
      alert("Gagal push ke Cain!\n" + errorMessage);
    }

  }


  if (isLoading) {
    return <div className="p-4 text-sm text-gray-500">Loading queue data...</div>;
  }

  if (isError || !data?.success) {
    return <div className="p-4 text-sm text-red-500">Error fetching queue data.</div>;
  }

  const queues = data.queue ?? [];

  return (
    <div className="p-4 bg-white shadow rounded-md space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Queue List ({queues.length})</h2>
        <Button variant="default" onClick={handelSubmitToCain}>
          Push to Chain
        </Button>
      </div>

      {queues.length === 0 ? (
        <p className="text-gray-500 text-sm">No queues available.</p>
      ) : (
        <ul className="space-y-2">
          {queues.map((queueItem) => (
            <li key={queueItem.id} className="p-3 border rounded-md shadow-sm">
              <div>
                <span className="font-medium">Student Name:</span>{" "}
                {queueItem.student?.name ?? "-"}
              </div>
              <div>
                <span className="font-medium">Queue Created At:</span>{" "}
                {new Date(queueItem.createdAt).toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CardListQueue;
