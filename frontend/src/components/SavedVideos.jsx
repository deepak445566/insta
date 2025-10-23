import React, { useEffect, useState, useRef } from "react";
import API from "./utils/axiosConfig";
import { FaHeart, FaCommentDots, FaBookmark, FaMusic } from "react-icons/fa";

const SavedVideos = () => {
  const [savedVideos, setSavedVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRefs = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchSavedVideos = async () => {
      try {
        const { data } = await API.get("/item/saved");

        const videosWithCounts = (data.savedFoods || [])
          .filter(save => save.item)
          .map(save => ({
            ...save.item,
            likeCount: save.item.likeCount || 0,
            savesCount: save.item.savesCount || 0,
            commentCount: save.item.commentCount || 0
          }));

        setSavedVideos(videosWithCounts);
      } catch (err) {
        console.error("Error fetching saved videos:", err);
      }
    };

    fetchSavedVideos();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const scrollTop = container.scrollTop;
      const windowHeight = container.clientHeight;
      
      const newIndex = Math.round(scrollTop / windowHeight);
      
      if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < savedVideos.length) {
        if (videoRefs.current[currentVideoIndex]) {
          videoRefs.current[currentVideoIndex].pause();
        }
        
        if (videoRefs.current[newIndex]) {
          videoRefs.current[newIndex].play().catch(console.error);
        }
        
        setCurrentVideoIndex(newIndex);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      
      if (videoRefs.current[0]) {
        videoRefs.current[0].play().catch(console.error);
      }

      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [savedVideos.length, currentVideoIndex]);

  useEffect(() => {
    return () => {
      videoRefs.current.forEach(video => {
        if (video) video.pause();
      });
    };
  }, []);

  const formatCount = (count) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count;
  };

  return (
    <div 
      ref={containerRef}
      className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black"
    >
      {savedVideos.length === 0 && (
        <div className="h-screen flex flex-col items-center justify-center text-white">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <FaBookmark className="text-3xl text-gray-400" />
          </div>
          <p className="text-xl font-semibold mb-2">No saved videos yet</p>
          <p className="text-gray-400">Videos you save will appear here</p>
        </div>
      )}

      {savedVideos.map((video, index) => (
        <div key={video._id} className="h-screen w-full relative snap-start bg-black">
          <video
            ref={(el) => (videoRefs.current[index] = el)}
            src={video.video}
            className="h-full w-full object-cover"
            loop
            muted
            playsInline
            preload="metadata"
          />

          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/80 to-transparent" />

          <div className="absolute bottom-0 left-0 w-full p-4 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="font-semibold text-white text-sm">
                  {video.owner?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <p className="font-semibold">@{video.owner || "username"}</p>
                <p className="text-sm text-gray-300">{video.description || "No description"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <FaMusic className="text-sm" />
              <p className="text-sm text-gray-300">Original sound</p>
            </div>
          </div>

          <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <FaHeart className="text-2xl text-white" />
              </div>
              <span className="text-xs mt-1 font-semibold">{formatCount(video.likeCount)}</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <FaCommentDots className="text-2xl text-white" />
              </div>
              <span className="text-xs mt-1 font-semibold">{formatCount(video.commentCount)}</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <FaBookmark className="text-2xl text-white" />
              </div>
              <span className="text-xs mt-1 font-semibold">{formatCount(video.savesCount)}</span>
            </div>
          </div>

          <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs">
            {index + 1}/{savedVideos.length}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedVideos;