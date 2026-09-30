function List({ title, items, icon, iconClass }) {
  return (
    <div>
      <h3 className="mb-3 text-lg">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden="true" className={`font-bold ${iconClass}`}>{icon}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TripIncludes({ includes, excludes }) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <List title="Cost Includes" items={includes} icon="✓" iconClass="text-emerald-600" />
      <List title="Cost Excludes" items={excludes} icon="✕" iconClass="text-rose-600" />
    </div>
  );
}
