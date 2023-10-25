import { createContext, useContext, useEffect, useState } from "react";
import { getLanguages } from "../../services/CommonServices/commonService";

const languageContext = createContext();

function useLanguage() {
    const value = useContext(languageContext);
    return value;
}

function CustomLanguageContext({ children }) {

    const langState = localStorage.getItem('lang')

    const [languageData, setLanguageData] = useState("")
    const [language, setLanguage] = useState(langState)

    useEffect(() => {
        languageService()
    }, [language])



    const languageService = async () => {
        const res =  await getLanguages(language)
        setLanguageData(res.data)
    }





    return (
        <languageContext.Provider  value={{ languageData , setLanguageData , setLanguage , language }}>
            {children}
        </languageContext.Provider>
    )
}

export { useLanguage };
export default CustomLanguageContext;