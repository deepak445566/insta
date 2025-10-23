import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import API from "./utils/axiosConfig";

const FoodOwner = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await API.get("/owner/check-auth");
      if (response.data.success) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log("Not authenticated as owner");
      setIsAuthenticated(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("Please login as a food owner first");
      return;
    }

    if (!video) {
      alert("Please select a video file");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("video", video);

    try {
      const response = await API.post("/item/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);
      navigate("/");

      setName("");
      setDescription("");
      setVideo(null);
    } catch (error) {
      console.error("Error creating food item:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        setIsAuthenticated(false);
      } else {
        alert("Error creating food item: " + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-4">Please login as a food owner to create items</p>
          <button
            onClick={() => navigate("/owner-login")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-6 rounded-lg shadow-md space-y-4"
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Create Food Item
        </h2>

        <div>
          <label className="block text-gray-700 mb-1" htmlFor="name">
            Food Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter food name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Upload Video</label>
          <div
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-40 cursor-pointer hover:border-blue-500 transition-colors relative"
            onClick={() => document.getElementById("videoInput").click()}
          >
            {video ? (
              <p className="text-gray-700">{video.name}</p>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-400 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h16M4 18h16M4 6v12"
                  />
                </svg>
                <p className="text-gray-500">Click to upload a video</p>
              </>
            )}
            <input
              type="file"
              id="videoInput"
              accept="video/*"
              className="hidden"
              onChange={(e) => setVideo(e.target.files[0])}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Creating..." : "Create Food"}
        </button>
      </form>
    </div>
  );
};

export default FoodOwner;