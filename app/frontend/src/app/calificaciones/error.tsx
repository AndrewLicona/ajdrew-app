'use client'; 

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void; }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h2 className="text-2xl font-bold">¡Algo salió mal!</h2>
      <p>{error.message}</p>
      <button
        onClick={() => reset()} // Attempt to recover by trying to re-render the segment
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Intentar de nuevo
      </button>
    </main>
  );
}
