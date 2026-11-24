// Sob rong index.css-er CSS variable theke ashche (--background, --card, --border-color ...)
// .dark class boshle variable gulo nijei bodle jay, tai alada dark: lekhar dorkar nai.

export const labelClass =
  "mb-1.5 block text-xs font-medium text-(--heading-text)";

// text color ekhane nai, karon select/date e placeholder color alada lage
export const inputBase =
  "h-10 w-full rounded-md border border-(--border-color) bg-(--background) px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60";

export const inputClass = `${inputBase} text-(--heading-text)`;

export const addButtonClass =
  "flex w-full items-center cursor-pointer justify-center gap-2 rounded-lg border border-(--border-color) bg-(--card) py-2.5 text-sm font-medium text-(--heading-text) transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-white/5";

export const errorTextClass = "text-sm text-red-600 dark:text-red-400";