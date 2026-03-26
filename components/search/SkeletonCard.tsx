"use client";

export function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-[#f3f4f6]" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-24 rounded bg-[#f3f4f6]" />
          <div className="h-3 w-16 rounded bg-[#f3f4f6]" />
        </div>
        <div className="hidden flex-1 items-center justify-center md:flex">
          <div className="space-y-2 text-center">
            <div className="mx-auto h-3 w-12 rounded bg-[#f3f4f6]" />
            <div className="mx-auto h-px w-32 bg-[#f3f4f6]" />
            <div className="mx-auto h-3 w-16 rounded bg-[#f3f4f6]" />
          </div>
        </div>
        <div className="hidden flex-1 md:block">
          <div className="space-y-2">
            <div className="h-4 w-16 rounded bg-[#f3f4f6]" />
            <div className="h-3 w-10 rounded bg-[#f3f4f6]" />
          </div>
        </div>
        <div className="space-y-2 text-right">
          <div className="ml-auto h-3 w-14 rounded bg-[#f3f4f6]" />
          <div className="ml-auto h-5 w-20 rounded bg-[#f3f4f6]" />
          <div className="ml-auto h-7 w-24 rounded-full bg-[#f3f4f6]" />
        </div>
      </div>
    </div>
  );
}
