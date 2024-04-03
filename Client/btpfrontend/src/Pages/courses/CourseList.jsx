import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
function CourseList(props) {
    const [data, setData] = useState([]);
    const { subjectId } = useParams();
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
        <>

        </>
    );
}

export default CourseList;