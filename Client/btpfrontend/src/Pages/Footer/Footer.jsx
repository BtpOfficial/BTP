import React from "react";
import Styles from "./Footer.module.css";
import { GrLocation } from "react-icons/gr";
import { FaPhone } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
import { LuInstagram } from "react-icons/lu";
import { FaFacebookSquare } from "react-icons/fa";
export default function Footer() {
    return (
        <footer className={Styles.footer_distributed}>

            <div className={Styles.footer_left}>
                <h3>Learn<span>Hub</span></h3>

                <p className={Styles.footer_links}>
                    <a href="#">&nbsp;Home&nbsp; </a>
                    |
                    <a href="#">&nbsp;About&nbsp;</a>
                    |
                    <a href="#">&nbsp;Contact&nbsp;</a>
                    |
                    <a href="#">&nbsp;Blog&nbsp;</a>
                </p>

                <p className={Styles.footer_company_name}>Copyright © 2021 <strong>LearnHub</strong> All rights reserved</p>
            </div>

            <div className={Styles.footer_center}>
                <div className={Styles.footer_center_in}>
                    <a className={Styles.icon} ><GrLocation /></a>
                    <p>Jamdoli , Jaipur</p>
                </div>

                <div className={Styles.footer_center_in}>
                    <a className={Styles.icon} ><FaPhone /></a>
                    <p>+91 74**9**258</p>
                </div>
                <div className={Styles.footer_center_in}>
                    <a className={Styles.icon} ><IoMdMail /></a>
                    <p>xyz@gmail.com</p>
                </div>
            </div>
            <div className={Styles.footer_right}>
                <p className={Styles.footer_company_about}>
                    <span >About the company</span>
                    Across the globe, 617 million children are missing basic math and reading skills. We’re a nonprofit delivering the education they need, and we need your help. You can change the course of a child’s life.
                </p>
                <div className={Styles.footer_icons}>
                    <a className={Styles.icon} href=""><FaFacebookSquare /></a>
                    <a className={Styles.icon} href=""><LuInstagram /></a>
                    <a className={Styles.icon} href=""><FaLinkedin /></a>
                    <a className={Styles.icon} href=""><FaSquareXTwitter /></a>
                </div>
            </div>
        </footer>
    );
}