import React from "react";
import IMG from "../../assets/sub.jpg"
import Styles from "./Items.module.css"
function Subjectcard(props) {
    return (
        <>
            <div className={Styles.cardin}>
                <img className={Styles.cardimg} src={IMG} position='top' alt='IMG' />
                <p>{props.details.title}</p>
            </div>
        </>
    );
}

export default Subjectcard;