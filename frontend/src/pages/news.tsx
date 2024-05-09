import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const News = () => {
  const [newsData, setNewsData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/news");
        // console.log(response.feed)
        setNewsData(response.data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col mx-96 mt-4 items-center gap-3">
      {newsData.map((item, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-lg p-4 w-2/3 mr-4"
        >
          <p className="text-lg font-bold mt-4">{item.title}</p>
          <img
            src={item.banner_image}
            alt={item.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <h2 className="text-base mt-4">{item.summary}</h2>
          <p className="text-gray-600 mt-2">{item.authors[0]}</p>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 mt-4 inline-block"
          >
            Read more
          </a>
        </div>
      ))}
    </main>
  );
};

export default News;
