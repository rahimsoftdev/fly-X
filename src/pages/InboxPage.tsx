import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, MessageSquareText, Search, Send, X } from "lucide-react";

/* ---------------- Types ---------------- */
interface Message {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
  read?: boolean;
}

interface Conversation {
  id: string;
  name: string;
  color: string; // avatar gradient (photo না থাকলে)
  avatar?: string; // optional profile photo URL
  online: boolean;
  time: string;
  unread: number;
  messages: Message[];
}

/* ---------------- Fake Data ---------------- */
const COLORS = [
  "from-blue-500 to-indigo-600",
  "from-pink-500 to-rose-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-purple-500 to-fuchsia-600",
  "from-sky-500 to-cyan-600",
];

const sarahMessages = (): Message[] => [
  {
    id: "s1",
    from: "them",
    text: "The contract has been signed by all parties. We can move forward now.",
    time: "10:12",
  },
  {
    id: "s2",
    from: "me",
    text: "That's great news! I'll prepare the next steps.",
    time: "10:20",
    read: true,
  },
];

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    name: "Elena Rossi",
    color: COLORS[1]!,
    online: true,
    time: "14:22",
    unread: 1,
    messages: [
      {
        id: "e1",
        from: "them",
        text: "Good morning, I want to book a flight manually, Can you help me with that?",
        time: "11:04",
      },
      {
        id: "e2",
        from: "me",
        text: "Good morning.\nYes, Surely I can help you with that. Can you tell me more about that?",
        time: "11:15",
        read: true,
      },
      {
        id: "e3",
        from: "them",
        text: "I want to book a flight from NYC to DAC, but I am unable to find it, can you find it for me?",
        time: "14:22",
      },
    ],
  },
  {
    id: "2",
    name: "Marcus Webb",
    color: COLORS[0]!,
    online: false,
    time: "Yest.",
    unread: 0,
    messages: [
      {
        id: "m1",
        from: "them",
        text: "Can we schedule the flight visit for next week?",
        time: "Yesterday",
      },
    ],
  },
  ...[
    "Sarah Jenkins",
    "David Carter",
    "Amina Rahman",
    "Liam Foster",
    "Priya Sharma",
    "Noah Bennett",
    "Sofia Marino",
    "Omar Hassan",
    "Emily Clarke",
    "Daniel Kim",
    "Olivia Brown",
    "Ethan Walker",
  ].map(
    (name, i): Conversation => ({
      id: String(i + 3),
      name,
      color: COLORS[(i + 2) % COLORS.length]!,
      online: i % 4 === 0,
      time: "Oct 12",
      unread: i % 5 === 0 ? 2 : 0,
      messages: sarahMessages(),
    })
  ),
];

/* ---------------- Helpers ---------------- */
const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const nowTime = () =>
  new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

// sidebar এ last message preview ("You: " prefix সহ)
const lastPreview = (c: Conversation) => {
  const last = c.messages[c.messages.length - 1];
  if (!last) return "";
  const text = last.text.replace(/\n/g, " ");
  return last.from === "me" ? `You: ${text}` : text;
};

// scroll চলবে, কিন্তু scroll bar দেখা যাবে না
const noScrollbar =
  "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

/* ---------------- Avatar ---------------- */
function Avatar({
  name,
  color,
  src,
  online,
  size = "md",
}: {
  name: string;
  color: string;
  src?: string;
  online?: boolean;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "h-7 w-7 text-[10px]" : "h-10 w-10 text-xs";
  return (
    <div className="relative shrink-0">
      {src ? (
        <img
          src={src}
          alt={name}
          className={`rounded-lg object-cover ${dim}`}
        />
      ) : (
        <div
          className={`flex items-center justify-center rounded-lg bg-gradient-to-br font-semibold text-white ${color} ${dim}`}
        >
          {initials(name)}
        </div>
      )}
      {online && (
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500 dark:border-slate-900" />
      )}
    </div>
  );
}

/* ---------------- Page ---------------- */
export default function InboxPage() {
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeId, setActiveId] = useState(INITIAL_CONVERSATIONS[0]!.id);
  const [showChat, setShowChat] = useState(false); // শুধু mobile এর জন্য
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const firstScroll = useRef(true);

  const active = conversations.find((c) => c.id === activeId);

  const totalUnread = useMemo(
    () => conversations.reduce((sum, c) => sum + c.unread, 0),
    [conversations]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        lastPreview(c).toLowerCase().includes(q)
    );
  }, [conversations, query]);

  // নতুন message বা conversation বদলালে নিচে scroll (প্রথমবার instantly)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: firstScroll.current ? "auto" : "smooth",
    });
    firstScroll.current = false;
  }, [active?.messages.length, activeId, showChat]);

  // এখন যে conversation খোলা, সেটার unread সবসময় 0 রাখো
  useEffect(() => {
    setConversations((prev) =>
      prev.some((c) => c.id === activeId && c.unread > 0)
        ? prev.map((c) => (c.id === activeId ? { ...c, unread: 0 } : c))
        : prev
    );
  }, [activeId]);

  const openConversation = (id: string) => {
    setActiveId(id);
    setShowChat(true);
    // desktop এ সাথে সাথে টাইপ করা শুরু করা যাবে
    if (window.matchMedia("(min-width: 768px)").matches) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !active) return;

    const time = nowTime();
    setConversations((prev) => {
      const updated = prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              time,
              messages: [
                ...c.messages,
                { id: crypto.randomUUID(), from: "me" as const, text, time, read: false },
              ],
            }
          : c
      );
      // যার সাথে কথা বললে সে list এর একদম উপরে চলে যাবে
      const current = updated.find((c) => c.id === activeId)!;
      return [current, ...updated.filter((c) => c.id !== activeId)];
    });
    setDraft("");
    inputRef.current?.focus();
  };

  return (
    // StaffLayout/UserLayout এর main এ py-10 (মোট 5rem) আছে, সেটা বাদ দিয়ে উচ্চতা
    // -mx-6 -my-10 দিয়ে layout এর padding cancel করা হয়েছে, তাই চারদিকে কোনো gap নেই
    <div className="-mx-6 -my-10 flex h-dvh min-h-0 overflow-hidden bg-white text-gray-900 dark:bg-slate-900 dark:text-gray-50">
      {/* ============ Sidebar ============ */}
      <aside
        className={`${
          showChat ? "hidden md:flex" : "flex"
        } min-h-0 w-full shrink-0 flex-col border-r border-gray-200 bg-slate-50 md:w-60 lg:w-64 dark:border-slate-700 dark:bg-slate-900`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-4 dark:border-slate-700">
          <h1 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
            Inboxes
          </h1>
          {totalUnread > 0 && (
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              {totalUnread} new
            </span>
          )}
        </div>

        <div className="shrink-0 p-3">
          <div className="flex items-center gap-2 rounded-lg border border-transparent bg-slate-100 px-3 py-2 focus-within:border-blue-500 focus-within:bg-white dark:bg-slate-800">
            <Search size={14} className="shrink-0 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search conversations"
              className="w-full bg-transparent text-xs outline-none placeholder:text-gray-400"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <ul className={`min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2 pb-3 ${noScrollbar}`}>
          {filtered.length === 0 && (
            <li className="px-3 py-10 text-center text-xs text-gray-500 dark:text-slate-400">
              No conversations found
            </li>
          )}

          {filtered.map((c) => {
            const isActive = c.id === activeId;
            const hasUnread = c.unread > 0;
            return (
              <li key={c.id}>
                <button
                  onClick={() => openConversation(c.id)}
                  className={`flex w-full items-center gap-2.5 rounded-lg border-l-4 px-2.5 py-2.5 text-left transition ${
                    isActive
                      ? "border-blue-600 bg-white shadow-sm dark:bg-slate-800"
                      : "border-transparent hover:bg-gray-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <Avatar name={c.name} color={c.color} src={c.avatar} online={c.online} />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`truncate text-[13px] ${
                          hasUnread ? "font-bold" : "font-semibold"
                        }`}
                      >
                        {c.name}
                      </p>
                      <span
                        className={`shrink-0 text-[10px] ${
                          hasUnread
                            ? "font-semibold text-blue-600 dark:text-blue-400"
                            : "text-gray-400 dark:text-slate-500"
                        }`}
                      >
                        {c.time}
                      </span>
                    </div>

                    <div className="mt-0.5 flex items-center justify-between gap-2">
                      <p
                        className={`truncate text-[11px] ${
                          hasUnread
                            ? "font-medium text-gray-800 dark:text-slate-200"
                            : "text-gray-500 dark:text-slate-400"
                        }`}
                      >
                        {lastPreview(c)}
                      </p>
                      {hasUnread && (
                        <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-semibold text-white">
                          {c.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* ============ Chat ============ */}
      <section
        className={`${
          showChat ? "flex" : "hidden md:flex"
        } min-h-0 min-w-0 flex-1 flex-col bg-white dark:bg-slate-900`}
      >
        {active ? (
          <>
            {/* Header */}
            <header className="flex h-16 shrink-0 items-center gap-3 border-b border-gray-200 px-3 sm:px-5 dark:border-slate-700">
              <button
                onClick={() => setShowChat(false)}
                aria-label="Back to inbox"
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <ArrowLeft size={18} />
              </button>

              <Avatar name={active.name} color={active.color} src={active.avatar} online={active.online} />

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {active.name}
                </p>
                <p className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:text-slate-400">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      active.online ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                  {active.online ? "Active now" : "Offline"}
                </p>
              </div>
            </header>

            {/* Messages */}
            <div className={`min-h-0 flex-1 space-y-5 overflow-y-auto px-3 py-5 sm:px-6 ${noScrollbar}`}>
              <div className="flex justify-center">
                <span className="rounded-full border border-gray-200 bg-white px-4 py-1 text-[10px] font-medium uppercase tracking-widest text-gray-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                  Today
                </span>
              </div>

              {active.messages.map((m) =>
                m.from === "them" ? (
                  <div key={m.id} className="flex max-w-[88%] items-end gap-2 sm:max-w-[75%]">
                    <Avatar name={active.name} color={active.color} src={active.avatar} size="sm" />
                    <div>
                      <div className="whitespace-pre-line break-words rounded-2xl rounded-bl-sm border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        {m.text}
                      </div>
                      <p className="mt-1 text-[10px] text-gray-400 dark:text-slate-500">
                        {m.time}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div key={m.id} className="ml-auto flex max-w-[88%] flex-col items-end sm:max-w-[75%]">
                    <div className="whitespace-pre-line break-words rounded-2xl rounded-br-sm bg-blue-600 px-4 py-2.5 text-sm text-white shadow-sm">
                      {m.text}
                    </div>
                    <p className="mt-1 text-[10px] text-gray-400 dark:text-slate-500">
                      {m.time} · {m.read ? "Read" : "Sent"}
                    </p>
                  </div>
                )
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSend}
              className="shrink-0 border-t border-gray-200 p-3 sm:p-4 dark:border-slate-700"
            >
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm focus-within:border-blue-500 dark:border-slate-700 dark:bg-slate-800">
                <input
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type your message here..."
                  className="min-w-0 flex-1 bg-transparent py-1.5 text-sm outline-none placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  aria-label="Send message"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-sm text-gray-500 dark:text-slate-400">
            <MessageSquareText size={32} className="text-gray-300 dark:text-slate-600" />
            Select a conversation
          </div>
        )}
      </section>
    </div>
  );
}