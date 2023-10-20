// import React, { useEffect, useState } from 'react'
// import './languageChange.css'



// const LanguageChange = () => {

//     const [translateCounter, setTranslateCounter] = useState(0)

//     useEffect(() => {
//         const addScript = document.createElement('script');
//         addScript.setAttribute(
//             'src',
//             'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
//         );
//         addScript.async = true;
//         document.body.appendChild(addScript);

//         window.googleTranslateElementInit = () => {
//             setTranslateCounter(translateCounter + 1)
//             if (translateCounter === 0) {
//                 new window.google.translate.TranslateElement(
//                     {
//                         pageLanguage: 'en',
//                         includedLanguages: 'en,pl',
//                         layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                        
//                     },
//                     'google_translate_element'
//                 );

//             }

//         };
//     }, []);

//     return (
//         <div>
//             <div id="google_translate_element"></div>

//         </div>
//     )
// }

// export default LanguageChange