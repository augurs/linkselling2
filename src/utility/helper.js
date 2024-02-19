// import { useLanguage } from "../app/Context/languageContext"

// const { languageData } = useLanguage();


export const translate = (languageData, title) => {

   const translatedData = (languageData && languageData?.filter((item) => item.title === title)[0]?.value) || title;
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


export function formatDate(created_at) {
   const date = new Date(created_at);
   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, '0');
   const day = String(date.getDate()).padStart(2, '0');
   return `${year}-${month}-${day}`;
}


export const countLinksInEditor = (editorContent) => {
   const parser = new DOMParser();
   const parsedContent = parser.parseFromString(editorContent, 'text/html');
   const linkCount = parsedContent.querySelectorAll('a').length;
   return linkCount;
};

export const modules = {
   toolbar: [
      [{ 'header': '1' }, { 'header': '2' }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
   ],
};

export const formats = [
   'header',
   'bold', 'italic', 'underline', 'strike',
   'list', 'bullet',
   'link', 'image'
];


export const caseInsensitiveSort = (rowA, rowB) => {
   const a = rowA.title ? String(rowA.title).toLowerCase() : '';
   const b = rowB.title ? String(rowB.title).toLowerCase() : '';
 
   console.log('Comparing:', a, b);
 
   return a.localeCompare(b);
 };

 
 export function base64ToBinary(base64Image) {
   const base64Data = base64Image.split(',')[1];
   const binaryString = atob(base64Data);

   const bufferLength = binaryString.length;
   const buffer = new ArrayBuffer(bufferLength);
   const bytes = new Uint8Array(buffer);
   for (let i = 0; i < bufferLength; i++) {
       bytes[i] = binaryString.charCodeAt(i);
   }
   return buffer;
}
 