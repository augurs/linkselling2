import React from 'react'
import { Button, Container, Navbar } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'
import LanguageSelect from '../Language/languageSelect';
import { useCart } from '../../Context/cartListContext';
import { FaHome } from 'react-icons/fa';

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
                        <Link onClick={() => navigate('/publisher/dashboard')}>
                            <FaHome style={{ marginTop: "-3px" }} size={25} />
                        </Link>
                    </div>
                    <div className="navbar navbar-collapse responsive-navbar p-0">
                        
                    </div>
                    <div className='me-4'>
                        <LanguageSelect />
                    </div>
                    <i className="fa fa-sign-out " aria-hidden="true" style={{ fontSize: "20px", cursor: "pointer" }} onClick={() => setModalShow(true)}></i>
                </Container>
            </Navbar>
        </>
    )
}

export default Header