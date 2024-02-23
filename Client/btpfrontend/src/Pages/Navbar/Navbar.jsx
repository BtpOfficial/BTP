import React, { useState } from "react";
import Styles from './Navbar.module.css'
import { CiSearch } from "react-icons/ci";
import Logo from "../../assets/logo.jpg"
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross1 } from "react-icons/rx";
const Navbar = () => {
    const [hide, sethide] = useState(false);
    const [Active1, setActive1] = useState(true);
    const [Active2, setActive2] = useState(false);
    const makeActiveHome = () => {
        setActive1(true);
        setActive2(false);
    }
    const makeActiveLogin = () => {
        setActive1(false);
        setActive2(true);
    }
    const showbar = () => {
        sethide(!hide);
    }
    return (<>
        <div className={Styles.main}>
            <div className={Styles.first}>
                <div className={Styles.first_inside}>
                    <div className={Styles.search_text}>Search</div>
                    <input className={Styles.search} ></input>
                    <div className={Styles.search_icon}><CiSearch /></div>
                </div>
            </div>
            <div className={Styles.second}>
                <div className={Styles.secondin}>
                    <img className={Styles.logo} src={Logo}></img>
                    <div className={Styles.name}> Kumar Academy</div>
                </div>
                {!hide ?
                    <div className={Styles.burger}><RxHamburgerMenu onClick={showbar} /></div>
                    :
                    <div className={Styles.burger}><RxCross1 onClick={showbar} /></div>
                }
            </div>
            <div className={`${Styles.third}  ${hide ? Styles.special : ''}`} >
                <p className={`${Styles.nav_item} ${Active1 && Styles.active}`} onClick={makeActiveHome}>Home</p>
                <p className={`${Styles.nav_item} ${Active2 && Styles.active}`} onClick={makeActiveLogin}>Login / SignUp </p>
                {/* <p className={Styles.nav_item}>LogOut </p> */}
            </div>
        </div>
    </>
    );
}
export default Navbar;