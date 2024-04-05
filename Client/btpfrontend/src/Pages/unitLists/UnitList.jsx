import React, { useEffect, useState } from "react";
import { Link, Outlet, useParams } from 'react-router-dom';
import Styles from './UnitList.module.css'
import { useSelector, useDispatch } from "react-redux";
import { setActive } from "../../state";
function UnitList() {

    const dispatch = useDispatch();
    const { subjectId, courseId } = useParams();
    const [data, setData] = useState([]);
    const [id, setid] = useState(null);
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

    const setId = (id) => {
        setid(id);
        dispatch(setActive(id));
    }
    // const id_active = useSelector((state) => state.active);

    useEffect(() => {
        getdata();
    }, [id]);

    return (
        <>
            <div className={Styles.container}>
                <div className={Styles.left}>
                    {data.map(item => (
                        <Link to={`${item._id}`} key={item._id}>
                            <p onClick={() => setId(item._id)} className={`${Styles.left_list} ${id === item._id ? Styles.active : ''}`}>{item.title}</p>
                        </Link>
                    ))}
                </div>
                <div className={Styles.right}><Outlet /></div>
            </div>
        </>
    );
}

export default UnitList;
