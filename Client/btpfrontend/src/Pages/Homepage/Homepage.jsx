import React from "react";
import Styles from "./Homepage.module.css"
import homeimg from '../../assets/homeimg.png'
import Items from "./Items";
const Home = () => {
    return (<>
        <div className={Styles.topcont}>
            <div className={Styles.left}>
                <img className={Styles.homeimg} src={homeimg} alt="img"></img>
            </div>
            <div className={Styles.right}>
                <div className={Styles.right_first}>For every student,<br></br> every classroom<br></br>
                    Real result</div>
                <div className={Styles.right_second}>We’re a nonprofit with the mission to provide a free, world-class education for anyone, anywhere.</div>
                <div className={Styles.right_third}>
                    <button className={Styles.homebutton}>Learner</button>
                    <button className={Styles.homebutton}>Teacher</button>
                    <button className={Styles.homebutton}>Parent</button>
                </div>
            </div>
        </div>
        <Items />

    </>);
}
export default Home;