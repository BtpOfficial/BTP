import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Styles from './TopicList.module.css'
function TopicList() {
    const { subjectId, courseId, topicId } = useParams();
    const [data, setData] = useState([]);
    const getdata = async () => {
        try {
            const res = await fetch(`http://localhost:3001/${subjectId}/${courseId}/${topicId}`, {
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
    }, [topicId]);
    return (
        <>

            <h1 className={Styles.heading} >Topic Lists</h1>
            <div className={Styles.container} >
                {data.map(item => (
                    <Link to={`${item._id}`}>
                        <div className={Styles.main}>
                            <p className={Styles.title}>{item.title}</p>
                            <p className={Styles.content}>{item.content}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    );
}


export default TopicList;