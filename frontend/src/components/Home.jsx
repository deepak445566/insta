import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "./utils/axiosConfig";
import { FaHeart, FaRegHeart, FaCommentDots, FaBookmark, FaRegBookmark, FaHome, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [allowSound, setAllowSound] = useState(false);
  const [liked, setLiked] = useState({});
  const [saved, setSaved] = useState({});
  const videoRefs = useRef([]);
  const navigate = useNavigate();

  // Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data } = await API.get("/item/user");
        const videosWithLikes = (data.foodItem || []).map(video => ({
          ...video,
          likeCount: video.likeCount || 0,
          savesCount: video.savesCount || 0
        }));

        setVideos(videosWithLikes);

        const initialLiked = {};
        const initialSaved = {};
        videosWithLikes.forEach(video => {
          initialLiked[video._id] = video.isLiked || false;
          initialSaved[video._id] = video.isSaved || false;
        });
        setLiked(initialLiked);
        setSaved(initialSaved);

      } catch (err) {
        console.error("Error fetching videos:", err);
        if (err.response?.status === 401) {
          navigate("/user/login");
        }
      }
    };
    fetchVideos();
  }, [navigate]);

  // Autoplay videos
  useEffect(() => {
    if (!videos.length) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
            if (allowSound) video.muted = false;
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.6 }
    );

    videoRefs.current.forEach(video => video && observer.observe(video));
    return () => videoRefs.current.forEach(video => video && observer.unobserve(video));
  }, [videos, allowSound]);

  const enableSound = () => {
    setAllowSound(true);
    videoRefs.current.forEach(v => { if (v) v.muted = false; });
  };

  const likeVideo = async (video) => {
    try {
      const response = await API.post(
        "/item/like",
        { foodId: video._id }
      );
      setLiked(prev => ({ ...prev, [video._id]: !prev[video._id] }));
      setVideos(prev => prev.map(v => v._id === video._id ? { ...v, likeCount: response.data.likeCount } : v));
    } catch (error) {
      console.error("Error liking video:", error);
      if (error.response?.status === 401) {
        navigate("/user/login");
      }
    }
  };

  const saveVideo = async (video) => {
    try {
      const response = await API.post(
        "/item/save",
        { foodId: video._id }
      );
      setSaved(prev => ({ ...prev, [video._id]: !prev[video._id] }));
      setVideos(prev => prev.map(v => v._id === video._id ? { ...v, savesCount: response.data.savesCount } : v));
    } catch (error) {
      console.error("Error saving video:", error);
      if (error.response?.status === 401) {
        navigate("/user/login");
      }
    }
  };

  return (
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black">
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full bg-black backdrop-blur-md flex justify-around items-center py-3 z-50 shadow-lg">
        <button className="flex flex-col items-center text-gray-800">
          <FaHome className="text-3xl text-white" />
          <span className="text-xs mt-1 text-white">Home</span>
        </button>
        <button onClick={() => navigate("/saved")} className="flex flex-col items-center text-gray-800">
          <FaSave className="text-3xl text-white" />
          <span className="text-xs mt-1 text-white">Save</span>
        </button>
      </div>

      {/* Videos */}
      <div onClick={enableSound}>
        {videos.map((video, index) => (
          <div key={video._id} className="h-screen w-full relative snap-start flex items-center justify-center bg-black">
            
            {/* Video */}
            <video
              ref={el => videoRefs.current[index] = el}
              src={video.video}
              className="h-full w-full object-cover"
              loop muted playsInline preload="metadata" controls={false}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

            <div className="absolute bottom-18 left-4 right-4 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
              {/* Profile section */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {/* Profile picture */}
                  <div className="w-9 h-9 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {video.owner?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  
                  {/* Username */}
                  <Link 
                    to={"/foodOwner/" + video.owner}
                    className="font-semibold text-white hover:text-gray-300 transition-colors"
                  >
                    @{video.owner?.contactname || "username"}
                  </Link>
                </div>
                
                {/* Follow button */}
                <Link
                  to={"/foodOwner/" + video.owner}
                  className="inline-block bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg font-medium transition-colors text-white"
                >
                  Profile
                </Link>
              </div>

              {/* Description with character limit like Instagram */}
              <p className="text-sm mb-3 line-clamp-2">
                {video.description || "No description available"}
              </p>
            </div>

            {/* Right Action Buttons */}
            <div className="absolute right-5 bottom-50 flex flex-col items-center gap-6 text-white">
              <button onClick={() => likeVideo(video)} className="flex flex-col items-center gap-1 transition-transform hover:scale-125 bg-black/50 p-3 rounded-full shadow-lg">
                {liked[video._id] ? <FaHeart className="text-red-500 text-3xl" /> : <FaRegHeart className="text-white text-3xl" />}
                <span className="text-sm font-medium">{video.likeCount || 0}</span>
              </button>
              <button className="flex flex-col items-center gap-1 bg-black/50 p-3 rounded-full shadow-lg">
                <FaCommentDots className="text-white text-3xl" />
                <span className="text-sm font-medium">{video.commentCount || 0}</span>
              </button>
              <button onClick={() => saveVideo(video)} className="flex flex-col items-center gap-1 transition-transform hover:scale-125 bg-black/50 p-3 rounded-full shadow-lg">
                {saved[video._id] ? <FaBookmark className="text-yellow-400 text-3xl" /> : <FaRegBookmark className="text-white text-3xl" />}
                <span className="text-sm font-medium">{video.savesCount || 0}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;