import React, { useEffect, useState } from 'react';
import homeimg from '../assets/homeimg.png';
import './topicContent.css';
import { useParams } from 'react-router-dom';
const TopicContent = () => {
  const { subjectId, courseId, topicId, contentId } = useParams();
  const [data, setData] = useState({});
  const getdata = async () => {
    try {
      const res = await fetch(`http://localhost:3001/${subjectId}/${courseId}/${topicId}/${contentId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const fetchedData = await res.json();
      setData(fetchedData);
    } catch (error) {
      console.error('Data not found', error.message);
    }
  };
  useEffect(() => {
    getdata();
  }, []);
  console.log(data)
  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="max-w-6xl w-full bg-white p-16 rounded-lg shadow-lg flex flex-col lg:flex-row mb-6 mt-6">
        <div className="lg:w-1/4">
          <div className="flex justify-center lg:justify-start mb-6">
            <img src={homeimg} alt="Student Studying" className="w-64 h-auto rounded-lg shadow-md" />
          </div>
        </div>
        <div className=" raghav lg:w-2/3 lg:pl-8  ">
          <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
          <p>
            {data.content}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TopicContent;
