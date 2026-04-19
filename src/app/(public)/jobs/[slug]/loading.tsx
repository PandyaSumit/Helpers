export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 h-5 w-28 rounded-lg bg-neutral-200" />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-52 rounded-2xl bg-neutral-100" />
          <div className="h-36 rounded-2xl bg-neutral-100" />
          <div className="h-44 rounded-2xl bg-neutral-100" />
          <div className="h-44 rounded-2xl bg-neutral-100" />
        </div>
        <div className="h-72 rounded-2xl bg-neutral-100" />
      </div>
    </div>
  );
}
