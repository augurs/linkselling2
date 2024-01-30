import React, { useEffect, useState } from 'react'
import PublisherHeader from '../Header/publisherHeader'
import { Button, Container, Modal } from 'react-bootstrap'
import PublisherSidebar from '../Sidebar/publisherSidebar'
import "./layout.css";
import { Outlet, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../Context/languageContext'
import { translate } from '../../../utility/helper'
import { useSidebar } from '../../Context/togglerBarContext';
const Layout = () => {

  const [modalShow, setModalShow] = useState(false)
  const navigate = useNavigate()
  const { languageData } = useLanguage();
  const { sidebarActive, toggleSidebar } = useSidebar();

  const publisherData = JSON.parse(localStorage.getItem("publisherData"));

  useEffect(() => {
    if (!publisherData) {
      navigate('/login/publisher')
    }
  }, [])



  const handleLogout = () => {
    localStorage.removeItem('publisherData')
    navigate('/login/publisher')
    setModalShow(false)
  }

  return (
    <div className={`app sidebar-mini ${sidebarActive ? "sidebar-gone sidenav-toggled" : ""} ltr`}>
      <div className='page'>
        <div className='page-main'>
          <PublisherHeader  toggleSiderbar={toggleSidebar} setModalShow={setModalShow} />
          <PublisherSidebar toggleSiderbar={toggleSidebar} sidebarActive={sidebarActive} />
          <div className='app-content main-content mt-0' style={{ paddingTop: "70px" }}>
            <div className="side-app">
              <Container className="main-container" fluid>
                <Modal show={modalShow} >
                  <Modal.Header closeButton>
                    <Modal.Title>{translate(languageData, "logout")}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>{translate(languageData, "AreYouSureYouWantToLogout")}</Modal.Body>
                  <Modal.Footer>
                    <Button variant="primary" onClick={() => handleLogout()} >
                    {translate(languageData, "logout")}
                    </Button>
                    <Button variant="outline-primary" onClick={() => setModalShow(false)}>
                    {translate(languageData, "close")}
                    </Button>
                  </Modal.Footer>
                </Modal>
                <Outlet />
              </Container>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout