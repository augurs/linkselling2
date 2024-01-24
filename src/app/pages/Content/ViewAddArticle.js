import React, { useState, useEffect } from 'react';
import globalLoader from '../../../assets/images/loader.svg';
import { translate } from '../../../utility/helper';
import { useLanguage } from '../../Context/languageContext';
import { Card, Col, Row } from 'react-bootstrap';
import { getArticles } from '../../../services/articleServices/articleServices';
import { useParams } from 'react-router-dom';
import moment from 'moment';
const ViewAddArticle = () => {

    const userData = JSON.parse(localStorage.getItem('userData'));
    const [loading, setLoading] = useState(false);
    const [article, setArticle] = useState(null);
    const { languageData } = useLanguage();
    const { id } = useParams();

    useEffect(() => {
      handleArticle();
    }, [id]);
    
    const handleArticle = async () => {
      setLoading(true);
      try {
        const res = await getArticles(userData?.id);
        const selectedArticle = res.data.find((article) => article.id === parseInt(id));
        setArticle(selectedArticle);
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="ltr">
      {loading ? (
        <div className="d-flex">
          <img src={globalLoader} className="mx-auto mt-10" alt="loader1" />
        </div>
      ) : (
        <Row>
          <Col>
            <Card className="h-100">
              <Card.Header className="d-flex justify-content-between border-bottom pb-4">
                <h3 className="fw-semibold">{translate(languageData, 'ArticleDetails')}</h3>
              </Card.Header>
              <Card.Body>
                <div className="">
                  <Row className="mt-5">
                    <Col xs={12} md={4}>
                      <h5>{translate(languageData, 'TitleOfArticle')} : </h5>
                    </Col>
                    <Col xs={12} md={8} className="mt-3 mt-md-0">
                      <div className="wrap-input100 validate-input mb-0">
                        {article?.title ?? ''}
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-5">
                    <Col xs={12} md={4}>
                      <h5>{translate(languageData, 'AddArtiLead')} : </h5>
                    </Col>
                    <Col xs={12} md={8} className="mt-3 mt-md-0">
                      <div className="wrap-input100 validate-input mb-0">
                        {article?.lead ?? ''}
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-5">
                    <Col xs={12} md={4}>
                      <h5>{translate(languageData, 'sidebarContent')} : </h5>
                    </Col>
                    <Col xs={12} md={8} className="mt-3 mt-md-0">
                      <div className="wrap-input100 validate-input d-flex">
                        <div dangerouslySetInnerHTML={{ __html: article?.content ?? '' }} />
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-5">
                    <Col xs={12} md={4}>
                      <h5>{translate(languageData, 'ProjectName')} : </h5>
                    </Col>
                    <Col xs={12} md={8} className="mt-3 mt-md-0">
                      <div className="wrap-input100 validate-input mb-0">
                        {article?.project ?? ''}
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-5">
                    <Col xs={12} md={4}>
                      <h5>{translate(languageData, 'image')} : </h5>
                    </Col>
                    <Col xs={12} md={8} className="mt-3 mt-md-0">
                      <div className="wrap-input100 validate-input mb-0">
                        <a href={article?.file ?? ''} download>
                          <img src={article?.file ?? ''} alt="Article Image" className="w-25" />
                        </a>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-5">
                    <Col xs={12} md={4}>
                      <h5>{translate(languageData, 'AddingDate')} : </h5>
                    </Col>
                    <Col xs={12} md={8} className="mt-3 mt-md-0">
                      <div className="wrap-input100 validate-input mb-0">
                        {moment(article?.created_at).format('DD/MM/YYYY') ?? '--'}
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  )
}

export default ViewAddArticle