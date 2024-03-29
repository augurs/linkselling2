import React, { useEffect, useState } from 'react'
import { BiUserCircle } from 'react-icons/bi';
import { PiArticleLight } from 'react-icons/pi';
import { BsPencil, BsFillBagCheckFill } from 'react-icons/bs';
import { AiOutlineProject, } from 'react-icons/ai';
import { PiLinkSimpleThin } from 'react-icons/pi';
import { LiaFileInvoiceDollarSolid } from 'react-icons/lia';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../Context/languageContext';
import "./sidebar.css";
import { translate } from '../../../utility/helper';
import { Button, OverlayTrigger, Popover, Row } from 'react-bootstrap';
import UserProfileModal from './userProfileModal';
import { ToastContainer } from 'react-toastify';
import Referral from '../Referral/Referral'
import RedeemModal from '../RedeemModal/reedeem'
import { useWallet } from '../../Context/walletContext';
import { useSidebar } from '../../Context/togglerBarContext';

const Sidebar = ({ toggleSiderbar, sidebarActive }) => {

    const userData = JSON.parse(localStorage.getItem("userData"));
    const accessToken = localStorage.getItem("accessToken")
    const [menuType, setMenuType] = useState("")
    const [currentPath, setcurrentPath] = useState('')
    const [isModalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const { toggleSidebar1, toggleSidebar2 } = useSidebar();

    const { languageData } = useLanguage()
    const [isDesktopScreen, setIsDesktopScreen] = useState(window.innerWidth >= 991);
    const { showWalletBalance, userDetails } = useWallet();



    const handleSidbarToggle = (type) => {
        if (menuType === "") {
            setMenuType(type)
        } else {
            setMenuType("")
        }

    }

    const handleLinkPath = (path) => {
        setcurrentPath(path)
        setMenuType("")
    }

    const handleEditClick = () => {
        setModalOpen(true);
    };
    useEffect(() => {
        if (accessToken) {
            showWalletBalance(accessToken);
        }
        const handleResize = () => {
            setIsDesktopScreen(window.innerWidth >= 991);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // const showWalletServices = async () => {
    //     setLoading(true);
    //     try {
    //         const res = await walletBalance(userData?.id);
    //         if (res.success === true) {
    //             setUserDetails(res?.data);
    //             setLoading(false);
    //         } else {
    //             console.error('API call failed:', res);
    //             setLoading(false);
    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
    //         setLoading(false);
    //     }
    // };

    // const popoverContent = (
    //     <Popover id="popover-content">
    //         <Popover.Body>
    //             <div>
    //                 <div className="side-menu-label1">lista artykułów</div>
    //                 <Link to="/articleList" className="slide-item" onClick={() => handleLinkPath('/articleList')}>
    //                     {translate(languageData, 'sidebarListArticle')}
    //                 </Link>
    //                 <Link to="/addArticle" className="slide-item" onClick={() => handleLinkPath('/addArticle')}>
    //                     {translate(languageData, 'SidebarAddArticle')}
    //                 </Link>
    //                 <Link to="/orderArticle" className="slide-item" onClick={() => handleLinkPath('/orderArticle')}>
    //                     {translate(languageData, 'SidebarOrderArticle')}
    //                 </Link>
    //                 <Link to="/requestedArticles" className="slide-item" onClick={() => handleLinkPath('/requestedArticles')}>
    //                     {translate(languageData, "viewRequestedArticle")}
    //                 </Link>
    //             </div>
    //         </Popover.Body>
    //     </Popover>
    // );

    const popoverBuylinks = (
        <Popover id="popover-content">
            <Popover.Body>
                <div>
                    <div className="side-menu-label1">lista artykułów</div>
                    <Link to="/articlesInProgress" className="slide-item" onClick={() => {handleLinkPath("/articlesInProgress"); toggleSidebar2(); }}>{translate(languageData, "SidebarArticleProgress")}</Link>
                    <Link to="/readyArticles" className="slide-item" onClick={() => {handleLinkPath("/readyArticles"); toggleSidebar2(); }}>{translate(languageData, "SidebarPublishedArticle")}</Link>
                    <Link to="/buyArticles" className="slide-item" onClick={() => handleLinkPath("/buyArticles")}>{translate(languageData, "SidebarPurchaseItem")}</Link>

                </div>
            </Popover.Body>
        </Popover>
    );
    const popoverUserProfile = (
        <Popover id="popover-content" >
            <Popover.Body className='d-flex flex-column justify-content-center align-items-center'>
                <div className='mb-2 border-bottom border-2'>
                    <h3 className='border-bottom border-3 text-center'>{translate(languageData, "UserProfile")}</h3>
                    <Link className="slide-item" >{`${translate(languageData, "emailSignUp")} : ${userDetails?.email}`}</Link>
                    <Link className="slide-item" >{userDetails?.phone_number !== null ? `${translate(languageData, "PhoneNumber")} : ${userDetails?.phone_number}` : `${translate(languageData, "PhoneNumber")} :  --`}</Link>
                </div>
                <div><Button className='btn btn-outline-primary' onClick={handleEditClick}>{translate(languageData, "edituserprofile")}</Button></div>
            </Popover.Body>

        </Popover>
    );

    return (

        <div className={`sticky ${sidebarActive ? "is_expanded" : ""}`}>

            <div className="app-sidebar__overlay" data-bs-toggle="sidebar"></div>
            <div className="app-sidebar d-flex flex-column justify-content-between">
                <div className="side-header">
                    {!sidebarActive && <h3 className='mx-auto text-dark'>{translate(languageData, "title")}</h3>}
                    <Button
                        className="btn btn-icon btn-light sidebar_toggle_btn"
                        type="button"
                        onClick={() => {toggleSiderbar(); handleSidbarToggle("articles");}}
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
                        {/* <OverlayTrigger trigger="click" show={menuType === "articles" ? "is-expanded active" : ""} placement="right" overlay={sidebarActive && isDesktopScreen ? popoverContent : <div />} rootClose> */}
                        {/* <OverlayTrigger trigger="click" show={menuType === "articles" ? "is-expanded active" : ""} placement="right"> */}
                            <li className={`slide ${menuType === "articles" ? "is-expanded" : ""}`} style={{ cursor: "pointer" }} onClick={() => {handleSidbarToggle("articles"); toggleSidebar2()}}>
                                <a className={`side-menu__item has-link ${menuType === "articles" ? "is-expanded active" : ""}`} data-bs-toggle="slide">
                                    <span className="side-menu__icon"><PiArticleLight size={20} style={{ color: "gray!important" }} /></span>
                                    <span className="side-menu__label">{translate(languageData, "sidebarContent")}</span><i className="angle fa fa-angle-right"></i>
                                </a>
                                <ul className="slide-menu">
                                    <li className="side-menu-label1"><a href="javascript:void(0)">lista artykułów</a></li>
                                    <li><Link to="/articleList" className="slide-item" onClick={() => handleLinkPath("/articleList")}>{translate(languageData, "sidebarListArticle")}</Link></li>
                                    <li><Link to="/addArticle" className="slide-item" onClick={() => handleLinkPath("/addArticle")}>{translate(languageData, "SidebarAddArticle")}</Link></li>
                                    <li><Link to="/orderArticle" className="slide-item" onClick={() => handleLinkPath("/orderArticle")}>{translate(languageData, "SidebarOrderArticle")}</Link></li>
                                    <li><Link to="/requestedArticles" className="slide-item" onClick={() => handleLinkPath("/requestedArticles")}>{translate(languageData, "viewRequestedArticle")}</Link></li>
                                </ul>
                            </li>
                            {/* </OverlayTrigger> */}
                        <OverlayTrigger trigger="click" show={menuType === "buylinks" ? "is-expanded" : ""} placement="right" overlay={sidebarActive && isDesktopScreen ? popoverBuylinks : <div />} rootClose>
                            <li className={`slide ${menuType === "buylinks" ? "is-expanded" : ""}`} style={{ cursor: "pointer" }} onClick={() => handleSidbarToggle("buylinks")}>
                                <a className={`side-menu__item has-link ${menuType === "buylinks" ? "is-expanded active" : ""}`} data-bs-toggle="slide">
                                    <span className="side-menu__icon"><PiLinkSimpleThin size={20} style={{ color: "gray!important" }} /></span>
                                    <span className="side-menu__label">{translate(languageData, "SidebarBuyLink")}</span><i className="angle fa fa-angle-right"></i>
                                </a>
                                <ul className="slide-menu">
                                    {/* <li class="side-menu-label1"><a href="javascript:void(0)">lista artykułów</a></li> */}
                                    <li><Link to="/articlesInProgress" className="slide-item" onClick={() => handleLinkPath("/articlesInProgress")}>{translate(languageData, "SidebarArticleProgress")}</Link></li>
                                    <li><Link to="/readyArticles" className="slide-item" onClick={() => handleLinkPath("/readyArticles")}>{translate(languageData, "SidebarPublishedArticle")}</Link></li>
                                    <li><Link to="/buyArticles" className="slide-item" onClick={() => { handleLinkPath("/buyArticles"); toggleSidebar1(); }}>{translate(languageData, "SidebarPurchaseItem")}</Link></li>
                                    {/* <li><Link to="/addArticle" class="slide-item" onClick={() => handleLinkPath("/addArticle")}>Dodaj artykuł</Link></li>
                                <li><Link to="/orderArticle" class="slide-item" onClick={() => handleLinkPath("/orderArticle")}>Zamów artykuł</Link></li> */}
                                </ul>
                            </li></OverlayTrigger>
                        <li className="slide" style={{ cursor: "pointer" }} >
                            <Link to="/projectList" className={`side-menu__item has-link`} data-bs-toggle="slide" onClick={() => { handleLinkPath("/projectList"); toggleSidebar2(); }}>
                                <span className="side-menu__icon"><AiOutlineProject size={20} style={{ color: "gray!important" }} /></span>
                                <span className="side-menu__label">{translate(languageData, "SidebarMyProject")}</span>
                            </Link>
                        </li>
                        {/* <li className="slide" style={{ cursor: "pointer" }}>
                            <Link to='/marketPlace' className="side-menu__item has-link" data-bs-toggle="slide">
                                <span className="side-menu__icon"><AiOutlineShopping size={20} style={{ color: "gray!important" }} /></span>
                                <span className="side-menu__label mt-1">{translate(languageData, "marketPlace")}</span>
                            </Link>
                        </li> */}
                        <li className="slide" style={{ cursor: "pointer" }}>
                            <Link to='/invoices' className="side-menu__item has-link" data-bs-toggle="slide" onClick={() => { handleLinkPath("/invoices"); toggleSidebar2(); }}>

                                <span className="side-menu__icon"><LiaFileInvoiceDollarSolid size={20} style={{ color: "gray!important" }} /></span>
                                <span className="side-menu__label">{translate(languageData, "sidebarInvoices")}</span>

                            </Link>
                        </li>
                        <li className="slide" style={{ cursor: "pointer" }}>
                            <Link to='/orders' className="side-menu__item has-link" data-bs-toggle="slide" onClick={() => { handleLinkPath("/orders"); toggleSidebar2(); }}>

                                <span className="side-menu__icon"><BsFillBagCheckFill size={20} style={{ color: "gray!important" }} /></span>
                                <span className="side-menu__label">{translate(languageData, "artilistOrders")}</span>

                            </Link>
                        </li>
                        <li className="slide" style={{ cursor: "pointer" }} >
                            < Referral  handleLinkPath={handleLinkPath} toggleSidebar2={toggleSidebar2}/>
                        </li>
                        <li className="slide" style={{ cursor: "pointer" }} >
                            < RedeemModal handleLinkPath={handleLinkPath} toggleSidebar2={toggleSidebar2}/>
                        </li>


                        {/* Other menu items */}
                        {/* ... */}
                    </ul>
                    <div className="slide-right" id="slide-right">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#7b8191" width="24" height="24" viewBox="0 0 24 24">
                            <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z" />
                        </svg>
                    </div>
                </div>
                {/* <div className='btn btn-outline-primary me-2'>
                        < Referral />
                    </div> */}
                <div>
                    <ul className="side-menu mt-3 border-top border-3">
                        <OverlayTrigger trigger="hover" delay={{ show: 800, hide: 810 }} placement="top" overlay={popoverUserProfile} rootClose>
                            <li className="slide" style={{ cursor: "pointer" }} onClick={handleEditClick}>
                                <div className="side-menu__item has-link d-flex justify-content-center align-items-center gap-3" data-bs-toggle="slide">
                                    <span className="side-menu__icon"><BiUserCircle size={30} style={{ color: "gray!important" }} /></span>
                                    <span className="side-menu__label text-wrap">{translate(languageData, "welcome")} {userData?.first_name} </span>
                                </div>
                            </li>
                        </OverlayTrigger>
                    </ul></div>
            </div>
            <UserProfileModal isModalOpen={isModalOpen} setModalOpen={setModalOpen} userDetails={userDetails} showWalletServices={showWalletBalance} />
            <ToastContainer />
        </div>

    )
}

export default Sidebar