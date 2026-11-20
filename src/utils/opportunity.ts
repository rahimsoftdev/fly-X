export const getTimeOfDay = (iso: string) => {
  const hour = new Date(iso).getHours();
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
};

export const getSeatInfo = (total: number, booked: number) => {
  const available = Math.max(total - booked, 0);
  const bookedPercent = total > 0 ? Math.round((booked / total) * 100) : 0;
  // ৩০% বা কম সিট বাকি থাকলে "Filling Fast"
  const isFillingFast = available > 0 && available / total <= 0.3;

  return { available, bookedPercent, isFillingFast };
};