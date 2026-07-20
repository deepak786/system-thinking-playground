/** Quiet museum header — brand first, one clear question. */
export function ExhibitHeader() {
  return (
    <header className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        Interactive exhibit
      </p>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
        Spatial Indexing Playground
      </h1>
      <p className="max-w-2xl text-sm leading-relaxed text-slate-400">
        Finding nearby places without searching the entire city.
      </p>
    </header>
  )
}
