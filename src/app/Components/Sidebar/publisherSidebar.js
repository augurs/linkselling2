import React, { useEffect, useState } from 'react'
import { MdDashboard } from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../Context/languageContext';
import "./sidebar.css";
import { translate } from '../../../utility/helper';
import { Button} from 'react-bootstrap';
const Sidebar = ({ toggleSiderbar, sidebarActive }) => {

    const userData = JSON.parse(localStorage.getItem("publisherData"));
    const { languageData } = useLanguage()


    return (

        <div className={`sticky ${sidebarActive ? "is_expanded" : ""}`}>

            <div className="app-sidebar__overlay" data-bs-toggle="sidebar"></div>
            <div className="app-sidebar d-flex flex-column justify-content-between">
                <div className="side-header">
                    {!sidebarActive && <h3 className='mx-auto text-dark'>{translate(languageData, "title")}</h3>}
                    <Button
                        className="btn btn-icon btn-light sidebar_toggle_btn"
                        type="button"
                        onClick={() => toggleSiderbar()}
                    >
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </Button>
                </div>
                <div className="main-sidemenu">
                    <div className="slide-left disabled" id="slide-left">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#7b8191" width="24" height="24" viewBox="0 0 24 24">
                            <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z" />
                        </svg>
                    </div>
                    <ul className="side-menu mt-3">
                    <li className="slide" style={{ cursor: "pointer" }}>
                            <Link to='/publisher/dashboard' className="side-menu__item has-link" data-bs-toggle="slide">
                                <span className="side-menu__icon"><MdDashboard size={20} style={{ color: "gray!important" }} /></span>
                                <span className="side-menu__label">{translate(languageData, "dashboard")}</span>
                            </Link>
                        </li>
                    </ul>
                  
                </div>
            </div>
        </div>

    )
}

export default Sidebar