import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const News = () => {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_Backend_URL}/news`);
        setNewsData(response.data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white text-center mb-10">
          Latest News
        </h1>
        <div className="space-y-6">
          {newsData.map((item, index) => (
            <article
              key={index}
              className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="md:flex">
                <div className="md:flex-shrink-0">
                  <img
                    src={item.banner_image}
                    alt={item.title}
                    className="h-48 w-full object-cover md:w-48"
                  />
                </div>
                <div className="p-6 flex-1">
                  <h2 className="text-xl font-semibold text-white mb-2">
                    {item.title}
                  </h2>
                  <p className="text-gray-300 text-base mb-4">
                    {item.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-400 text-sm">
                      {item.authors[0]}
                    </p>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Read More
                      <svg
                        className="ml-2 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
};

export default News;