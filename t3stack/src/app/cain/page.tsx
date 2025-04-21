'use client';

import { api } from '@/trpc/react';
import { useState } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const greetMutation = api.cain.great_cain.useQuery(
    { name },
    { enabled: false }, // Only run the query if name is not empty
  );

  return (
    <div className="p-4">
      <form
        onSubmit={ async (e) => {
          e.preventDefault();
          await greetMutation.refetch();
        }}
      >
        <input
          className="border p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
        />
        <button className="ml-2 bg-blue-500 text-white px-4 py-2" type="submit">
          Greet
        </button>
      </form>

      {greetMutation.data && (
        <p className="mt-4 text-green-600">{(greetMutation.data.message as string)}</p>
      )}
    </div>
  );
}
