import React, { useState } from 'react'
import { Form, Image } from 'react-bootstrap'
import { Dropdown } from 'react-bootstrap';
import polandFlag from "../../../assets/images/flags/pl.svg"
import usFlag from "../../../assets/images/flags/us.svg"
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useLanguage } from '../../Context/languageContext';

const LanguageSelect = () => {
    const langState = localStorage.getItem('lang')

    const [lang, setLang] = useState({ name: 'Polish', flag: polandFlag });
    const { i18n } = useTranslation();

    const location = useLocation();
    const { setLanguage } = useLanguage()
    const getLang = localStorage.getItem('lang');


    useEffect(() => {
        if (!getLang) {
            localStorage.setItem("lang", "pl")
        }
    }, [])

    const languages = [
        { name: 'Polish', flag: polandFlag, value: "pl" },
        { name: 'English', flag: usFlag, value: "en" },
    ];

    const handleLanguage = (name, flag, value) => {
        setLang({ name, flag })
        // i18n.changeLanguage(value);
        console.log(value);
        setLanguage(value)
        localStorage.setItem("lang", value)
    }

    const filteredLanguage = languages?.find(language => language?.value === langState);

    return (
        <div>
            <Dropdown>
                <Dropdown.Toggle variant="primary" id="flagDropdown">

                    <img src={filteredLanguage?.flag} alt={filteredLanguage?.name} width={20} className='me-2' />
                    {filteredLanguage?.name}

                </Dropdown.Toggle>
                <Dropdown.Menu className='bg-primary border-0 rounded-0' style={{ minWidth: "100%" }}>
                    {languages.map((lang, index) => (
                        <Dropdown.Item key={index} className='d-flex align-items-center text-white' onClick={() => handleLanguage(lang?.name, lang?.flag, lang?.value)} >
                            <img src={lang?.flag} alt={lang?.name} width={25} className='pe-2' />
                            {lang?.name}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}

export default LanguageSelect