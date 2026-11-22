import { ArrowRight, FileText, Settings } from "lucide-react";
import { Link } from "react-router";

interface Props {
  preferencesPath: string;
  customRequestPath: string;
}

export default function QuickActions({
  preferencesPath,
  customRequestPath,
}: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="grid gap-4 md:grid-cols-2">
        <Link
          to={preferencesPath}
          className="flex items-center gap-4 rounded-lg bg-blue-600 px-4 py-4 text-white transition hover:bg-blue-700"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20">
            <Settings size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Adjust Travel Preferences</p>
            <p className="text-[11px] text-white/80">
              Update your dates, destinations &amp; preferences
            </p>
          </div>
          <ArrowRight size={18} className="shrink-0" />
        </Link>

        <Link
          to={customRequestPath}
          className="flex items-center gap-4 rounded-lg bg-gray-100 px-4 py-4 transition hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-slate-600 dark:text-blue-300">
            <FileText size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-blue-600 dark:text-blue-300">
              Submit Custom Travel Request
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-300">
              Request a specific trip for concierge review
            </p>
          </div>
          <ArrowRight
            size={18}
            className="shrink-0 text-blue-600 dark:text-blue-300"
          />
        </Link>
      </div>
    </div>
  );
}