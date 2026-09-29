// Uses native <details> so every day's text is in the HTML (good for SEO) and works without JavaScript
export default function TripItinerary({ itinerary }) {
  return (
    <ol className="space-y-3">
      {itinerary.map((day, index) => (
        <li key={day.day}>
          <details open={index === 0} className="group rounded-xl border border-slate-200 bg-white open:shadow-sm">
            <summary className="flex cursor-pointer list-none items-center gap-4 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">
                {day.day}
              </span>
              <h3 className="flex-1 text-base">
                <span className="sr-only">Day {day.day}: </span>
                {day.title}
              </h3>
              <span aria-hidden="true" className="text-muted transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="px-4 pb-4 pl-18 text-muted">{day.description}</p>
          </details>
        </li>
      ))}
    </ol>
  );
}
