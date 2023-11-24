import React, { useRef, useState } from 'react';
import "./fileupload.css"
import { useLanguage } from '../../Context/languageContext';
import { translate } from '../../../utility/helper';
import { useEffect } from 'react';
const FileUpload = ({ allowedFileExtensions, getData, name , selectedImage }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFilesName, setUploadedFilesName] = useState('')

    const fileInputRef = useRef(null);

    const { languageData  } = useLanguage();

    useEffect(() => {
        if(selectedImage){
            setUploadedFilesName(selectedImage)
        }
      
    }, [selectedImage])
    

    const handleDragEnter = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };


    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };


    const handleDragOver = (e) => {
        e.preventDefault();
    };


    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files[0];
        setUploadedFilesName(files.name)
        getData(files, e.target.name)
    };


    ;


    const handleInputChange = (e) => {
        const files = e?.target?.files[0];
        getData(files, e.target.name)
        setUploadedFilesName(files.name)
    };


    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div
            className={`file-upload ${isDragging ? 'dragging' : ''} w-100`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {/* <p></p> */}
            <button onClick={handleButtonClick}>{translate(languageData , "AddArtiSelecrDragFile")}</button>
            <input
                type="file"
                className="hidden-input"
                ref={fileInputRef}
                onChange={handleInputChange}
                name={name}
            />
            {uploadedFilesName && (
                <p>Uploaded File: {uploadedFilesName}</p>
            )}
        </div>
    );
};

export default FileUpload;
