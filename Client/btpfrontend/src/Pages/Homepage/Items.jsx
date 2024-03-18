import React from "react";
import Styles from "./Items.module.css"
import data from './data.js'
import Subjectcard from "./Subjectcard.jsx";
const Items = () => {
    console.log(data)
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