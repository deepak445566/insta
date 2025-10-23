import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "./utils/axiosConfig";

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [activeTab, setActiveTab] = useState("videos");
  const videoRefs = useRef([]);

  useEffect(() => {
    API.get(`/foodOwner/${id}`)
      .then((response) => {
        console.log("API RESPONSE:", response.data); 
        setProfile(response.data.owner);
        setVideos(response.data.owner?.foodItem || []);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleMouseEnter = (index) => {
    if (videoRefs.current[index]) {
      videoRefs.current[index].play();
    }
  };

  const handleMouseLeave = (index) => {
    if (videoRefs.current[index]) {
      videoRefs.current[index].pause();
      videoRefs.current[index].currentTime = 0;
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <section className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <img
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                src="https://images.unsplash.com/photo-1754653099086-3bddb9346d37?w=500&auto=format&fit=crop&q=60"
                alt="Profile"
              />
              <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                ✓
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {profile?.name || "No Name"}
                </h1>
                <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
                  </svg>
                  {profile?.address || "No Address"}
                </p>
              </div>

              <div className="flex justify-center md:justify-start gap-8">
                <div className="text-center">
                  <div className="font-bold text-2xl text-gray-900">{profile?.totalMeals || 0}</div>
                  <div className="text-gray-500 text-sm">Total Meals</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-2xl text-gray-900">{profile?.customersServed || 0}</div>
                  <div className="text-gray-500 text-sm">Customers Served</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-2xl text-gray-900">{videos.length}</div>
                  <div className="text-gray-500 text-sm">Videos</div>
                </div>
              </div>
            </div>

            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transition-all">
              Follow
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex border-b border-gray-200">
          <button 
            className={`px-4 py-2 font-medium ${activeTab === "videos" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500"}`}
            onClick={() => setActiveTab("videos")}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
              </svg>
              Videos
            </div>
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === "about" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500"}`}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-12">
        {activeTab === "videos" ? (
          <>
            {videos.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No videos yet</h3>
                <p className="text-gray-500">This user hasn't posted any videos.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 md:gap-2 -ml-2">
                {videos.map((v, index) => (
                  <div 
                    key={v._id || v.id} 
                    className="relative h-47 aspect-square bg-black group cursor-pointer"
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={() => handleMouseLeave(index)}
                  >
                    <video 
                      ref={el => videoRefs.current[index] = el}
                      className="w-full h-full object-cover"
                      src={v.video} 
                      muted 
                      loop
                      playsInline
                      preload="metadata"
                    />
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-white flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                          <span className="font-semibold">{v.likes || Math.floor(Math.random() * 100)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z"/>
                          </svg>
                          <span className="font-semibold">{v.comments || Math.floor(Math.random() * 50)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>

                    {v.multiVideo && (
                      <div className="absolute top-2 right-2">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4 6h16v12H4z"/>
                          <path d="M20 4h-2v16h2z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">About {profile?.name || "this user"}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-1">Business Information</h3>
                <p className="text-gray-600">{profile?.address || "No address provided"}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-1">Meals Served</h3>
                <p className="text-gray-600">{profile?.totalMeals || 0} total meals prepared</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-1">Customer Reach</h3>
                <p className="text-gray-600">{profile?.customersServed || 0} customers served</p>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default Profile;