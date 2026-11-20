"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (<main className="mx-auto max-w-xl px-5 py-24"><h1 className="text-4xl">Something went wrong</h1>
    <p className="mt-4 text-moss">Please try again. If the problem continues, contact the clinic by phone or WhatsApp.</p>
    <button onClick={reset} className="btn btn-primary mt-8">Try again</button></main>);
}
