import React from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'

const ArticleDetails = () => {
    const navigate = useNavigate()
    return (
        <div className='p-4'>
            <h2 className='mt-3'>(brak tytułu)</h2>
            <div className='w-100 d-flex mb-3'><Button variant='outline-primary ms-auto' onClick={() => navigate('/articleList')}>Back</Button></div>
            <Card className='mt-5'>
                <Card.Body className='w-100'>
              
                    <div className='w-100 d-flex flex-column'>
                        <div >
                            <Row>
                                <Col lg={1} className='d-block'>
                                    <span className='text-muted'>Status</span>
                                </Col>
                                <Col lg={1}>
                                    <span><button className='btn btn-pill btn-outline-primary ms-4' style={{ fontSize: "12px" }}>New</button></span>
                                </Col>
                            </Row>
                        </div>

                        <div className='mt-4'>
                            <Row>
                                <Col lg={1}>
                                    <span className='text-muted'>Project</span>
                                </Col>
                                <Col lg={3}>
                                    <span className='ms-4'><Link to="https://project.com">https://project.com</Link></span>
                                </Col>
                            </Row>
                        </div>
                        <div className='mt-4'>
                            <Row>
                                <Col lg={1}>
                                    <span className='text-muted'>Type</span>
                                </Col>
                                <Col lg={3}>
                                    <span className='ms-4 fw-semibold'>Paid Article</span>
                                </Col>
                            </Row>
                        </div>

                        <div className='mt-4'>
                            <Row>
                                <Col lg={1}>
                                    <span className='text-muted'>Source</span>
                                </Col>
                                <Col lg={3}>
                                    <span className='ms-4'>Own</span>
                                </Col>
                            </Row>
                        </div>
                        <div className='mt-4'>
                            <Row>
                                <Col lg={1}>
                                    <span className='text-muted'>Language</span>
                                </Col>
                                <Col lg={3} className='ms-4'>
                                    <span>Polski</span>
                                </Col>
                            </Row>
                        </div>
                        <div className='mt-4'>
                            <Row>
                                <Col lg={1}>
                                    <span className='text-muted'>Publication on a portal</span>
                                </Col>
                                <Col lg={3} className='ms-4'>
                                    <span>meskiswiat.pl
                                    </span>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Card.Body>
            </Card>


            <Card>
                <Card.Header className='border-bottom'>
                    <h4 className='fw-bold'>Article preview</h4>
                </Card.Header>
                <Card.Body>
                    <h2>(brak tytułu)</h2>
                </Card.Body>
            </Card>

        </div>
    )
}

export default ArticleDetails