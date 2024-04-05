import React, { useEffect, useState } from "react";
import { Link, Outlet, useParams } from 'react-router-dom';
import Styles from './UnitList.module.css'
function UnitList() {
    const { subjectId, courseId } = useParams();
    const [data, setData] = useState([]);
    const getdata = async () => {
        try {
            const res = await fetch(`http://localhost:3001/${subjectId}/${courseId}`, {
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
            <div className={Styles.container}>
                <div className={Styles.left} >
                    {data.map(item => (
                        <Link to={`${item._id}`} key={item._id}>
                            <p className={Styles.left_list}>{item.title}</p>
                        </Link>
                    ))}
                </div>
                <div className={Styles.right}><Outlet /></div>
            </div >
        </>
    );
}


export default UnitList;
