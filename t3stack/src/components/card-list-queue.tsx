"use client";

import React from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";

const CardListQueue: React.FC = () => {
  const { data, isLoading, isError } = api.cain.getAllQueuesByParent.useQuery();

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
        <Button variant="default">Push to Chain</Button>
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
