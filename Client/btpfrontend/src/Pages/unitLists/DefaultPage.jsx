import React from "react";
import Styles from './TopicList.module.css'
import { useDispatch } from "react-redux";
import { setId } from "../../state/authSlice";
function DefaultPage() {
    const dispatch = useDispatch();
    dispatch(setId(null));
    return (
        <>
            <div className={Styles.defaultcont}>Let's Start Your learning</div>
        </>
    );
}

export default DefaultPage;