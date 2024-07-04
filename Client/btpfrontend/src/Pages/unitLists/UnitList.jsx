import React, { useEffect, useState } from "react";
import { Link, Outlet, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { setId } from "../../state/authSlice";
import Styles from './UnitList.module.css';

function UnitList() {
    const dispatch = useDispatch();
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

    const setId1 = (id) => {
        dispatch(setId(id)); // Pass the id as payload
    };

    const ID = useSelector((state) => state.id); // Access auth slice
    console.log(ID);


    useEffect(() => {
        getdata();
    }, [ID]);

    return (
        <>
            <div className={Styles.container}>
                <div className={Styles.left}>
                    {data.map(item => (
                        <Link to={`${item._id}`} key={item._id}>
                            <p onClick={() => setId1(item._id)} className={`${Styles.left_list} ${ID === item._id ? Styles.active : ''}`}>{item.title}</p>
                        </Link>
                    ))}
                </div>
                <div className={Styles.right}><Outlet /></div>
            </div>
        </>
    );
}

export default UnitList;