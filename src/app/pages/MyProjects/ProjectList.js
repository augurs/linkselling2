import React from 'react'
import { Button, Col, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import DataTable from 'react-data-table-component';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import globalLoader from '../../../assets/images/loader.svg'
import Select from 'react-select'
import { languagesOptsList, projectChangeStatus, projectList, searchProject } from '../../../services/ProjectServices/projectServices';
import { translate } from '../../../utility/helper';
import { useLanguage } from '../../Context/languageContext';
import { MdCheckCircle, MdCancel, MdMoveUp, MdEdit, MdLink } from 'react-icons/md';
import { baseURL2 } from '../../../utility/data';


const ProjectList = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const accessToken = localStorage.getItem('accessToken')
    const lang = localStorage.getItem("lang");

    const [searchTerms, setSearchTerms] = useState({ title: "", langauge: "" })
    const [loading, setLoading] = useState(false)
    const [projectListData, setProjectList] = useState([])
    const [searchedData, setSearchedData] = useState([])
    const [activeFilter, setActiveFilter] = useState('Active');
    const [projectChangedStatus, setProjectChangeStatus] = useState('');
    const [projectChangedId, setProjectChangeId] = useState('');
    const [languagesOpts, setLanguagesOpts] = useState([])
    const [cardLang, setCardLang] = useState(lang)

    useEffect(() => {
        if (lang)
            setCardLang(lang)
            languagesOptsServices()
    }, [lang, cardLang])


    const navigate = useNavigate();

    const handleActiveFilterChange = (filter) => {
        setActiveFilter(filter);
    };
    const { languageData } = useLanguage()


    useEffect(() => {
        handleSearchService()
    }, [searchTerms, activeFilter])

    useEffect(() => {
        projectListServices()
    }, [])

    const handleSearchService = async () => {
        setLoading(true)
        const res = await searchProject(searchTerms, activeFilter, accessToken)
        setSearchedData(res?.data)
        setLoading(false)
    }

    const projectListServices = async () => {
        setLoading(true)
        const res = await projectList(accessToken)
        setProjectList(res.data)
        setLoading(false)
    }

    // const languagesOpts = [
    //     {
    //         value: "English",
    //         label: "English"
    //     },
    //     {
    //         value: "Polish",
    //         label: "Polish"
    //     }
    // ]

    const languagesOptsServices = async () => {
        setLoading(true);
        try {
            const res = await languagesOptsList();
            const mappedOptions = res.languages.map(language => ({
                value: language.englishName,
                label: cardLang == "en" ? language.englishName : language.polishName,
                flag: `${baseURL2}/LinkSellingSystem/public/${language.image}`
            }));
            setLanguagesOpts(mappedOptions);
        } catch (error) {
            console.error('Error fetching language options:', error);
        } finally {
            setLoading(false);
        }
    };


    const StatusServices = async (id) => {
        setProjectChangeId(id)
        setLoading(true)
        const res = await projectChangeStatus(id, accessToken)
        setProjectChangeStatus(res?.data)
        if (res.success === true) {
            handleSearchService()
        }
        setLoading(false)
    }

    const columns = [
        {
            name: translate(languageData, "ProjectName"),
            selector: row => row.projectName,
            sortable: true,
            left: true,
        },
        {
            name: translate(languageData, "artilisAddingDate"),
            selector: row => row.dateOfAdding,
            sortable: true,
            left: true,
        },
        {
            name: translate(languageData, "Language"),
            selector: row => row.language,
            sortable: true,
            left: true,
        },
        {
            name: translate(languageData, "WebUrl"),
            selector: row => row.weburl,
            sortable: true,
            left: true,
            cell: (row) => (
                <Link to={`http://${row.weburl}`} target="_blank" style={{ textDecoration: "underline" }}>
                    {row.weburl}
                </Link>
            ),
        },
        {
            name: translate(languageData, "Action"),
            cell: row => (
                <div className='d-flex'>
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="tooltip">{translate(languageData, "Edit")}</Tooltip>}
                    >
                        < button className='bg-transparent' onClick={() => navigate(`/editProject/${row.id}`)}><MdEdit fontSize={16} /> </button >
                    </OverlayTrigger>
                    {activeFilter === "Active" ?
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="tooltip">{translate(languageData, "moveToNotActive")}</Tooltip>}
                        >
                            < button className='bg-transparent' onClick={() => StatusServices(row.id)}> <MdMoveUp fontSize={16} /></button >
                        </OverlayTrigger>
                        :
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="tooltip">{translate(languageData, "moveToActive")}</Tooltip>}
                        >
                            < button className='bg-transparent' onClick={() => StatusServices(row.id)}><MdMoveUp /> </button >
                        </OverlayTrigger>
                    }
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="tooltip">{translate(languageData, "showRelatedPurchaseDomain")}</Tooltip>}
                    >
                        < button className='bg-transparent' onClick={() => navigate(`/viewRelatedPurchaseDomain/${row.id}`)}><MdLink fontSize={16} /> </button >
                    </OverlayTrigger>
                </div>
            ),
            left: true,
        },
    ];

    const tableData = searchedData?.map((item) => {
        let date = item.created_at.split('T');
        date = date[0]
        return {
            id: item.id,
            projectName: item.name,
            dateOfAdding: date,
            language: item.language,
            weburl: item.domain,
            status: item.status
        };
    });


    const data = tableData;

    const handleLanguageChange = (selectedOption) => {
        setSearchTerms({ ...searchTerms, language: selectedOption?.value })
    }

    const noDataComponent = <div className="text-center">{translate(languageData, "thereAreNoRecordsToDisplay")}</div>;

    return (
        <div className='p-4'>
            <div className='d-flex flex-wrap '>
                <Button className='btn btn-primary btn-w-md me-2 mt-2' onClick={() => navigate('/addProject')}>{translate(languageData, "AddProject")}</Button>

            </div>
            <div className='mt-4'>
                <Row>
                    <Col xs={12} sm={6} md={3} className='mb-3'>
                        <Select options={languagesOpts} name='language' placeholder={translate(languageData, "Language")} styles={{ control: (provided) => ({ ...provided, borderColor: '#ecf0fa', height: '45px', }) }} onChange={handleLanguageChange} />

                    </Col>
                    <Col xs={12} sm={6} md={3} className='mb-3'>
                        <div className='border border-muted d-flex align-items-center bg-white mb-3 p-3' style={{ height: "45px" }}>
                            <MdCheckCircle size={24} className='text-primary' />
                            <span className='flex-grow-1 d-flex align-items-center justify-content-center'>
                                {translate(languageData, "active")}
                            </span>
                            <label className="custom-control custom-checkbox mb-1">
                                <Form.Check
                                    id='checkActive'
                                    name="Active"
                                    checked={activeFilter === 'Active'}
                                    onChange={() => handleActiveFilterChange('Active')}
                                />
                            </label>
                        </div>
                    </Col>
                    <Col xs={12} sm={6} md={3} className='mb-3'>
                        <div className='border border-muted d-flex align-items-center bg-white mb-3 p-3' style={{ height: "45px" }}>
                            <MdCancel size={24} className='text-secondary' />
                            <span className='flex-grow-1 d-flex align-items-center justify-content-center'>
                                {translate(languageData, "notActive")}
                            </span>
                            <label className="custom-control custom-checkbox mb-1">
                                <Form.Check
                                    id='checkNotActive'
                                    name="Deactive"
                                    checked={activeFilter === 'Deactive'}
                                    onChange={() => handleActiveFilterChange('Deactive')}
                                />
                            </label>
                        </div>
                    </Col>
                    <Col xs={12} sm={6} md={3} className='mb-2'>
                        <div className="wrap-input100 validate-input mb-0" data-bs-validate="Password is required">
                            <input className="input100" type="text" name="title" placeholder={translate(languageData, "artilstSearch")} onChange={(e) => setSearchTerms({ ...searchTerms, title: e.target.value })} />
                            <span className="focus-input100"></span>
                            <span className="symbol-input100">
                                <i className="zmdi zmdi-search" aria-hidden="true"></i>
                            </span>
                        </div>
                    </Col>

                </Row>
            </div>

            <div className='mt-5' style={{ minHeight: 'calc(100vh - 300px)' }}>
                {loading ?
                    <div className='d-flex justify-content-between align-items-center'>
                        <img src={globalLoader} className='mx-auto' />
                    </div> :
                    <DataTable
                        columns={columns}
                        data={data}
                        noDataComponent={noDataComponent}

                    />
                }
            </div>

        </div>
    )
}

export default ProjectList