import React, { useEffect, useState } from "react";

export default function Insights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/notes/insights", {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Loading insights...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-pink-700">
        Productivity Insights
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="p-5 bg-pink-50 rounded-xl border">
          <p className="text-gray-600">Total Notes</p>
          <h3 className="text-3xl font-bold mt-2">
            {data?.totalNotes || 0}
          </h3>
        </div>

        <div className="p-5 bg-purple-50 rounded-xl border">
          <p className="text-gray-600">AI Usage</p>
          <h3 className="text-3xl font-bold mt-2">
            {data?.aiUsage?.calls || 0}
          </h3>
        </div>

        <div className="col-span-1 md:col-span-2 p-5 bg-gray-50 rounded-xl border">
          <h3 className="text-lg font-semibold mb-3">
            Recently Edited Notes
          </h3>

          {data?.recent?.length > 0 ? (
            <ul className="space-y-2">
              {data.recent.map((r) => (
                <li
                  key={r._id}
                  className="flex justify-between border-b pb-2"
                >
                  <span>{r.title}</span>

                  <span className="text-sm text-gray-500">
                    {new Date(r.updatedAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent notes found</p>
          )}
        </div>

        <div className="col-span-1 md:col-span-2 p-5 bg-gray-50 rounded-xl border">
          <h3 className="text-lg font-semibold mb-3">
            Most Used Tags
          </h3>

          {data?.mostUsedTags?.length > 0 ? (
            <ul className="space-y-2">
              {data.mostUsedTags.map((t) => (
                <li
                  key={t._id}
                  className="flex justify-between border-b pb-2"
                >
                  <span>#{t._id}</span>
                  <span>{t.count}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tags found</p>
          )}
        </div>

      </div>
    </div>
  );
}