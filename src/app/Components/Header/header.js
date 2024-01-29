import React from 'react'
import { Button, Container, Dropdown, FormControl, InputGroup, Nav, Navbar } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'
import LanguageSelect from '../Language/languageSelect';
import WalletBalance from '../Wallet/Wallet';

import { AiOutlineShoppingCart } from 'react-icons/ai';
import { useCart } from '../../Context/cartListContext';
import { FaHome } from 'react-icons/fa';
// sidebar-mini sidebar-gone sidenav-toggled

// sidebar_wrap-> is_expanded

const Header = ({ toggleSiderbar, setModalShow }) => {

    const navigate = useNavigate();

    const { cartContextData } = useCart()

    const logout = () => {
        localStorage.removeItem('userData')
        navigate('/login')
    }







    return (
        <>
            <Navbar expand="lg" className="app-header header sticky border-bottom">
                <Container fluid className="main-container">
                    <div className="d-flex">
                        {/* <Navbar.Toggle aria-label="Hide Sidebar" className="app-sidebar__toggle" data-bs-toggle="sidebar"/> */}

                        <Navbar.Brand className="logo-horizontal">
                            <Button
                                className="btn btn-icon btn-light sidebar_toggle_btn"
                                type="button"
                                onClick={() => toggleSiderbar()}
                            >
                                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                            </Button>
                        </Navbar.Brand>
                    </div>


                    <div className='d-flex m-2'>
                        <Link to="/">
                            <FaHome style={{ marginTop: "-3px" }} size={25} />
                        </Link>
                    </div>
                    <div className="navbar navbar-collapse responsive-navbar p-0">
                        {/* <div className="collapse navbar-collapse" id="navbarSupportedContent-4">
                            <div className="d-flex order-lg-2">
                                <Dropdown className="d-md-none d-flex">
                                    <Dropdown.Toggle variant="link" id="search-dropdown">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="header-icon" enableBackground="new 0 0 24 24" viewBox="0 0 24 24">
                        
                                        </svg>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="header-search dropdown-menu-start">
                                        <InputGroup className="w-100 p-2">
                                            <FormControl type="text" placeholder="Search...." />
                                            <InputGroup.Text as={Button} variant="primary">
                                                <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24">
                                            
                                                </svg>
                                            </InputGroup.Text>
                                        </InputGroup>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div> */}
                    </div>
                    <div className='me-4'>
                        <LanguageSelect />
                    </div>
                    <div className='btn btn-outline-primary me-2'>
                        <WalletBalance />
                    </div>
                    <div className="position-relative">
                        <AiOutlineShoppingCart size={25} className='me-4' onClick={() => navigate('/cart')} />
                        {cartContextData?.length > 0 && <span className="badge bg-primary rounded-circle" style={{ position: 'absolute', top: '-10px', right: '4px' }}>{cartContextData?.length}</span>}
                    </div>
                    <i className="fa fa-sign-out " aria-hidden="true" style={{ fontSize: "20px", cursor: "pointer" }} onClick={() => setModalShow(true)}></i>
                </Container>
            </Navbar>
        </>
    )
}

export default Header