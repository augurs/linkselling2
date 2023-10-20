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

    console.log(language , "20");

    const languageService = async () => {
        const res =  await getLanguages(language)
        console.log(res , "15");
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