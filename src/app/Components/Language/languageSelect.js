import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../Context/languageContext';
import { updateLanguages } from '../../../services/CommonServices/commonService';
import polandFlag from '../../../assets/images/flags/pl.svg';
import usFlag from '../../../assets/images/flags/us.svg';
import { languagesOptsList } from '../../../services/ProjectServices/projectServices';
import { baseURL2 } from '../../../utility/data';

const LanguageSelect = () => {
  const langState = localStorage.getItem('lang');
  const [lang, setLang] = useState({ name: 'Polish', flag: polandFlag });
  const [languagesOpts, setLanguagesOpts] = useState([])
  const [loading, setLoading] = useState(false)
  const { setLanguage } = useLanguage();
  const userData = JSON.parse(localStorage.getItem('userData'));
  const publisherData = JSON.parse(localStorage.getItem('publisherData'));
  const accessToken = localStorage.getItem('accessToken');
  const publisherAccessToken = localStorage.getItem('publisherAccessToken');



  const { i18n } = useTranslation();
  const location = useLocation();
  const getLang = localStorage.getItem('lang');

  useEffect(() => {
    if (!getLang) {
      localStorage.setItem('lang', 'pl');
    }
    languagesOptsServices()
  }, []);

  // const languages = [
  //   { name: 'Polish', flag: polandFlag, value: 'pl' },
  //   { name: 'English', flag: usFlag, value: 'en' },
  // ];
  const languagesOptsServices = async () => {
    setLoading(true);
    try {
      const res = await languagesOptsList();
      const mappedOptions = res.languages.map(language => ({
        name: language.englishName,
        value: language.code,
        flag: `${baseURL2}/LinkSellingSystem/public/${language.image}`
      }));
      setLanguagesOpts(mappedOptions);
    } catch (error) {
      console.error('Error fetching language options:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguage = (name, flag, value) => {
    setLang({ name, flag });
    setLanguage(value);
    localStorage.setItem('lang', value);

    updateLanguagesServices(value);
  };

  const updateLanguagesServices = async (lang) => {
    try {
      const data = {
        id: userData?.id ? userData?.id : publisherData?.id,
        language: lang,
      };

      const res = await updateLanguages(data);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredLanguage = languagesOpts?.find((language) => language?.value === langState);

  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="flagDropdown">
          <img src={filteredLanguage?.flag} alt={filteredLanguage?.name} width={20} className="me-2" />
          {filteredLanguage?.name}
        </Dropdown.Toggle>
        <Dropdown.Menu className="bg-primary border-0 rounded-0" style={{ minWidth: '100%' }}>
          {languagesOpts.map((lang, index) => (
            <Dropdown.Item key={index} className="d-flex align-items-center text-white" onClick={() => handleLanguage(lang?.name, lang?.flag, lang?.value)}>
              <img src={lang?.flag} alt={lang?.name} width={25} className="pe-2" />
              {lang?.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default LanguageSelect;
