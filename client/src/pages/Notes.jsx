import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  LogOut,
  Share2,
  Archive,
  Tags,
  Folder,
  Clock3,
  Sparkles,
  StickyNote,
  DeleteIcon,
  LucideDelete,
  Delete,
  WandSparkles,
  Loader2,
} from "lucide-react";
import { Trash2 } from "lucide-react";

function NoteList({
  notes,
  onSelect,
  onNew,
  selectedId,
  onDelete,
  onInsights,
}) {
  return (
    <div className="bg-[#fff8f7] border border-[#eadede] rounded-[32px] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-2xl font-black text-[#2d2926]">Notes</h2>
          <p className="text-sm text-[#6d6762]">Your calm workspace</p>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={onNew}
          className="w-12 h-12 rounded-full bg-[#d7e6d2] flex items-center justify-center"
        >
          <Plus className="text-[#2d2926]" size={22} />
        </motion.button>
      </div>

      <div className="space-y-3 max-h-[65vh] overflow-auto pr-1">
        <AnimatePresence>
          {notes.map((n) => (
            <motion.div
              key={n._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              onClick={() => onSelect(n)}
              className={`cursor-pointer rounded-[24px] p-4 transition-all border ${
                selectedId === n._id
                  ? "bg-[#d9d2f0] border-[#cfc3ef]"
                  : "bg-[#fff] border-[#efe5e3]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-[#2d2926] line-clamp-1">
                    {n.title || ""}
                  </h3>

                  <p className="text-sm text-[#756f69] mt-1 line-clamp-2">
                    {n.content || "Empty note..."}
                  </p>
                </div>

                <div><StickyNote
                  size={18}
                  className="text-[#756f69] shrink-0"
                />

                <Delete size={18} onClick={(e) => {
        e.stopPropagation();
        onDelete(n);
      }}
                  className="text-[#756f69] shrink-0"/></div>
              </div>

              {!!n.tags?.length && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {n.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1 rounded-full bg-[#f4e9e8] text-[#5f5954]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// INSIDE Editor COMPONENT
function Editor({ note, onChange, onArchive, onShare }) {
  const [local, setLocal] = useState(note || {});
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");

  const timer = useRef();

  useEffect(() => {
    setLocal(note || {});
    setAiResult("");
  }, [note]);

  useEffect(() => {
    if (!note) return;

    clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      onChange(local);
    }, 800);

    return () => clearTimeout(timer.current);
  }, [local]);

  // AI FUNCTION
  const runAI = async (type) => {
    try {
      setAiLoading(true);

      const res = await fetch(
        `https://peblo-assginmentbackend.onrender.com/api/notes/${note._id}/ai`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type }),
        }
      );

      const data = await res.json();

      setAiResult(data.result);

      // AUTO UPDATE TITLE
      if (type === "title") {
        setLocal((prev) => ({
          ...prev,
          title: data.result,
        }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setAiLoading(false);
    }
  };

  if (!note) {
    return (
      <div className="flex-1 bg-[#fff8f7] border border-[#eadede] rounded-[36px] flex flex-col items-center justify-center text-center p-10">
        <div className="w-24 h-24 rounded-full bg-[#d7e6d2] flex items-center justify-center mb-6">
          <Sparkles className="text-[#2d2926]" size={34} />
        </div>

        <h2 className="text-3xl font-black text-[#2d2926]">
          Select a note
        </h2>

        <p className="text-[#6d6762] mt-3 max-w-sm">
          Open a note from the left panel or create a fresh one
          to start writing.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 bg-[#fff8f7] border border-[#eadede] rounded-[36px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] overflow-auto"
    >
      {/* HEADER */}
      <div className="flex justify-between gap-4 mb-6">
        <input
          className="text-4xl font-black w-full bg-transparent outline-none text-[#2d2926] placeholder:text-[#a8a19c]"
          value={local.title || ""}
          placeholder="Untitled note"
          onChange={(e) =>
            setLocal({
              ...local,
              title: e.target.value,
            })
          }
        />

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onShare(note)}
            className="h-12 px-5 rounded-2xl bg-[#d7e6d2] text-[#2d2926] flex items-center gap-2"
          >
            <Share2 size={18} />
            Share
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onArchive(note)}
            className="h-12 px-5 rounded-2xl bg-[#f1dfb7] text-[#2d2926] flex items-center gap-2"
          >
            <Archive size={18} />
            Archive
          </motion.button>
        </div>
      </div>

      {/* CONTENT */}
      <textarea
        className="w-full h-[420px] resize-none rounded-[28px] border border-[#efe5e3] bg-[#fff] p-6 outline-none text-[#3d3834] leading-8 text-lg"
        value={local.content || ""}
        placeholder="Write your thoughts here..."
        onChange={(e) =>
          setLocal({
            ...local,
            content: e.target.value,
          })
        }
      />

      {/* TAGS */}
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="relative">
          <Tags
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7d7771]"
            size={18}
          />

          <input
            placeholder="Tags"
            className="w-full pl-12 p-4 rounded-2xl border border-[#efe5e3] bg-[#fff]"
            value={(local.tags || []).join(", ")}
            onChange={(e) =>
              setLocal({
                ...local,
                tags: e.target.value
                  .split(",")
                  .map((s) => s.trim()),
              })
            }
          />
        </div>

        <div className="relative">
          <Folder
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7d7771]"
            size={18}
          />

          <input
            placeholder="Category"
            className="w-full pl-12 p-4 rounded-2xl border border-[#efe5e3] bg-[#fff]"
            value={local.category || ""}
            onChange={(e) =>
              setLocal({
                ...local,
                category: e.target.value,
              })
            }
          />
        </div>
      </div>

      {/* AI SECTION */}
      <div className="mt-8 bg-[#f4e9e8] rounded-[28px] p-6 border border-[#eadede]">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-full bg-[#d7e6d2] flex items-center justify-center">
            <WandSparkles
              className="text-[#2d2926]"
              size={20}
            />
          </div>

          <div>
            <h3 className="font-black text-[#2d2926] text-lg">
              AI Assistant
            </h3>

            <p className="text-sm text-[#6d6762]">
              Smart note enhancement
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => runAI("summary")}
            className="px-5 py-3 rounded-2xl bg-[#d7e6d2] text-[#2d2926] font-medium"
          >
            Generate Summary
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => runAI("actions")}
            className="px-5 py-3 rounded-2xl bg-[#d9d2f0] text-[#2d2926] font-medium"
          >
            Extract Actions
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => runAI("title")}
            className="px-5 py-3 rounded-2xl bg-[#f1dfb7] text-[#2d2926] font-medium"
          >
            Suggest Title
          </motion.button>
        </div>

        {aiLoading && (
          <div className="flex items-center gap-2 mt-5 text-[#5f5954]">
            <Loader2 className="animate-spin" size={18} />
            AI is thinking...
          </div>
        )}

        {aiResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-white rounded-[24px] p-6 whitespace-pre-wrap text-[#3d3834] leading-8 border border-[#efe5e3]"
          >
            {aiResult}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default function Notes({ user, onLogout }) {
  const [notes, setNotes] = useState([]);
  const [current, setCurrent] = useState(null);
  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [sort, setSort] = useState("recent");

  const fetchNotes = async () => {
    const params = new URLSearchParams();

    if (query) params.set("q", query);
    if (tagFilter) params.set("tags", tagFilter);
    if (sort) params.set("sort", sort);

    const res = await fetch(
      `https://peblo-assginmentbackend.onrender.com/api/notes?${params.toString()}`,
      { credentials: "include" }
    );

    const data = await res.json();

    setNotes(data.notes || []);

    if (!current && data.notes?.length) {
      setCurrent(data.notes[0]);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [query, tagFilter, sort]);

  const createNew = async () => {
    const res = await fetch("https://peblo-assginmentbackend.onrender.com/api/notes", {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Untitled" }),
    });

    const data = await res.json();

    setNotes((n) => [data.note, ...n]);
    setCurrent(data.note);
  };

  const updateNote = async (note) => {
    if (!note._id) return;

    await fetch(`https://peblo-assginmentbackend.onrender.com/api/notes/${note._id}`, {
      credentials: "include",
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    });

    setNotes((n) =>
      n.map((x) => (x._id === note._id ? note : x))
    );
  };

  const archive = async (note) => {
    await fetch(
      `https://peblo-assginmentbackend.onrender.com/api/notes/${note._id}/archive`,
      {
        credentials: "include",
        method: "POST",
      }
    );

    setNotes((n) =>
      n.map((x) =>
        x._id === note._id ? { ...x, archived: true } : x
      )
    );

    setCurrent(null);
  };

  const share = async (note) => {
    const res = await fetch(
      `https://peblo-assginmentbackend.onrender.com/api/notes/${note._id}/share`,
      {
        credentials: "include",
        method: "POST",
      }
    );

    const data = await res.json();

    const url = `${window.location.origin}/public/${data.publicId}`;

    prompt("Public link (copy):", url);
  };

  const logout = async () => {
    await fetch("https://peblo-assginmentbackend.onrender.com/auth/logout", {
      credentials: "include",
      method: "POST",
    });

    onLogout();
  };
  const deleteNote = async (note) => {
  const confirmDelete = confirm(
    `Delete "${note.title}" ?`
  );

  if (!confirmDelete) return;

  await fetch(
    `https://peblo-assginmentbackend.onrender.com/api/notes/${note._id}`,
    {
      credentials: "include",
      method: "DELETE",
    }
  );

  setNotes((prev) =>
    prev.filter((x) => x._id !== note._id)
  );

  if (current?._id === note._id) {
    setCurrent(null);
  }
};

const showInsights = async () => {
  const res = await fetch(
    "https://peblo-assginmentbackend.onrender.com/api/notes/insights",
    {
      credentials: "include",
    }
  );

  const data = await res.json();

  alert(`
Total Notes: ${data.totalNotes}

Top Tags:
${data.mostUsedTags
  ?.map((t) => `${t._id} (${t.count})`)
  .join("\n")}
  `);
};

  return (
    <div className="min-h-screen bg-[#f7efef] p-6 lg:p-8">
      <div className="grid lg:grid-cols-[340px_1fr] gap-6">
        {/* SIDEBAR */}
        <aside className="space-y-5">
          <div className="bg-[#fff8f7] border border-[#eadede] rounded-[32px] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-black text-2xl text-[#2d2926]">
                  {user.name}
                </h2>

                <p className="text-[#746d67] text-sm mt-1">
                  {user.email}
                </p>
              </div>

              <button
                onClick={logout}
                className="w-11 h-11 rounded-full bg-[#f4d7d4] flex items-center justify-center"
              >
                <LogOut size={18} className="text-[#2d2926]" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7d7771]"
                  size={18}
                />

                <input
                  placeholder="Search notes..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-12 p-4 rounded-2xl border border-[#efe5e3] bg-[#fff]"
                />
              </div>

              <div className="relative">
                <Tags
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7d7771]"
                  size={18}
                />

                <input
                  placeholder="Filter tags"
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="w-full pl-12 p-4 rounded-2xl border border-[#efe5e3] bg-[#fff]"
                />
              </div>

              <div className="relative">
                <Clock3
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7d7771]"
                  size={18}
                />

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full pl-12 p-4 rounded-2xl border border-[#efe5e3] bg-[#fff] appearance-none"
                >
                  <option value="recent">Recently Updated</option>
                </select>
              </div>
            </div>
          </div>

          <NoteList
  notes={notes}
  onSelect={setCurrent}
  onNew={createNew}
  selectedId={current?._id}
  onDelete={deleteNote}
  onInsights={showInsights}
/>
        </aside>

        {/* EDITOR */}
        <Editor
          note={current}
          onChange={updateNote}
          onArchive={archive}
          onShare={share}
        />
      </div>
    </div>
  );
}
