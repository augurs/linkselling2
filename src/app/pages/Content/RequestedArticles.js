import React from 'react'
import DataTable from 'react-data-table-component';
import { getRequestedArticles, updateRequestedArticles, viewRequestedArticles } from '../../../services/articleServices/articleServices';
import { useEffect } from 'react';
import { useState } from 'react';
import globalLoader from '../../../assets/images/loader.svg'
import { Button, Modal } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import { toast, ToastContainer } from 'react-toastify';
import { ColorRing } from 'react-loader-spinner';
import { translate } from '../../../utility/helper';
import { useLanguage } from '../../Context/languageContext';

const RequestedArticles = () => {

    const userData = JSON.parse(localStorage.getItem('userData'))
    const [requestedArticles, setRequestedArticles] = useState([])
    const [loading, setLoading] = useState({ listLoading: false, viewLoading: false, updateLoading: false, loadingStatus: '' })
    const [showModal, setShowModal] = useState(false)
    const [viewArticle, setViewArticle] = useState()
    const [suggestion, setSuggestion] = useState('')
    const [editor, setEditor] = useState('')
    const { languageData } = useLanguage();

    useEffect(() => {
        setEditor(viewArticle?.content)
        setSuggestion(viewArticle?.comments)
    }, [viewArticle])



    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'link', 'image'
    ];


    useEffect(() => {
        getRequestedArticleService()
    }, [])


    const getRequestedArticleService = async () => {
        setLoading({ ...loading, listLoading: true })
        const res = await getRequestedArticles(userData?.id)
        setRequestedArticles(res?.data)
        setLoading({ ...loading, listLoading: false })
    }

    const viewRequestedArticleService = async (articleId) => {
        setShowModal(true)
        setLoading({ ...loading, viewLoading: true })
        const res = await viewRequestedArticles(userData?.id, articleId)
        setViewArticle(res?.data[0])
        setLoading({ ...loading, viewLoading: false })
    }


    const updateRequestedArticleService = async (status) => {
        setLoading({ ...loading, updateLoading: true, loadingStatus: status })
        // if (status === 'AcceptWithoutChanges') {
        //     setSuggestion('')
        //     setEditor('')
        // } else if (status === 'RequestChanges') {
        //     setEditor('')
        // }
        const res = await updateRequestedArticles(viewArticle, suggestion, editor, status)
        if (res.success === true) {
            setLoading({ ...loading, updateLoading: false, loadingStatus: status })
            toast(res.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'success'
            });
            getRequestedArticleService()
            setShowModal(false)
        } else {
            setLoading({ ...loading, updateLoading: false, loadingStatus: status })
            toast(res.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                type: 'error'
            });
            getRequestedArticleService()
        }
    }




    const columns = [

        {
            name: translate(languageData, "S.No."),
            selector: row => row?.id,
            sortable: true,
            center: true,
        },
        {
            name: translate(languageData, "artilstTitle"),
            selector: row => row?.title,
            sortable: true,
            center: true,
        },
        {
            name: translate(languageData, "writingAi"),
            selector: row => row?.ai,
            sortable: true,
            center: true,
        },
        {
            name: translate(languageData, "writingContentSize"),
            selector: row => row?.contentsize,
            sortable: true,
            center: true,
        },
        {
            name: translate(languageData, "maxLinks"),
            selector: row => row?.maxLink,
            center: true,
            sortable: true,
        },
        {
            name: translate(languageData, "writingDateOfArticle"),
            selector: row => row?.dateOfArticle,
            center: true,
            sortable: true,
        },

        // {
        //     name: translate(languageData,"writingStatus"),
        //     cell: row => <button className='btn btn-outline-primary btn-pill ' >{row?.status}</button>,
        //     center: true,
        //     sortable: true,
        //     width: '200px',
        // },
        {
            name: translate(languageData, "writingStatus"),
            selector: (row) => row?.status,
            sortable: true,
            center: true,
            cell: (row) => {
                let buttonClass = "btn btn-outline-primary";
                let buttonText = "";

                switch (row.status) {
                    case "Pending":
                      buttonClass = "btn btn-outline-warning btn-pill";
                      buttonText = <small>{translate(languageData, "pending")}</small>;
                      break;
                    case "AssignedToWriter":
                      buttonClass = "btn btn-outline-info btn-pill";
                      buttonText = <small>{translate(languageData, "AssignedToWriter")}</small>;
                      break;
                    case "Completed":
                      buttonClass = "btn btn-outline-success btn-pill";
                      buttonText = <small>{translate(languageData, "Completed")}</small>;
                      break;
                      case "RequestChanges":
                      buttonClass = "btn btn-outline-warning btn-pill";
                      buttonText = <small>{translate(languageData, "RequestChanges")}</small>;
                      break;
                    case "Rejected":
                      buttonClass = "btn btn-outline-danger btn-pill";
                      buttonText = <small>{translate(languageData, "Rejected")}</small>;
                      break;
                    case "Accepted":
                      buttonClass = "btn btn-outline-secondary btn-pill";
                      buttonText = <small>{translate(languageData, "Accepted")}</small>;
                      break;
                    case "CustomerReview":
                      buttonClass = "btn btn-outline-warning btn-pill";
                      buttonText = <small>{translate(languageData, "CustomerReview")}</small>;
                      break;
                    case "RejectedLink":
                      buttonClass = "btn btn-outline-danger btn-pill";
                      buttonText = <small>{translate(languageData, "RejectedLink")}</small>;
                      break;
                    case "Published":
                      buttonClass = "btn btn-outline-primary btn-pill";
                      buttonText = <small>{translate(languageData, "Published")}</small>;
                      break;
                      case "PendingForAssing":
                      buttonClass = "btn btn-outline-warning btn-pill";
                      buttonText = <small>{translate(languageData, "PendingForAssing")}</small>;
                      break;
                      case "Accept":
                      buttonClass = "btn btn-outline-dark btn-pill";
                      buttonText = <small>{translate(languageData, "Accept")}</small>;
                      break;
                      case "RejectPublication":
                      buttonClass = "btn btn-outline-danger btn-pill";
                      buttonText = <small>{translate(languageData, "RejectPublication")}</small>;
                      break;
                      case "AcceptPublication":
                      buttonClass = "btn btn-outline-dark btn-pill";
                      buttonText = <small>{translate(languageData, "AcceptPublication")}</small>;
                      break;
                      case "RejectedByPortal":
                      buttonClass = "btn btn-outline-dark btn-pill";
                      buttonText = <small>{translate(languageData, "RejectedByPortal")}</small>;
                      break;
                    default:
                      
                      buttonText = row.status;
                  }

                return (
                    <span className={`${buttonClass} d-flex justify-content-center align-items-center`} style={{ minWidth: '140px', minHeight: "35px" }}>
                        {buttonText}
                    </span>
                );
            },
        },
        {
            name: translate(languageData, "Action"),
            cell: row => <button className='btn btn-primary' onClick={() => viewRequestedArticleService(row.articleId)} >{translate(languageData, "Edit")}</button>,
            center: true,
            sortable: true,
        },
    ];

    const data = requestedArticles?.map((item) => {
        return {
            id: item.id,
            title: item.article_title,
            ai: item.Ai,
            contentsize: item.contentsize,
            maxLink: item.max_links,
            dateOfArticle: item.date_of_article,
            status: item.status,
            articleId: item.article_id
        }
    })


    const handleEditorChange = (html) => {
        setEditor(html)
    }


    const noDataComponent = <div className="text-center">{translate(languageData, "thereAreNoRecordsToDisplay")}</div>;
    return (
        <div className='p-4'>
            <ToastContainer />
            {loading.listLoading ?


                <div className='d-flex justify-content-between align-items-center mt-5'>
                    <img src={globalLoader} className='mx-auto' alt='loader1' />
                </div> :
                <div>
                    <h4 className='mt-1 mb-3'>{translate(languageData, "requestedArticles")}</h4>

                    <DataTable
                        columns={columns}
                        data={data}
                        noDataComponent={noDataComponent}
                    />

                </div>}


            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                size="xl"
                className="w-100"
                style={{ overflowY: 'scroll' }}
            >
                <Modal.Header>
                    <h4>Edit Requested Article</h4>
                </Modal.Header>
                {loading.viewLoading ?
                    <div className='d-flex justify-content-between align-items-center mt-5'>
                        <img src={globalLoader} className='mx-auto' alt='loader' />
                    </div> :
                    <Modal.Body className='mx-4'>
                        <ul className="list-group">
                            <li className="list-group-item"><h4>S.No</h4><p>{viewArticle?.id ? viewArticle?.id : "N/A"}</p></li>
                            <li className="list-group-item"><h4>Title</h4><p>{viewArticle?.article_title ? viewArticle?.article_title : 'N/A'}</p></li>
                            <li className="list-group-item"><h4>AI</h4><p>{viewArticle?.Ai ? viewArticle?.Ai : 'N/A'}</p></li>
                            <li className="list-group-item"><h4>Content Size</h4><p>{viewArticle?.contentsize ? viewArticle?.contentsize : 'N/A'}</p></li>
                            <li className="list-group-item"><h4>Max Links</h4><p>{viewArticle?.max_links ? viewArticle?.max_links : 'N/A'}</p></li>
                            <li className="list-group-item"><h4>Date of Article</h4><p>{viewArticle?.date_of_article ? viewArticle?.date_of_article : 'N/A'}</p></li>
                            <li className="list-group-item"><h4>Status</h4><p>{viewArticle?.status ? viewArticle?.status : 'N/A'}</p></li>
                        </ul>

                        <div className='mt-4 mb-6'>
                            <ReactQuill
                                theme="snow"
                                onChange={handleEditorChange}
                                value={editor}
                                modules={modules}
                                formats={formats}
                                bounds={'.app'}
                                placeholder="Write content"
                                style={{ height: "200px" }}
                            />
                        </div>
                        <div className="wrap-input100 validate-input mb-0 mt-8" data-bs-validate="Password is required">
                            <textarea className="input100 py-2" placeholder="Suggestion" type="text" name="lead" cols={8} rows={10} style={{ paddingLeft: "15px" }} onChange={(e) => setSuggestion(e.target.value)} value={suggestion} />
                        </div>




                    </Modal.Body>}
                <Modal.Footer className='mt-2'>
                    {viewArticle?.paid == '1' &&
                        <>
                            <Button variant='primary' disabled={viewArticle?.status !== 'CustomerReview'} onClick={() =>
                                updateRequestedArticleService("AcceptWithoutChanges")
                            }>
                                {loading.updateLoading && loading.loadingStatus === 'AcceptWithoutChanges' ? <ColorRing
                                    visible={true}
                                    height="30"
                                    width="30"
                                    ariaLabel="blocks-loading"
                                    wrapperStyle={{}}
                                    wrapperClass="blocks-wrapper"

                                    colors={['#fff', '#fff', '#fff', '#fff', '#fff']}
                                /> : "Accept without changes"}</Button>
                            <Button variant='primary' disabled={viewArticle?.status !== 'CustomerReview'} onClick={() => updateRequestedArticleService("RequestChanges")}>
                                {loading.updateLoading && loading.loadingStatus === 'RequestChanges' ? <ColorRing
                                    visible={true}
                                    height="30"
                                    width="30"
                                    ariaLabel="blocks-loading"
                                    wrapperStyle={{}}
                                    wrapperClass="blocks-wrapper"

                                    colors={['#fff', '#fff', '#fff', '#fff', '#fff']}
                                /> : "Request Changes"}</Button>
                            <Button variant='primary' disabled={viewArticle?.status !== 'CustomerReview'} onClick={() => updateRequestedArticleService("MadeChanges")}>
                                {loading.updateLoading && loading.loadingStatus === 'MadeChanges' ? <ColorRing
                                    visible={true}
                                    height="30"
                                    width="30"
                                    ariaLabel="blocks-loading"

                                    wrapperStyle={{}}
                                    wrapperClass="blocks-wrapper"
                                    colors={['#fff', '#fff', '#fff', '#fff', '#fff']}
                                /> : "Make changes on your own"}</Button>
                        </>
                    }
                    <Button variant='primary' onClick={() => setShowModal(false)}>Close</Button>



                </Modal.Footer>

            </Modal>
        </div>
    )
}

export default RequestedArticles