import React, { useEffect, useState } from 'react';
import homeimg from '../../assets/homeimg.png';
import './topicContent.css';
import { message } from 'antd';
import { Link, useParams } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import { useSelector } from 'react-redux';
const TopicContent = () => {
  const { subjectId, courseId, topicId, contentId } = useParams();
  const [loading, setloading] = useState(false)
  const [data, setData] = useState({});
  const userId = useSelector((state) => state.user?._id);

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
  const handlecomplete = async () => {
    setloading(true)
    try {
      const res = await fetch(`http://localhost:3001/users/${subjectId}/${courseId}/${topicId}/${contentId}/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (res.status === 201) {
        message.success('Added successfully');
      } else {
        message.error('Some error occurred');
      }
    } catch (error) {
      console.log(error);
      message.error('Some error occurred');
    } finally {
      setloading(false);
    }
  }
  return (
    <>
      <div className="bg-green-500 w-full h-60px flex items-center justify-center">
        <span className="text-white font-bold">Completed</span>
      </div>
      <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center">
        {
          loading ? <BarLoader color={'#f1c40f'} loading={loading} />
            : <>
              <div className="max-w-6xl w-full bg-white p-16 rounded-lg shadow-lg flex flex-col lg:flex-row mb-6 mt-6">
                <div className="lg:w-1/4">
                  <div className="flex justify-center lg:justify-start mb-6">
                    <img src={homeimg} alt="Student Studying" className="w-64 h-auto rounded-lg shadow-md" />
                  </div>
                </div>
                <div className="raghav lg:w-2/3 lg:pl-8">
                  <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
                  <p>{data.content}</p>
                </div>
              </div>
              <div className="mt-6 w-full max-w-6xl flex justify-between items-end">
                <button onClick={handlecomplete} className="bg-blue-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Mark Complete</button>
                <Link to={`/quiz/${contentId}`} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Take Quiz</Link>
              </div>
            </>
        }
      </div>
    </>
  );
}

export default TopicContent;