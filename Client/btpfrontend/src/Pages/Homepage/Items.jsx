import React, { useEffect, useState } from "react";
import Styles from "./Items.module.css"
import Subjectcard from "./Subjectcard.jsx";
import { Link } from "react-router-dom"

const Items = () => {
    const [data, setData] = useState([]);
    const getdata = async () => {
        try {
            const res = await fetch('http://localhost:3001/', {
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
    return (<>

        <div className={Styles.maincont}>
            <div className={Styles.subcard}>
                {
                    data.map((value) => (
                        <Link to={`/${value._id}?title=${value.title}`}>
                            <div key={value.id} className={Styles.cards}>
                                <Subjectcard details={value} />
                            </div>
                        </Link>
                    )
                    )
                }
            </div>
        </div>
    </>);
}
export default Items;