import React, { useEffect, useState } from "react";
import { dummyPostsData, PLATFORMS } from "../assets/assets";

export default function Scheduler() {
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [scheduledDate, setScheduledTime] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [mediaFile, setMediaFilePlatforms] = useState<File | null>(null);
  const [loading, setLoding] = useState(false);

  const fetchPosts = async () => {
    setPosts(dummyPostsData);
  };

  useEffect(() => {
    (async () => await fetchPosts())();
    const interval = setInterval(async () => await fetchPosts(), 1000);
    return () => clearInterval(interval);
  }, []);

  const scheduled = posts.filter((p) => p.status === "scheduled");
  const published = posts.filter((p) => p.status === "published");

  const togglePlatform = (id: string) =>
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoding(true);
    setTimeout(() => {
      setLoding(false);
      setPosts((prev) => [...prev, dummyPostsData[0]]);
    }, 1000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* compose pannel */}
      <div className="w-full lg:w-115 shrink-0">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-lg text-slate-700 ">Compose Post</h2>
          </div>
          <form className="space-y-5" onSubmit={handleSchedule}>
            {/* Platforms */}
            <div>
              <label className="block text-xs text-slate-500 uppercase mb-2">
                {" "}
                Platforms
              </label>
              <div className="flex flex-wrap gap-3">
                {PLATFORMS.map((p) => {
                  const active = selectedPlatforms.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => togglePlatform(p.id)}
                      type="button"
                      className={`flex items-center gap-1.5 p-3 rounded-md border transition-all duration-150 ${active ? "bg-red-50 border-red-300 text-red-500 scale-103 " : "border-slate-200 text-slate-500 hover:border-slate-300"}`}
                    >
                      <p.icon className="size-4.5" />
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Content  */}

            {/* Media upload  */}

            {/* Date & time  */}

            {/* Submit  */}
          </form>
        </div>
      </div>

      {/* Queue panels */}
    </div>
  );
}
