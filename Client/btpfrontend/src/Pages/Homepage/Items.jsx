import React, { useEffect } from "react";
import Styles from "./Items.module.css"
import data from './data.js'
import Subjectcard from "./Subjectcard.jsx";
const Items = () => {
    const getdata = async () => {
        var res;
        try {
            res = await fetch('http://localhost:3001/', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })
        } catch (error) {
            console.error('Data not found', error.message);
        }
        const data = await res.json();
    }

    useEffect(() => {
        getdata();
    }, []);

    return (<>
        <div className={Styles.maincont}>
            <div className={Styles.subcard}>
                {
                    data.map((value) => (
                        <div key={value.id} className={Styles.cards}>
                            <Subjectcard details={value} />
                        </div>
                    )
                    )
                }
            </div>
        </div>
    </>);
}
export default Items;