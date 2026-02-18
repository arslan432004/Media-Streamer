import React, { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import ShimmerCard from "../components/ShimmerCard";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [prevPageToken, setPrevPageToken] = useState(null);
  const [currentPageToken, setCurrentPageToken] = useState("");

  const key = import.meta.env.VITE_RAPID_API_KEY;

  const fetchVideos = async (pageToken = "") => {
    if (!key) return;

    setLoading(true);
    try {
      const q = "popular";

      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&q=${encodeURIComponent(
        q
      )}&pageToken=${pageToken}&key=${key}`;

      const res = await fetch(url);
      const data = await res.json();

      // Replace videos instead of appending
      setVideos(data.items || []);

      setNextPageToken(data.nextPageToken || null);
      setPrevPageToken(data.prevPageToken || null);
      setCurrentPageToken(pageToken);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos(); // initial load
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to MediaStream</h1>

      {loading ? (
        <div className="video-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <ShimmerCard key={i} />
          ))}
        </div>
      ) : (
        <div className="video-grid">
          {videos.map((item) => (
            <VideoCard
              key={item.id?.videoId || item.id}
              video={item}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          disabled={!prevPageToken}
          onClick={() => fetchVideos(prevPageToken)}
          className="px-5 py-2 bg-gray-600 text-white rounded disabled:opacity-40"
        >
          Previous
        </button>

        <button
          disabled={!nextPageToken}
          onClick={() => fetchVideos(nextPageToken)}
          className="px-5 py-2 bg-red-600 text-white rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
