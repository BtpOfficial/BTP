import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from 'react-router-dom';
import homeimg from '../../assets/homeimg.png'
import './cslist.css';
function CourseList(props) {
    const [data, setData] = useState([]);
    const { subjectId } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const title = queryParams.get('title');
    const getdata = async () => {
        try {
            const res = await fetch(`http://localhost:3001/${subjectId}`, {
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
    return (
        <div className="bg-gray-100 min-h-screen flex justify-center items-center">
            <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg flex flex-col lg:flex-row">
                <div className="lg:w-1/2">
                    <h1 className="text-3xl font-bold mb-6">{title}</h1>
                    <div className="flex justify-center lg:justify-start mb-6">
                        <img src={homeimg} alt="Student Studying" className="w-64 h-auto rounded-lg shadow-md" />
                    </div>
                </div>
                <div className="lg:w-1/2 lg:pl-8">
                    <h2 className="text-xl font-bold mb-4">Course List</h2>
                    <div className="overflow-y-scroll ..." >
                        {
                            data.map((course, index) => (
                                course &&
                                <div key={index} className={` bg-gray-200  p-2 rounded-md mb-2`}>
                                    <Link to={`/${subjectId}/${course._id}`}><p className="text-lg">{course.title}</p></Link>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}


export default CourseList;