const DirectionBadge = ({
  origin,
  destination,
}: {
  origin: string;
  destination: string;
}) => (
  <span className="inline-block whitespace-nowrap rounded-full bg-secondary px-3 py-1 text-[11px] font-medium text-white">
    {origin} → {destination}
  </span>
);

export default DirectionBadge;