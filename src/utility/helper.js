// import { useLanguage } from "../app/Context/languageContext"

// const { languageData } = useLanguage();


export const translate = (languageData, title) => {

   const translatedData = languageData && languageData?.filter((item) => item.title === title)[0]?.value || title;
   return translatedData;

}

export function numberToNumeralsArray(number) {
   if (number < 0 || number > 999999) {
      return ['Out of range'];
   }

   let numeralsArray = []
   for (let i = 1; i <= number; i++) {
      numeralsArray.push(i)
   }

   return numeralsArray;
}