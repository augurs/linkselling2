import React, { useRef, useState } from 'react';
import { useLanguage } from '../../Context/languageContext';
import { translate } from '../../../utility/helper';
import { useEffect } from 'react';
import "./fileupload.css"

const FileUpload = ({ allowedFileExtensions, getData, name, selectedImage, buttonName, classNames, errorMessage }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFilesName, setUploadedFilesName] = useState('')

    const fileInputRef = useRef(null);

    const { languageData } = useLanguage();

    useEffect(() => {
        if (selectedImage) {
            if (selectedImage instanceof File) {
                setUploadedFilesName(selectedImage.name);
            } else {
                setUploadedFilesName(selectedImage);
            }
        }
    }, [selectedImage]);


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
        if (files) {
            getData(files, e.target.name);
            setUploadedFilesName(files.name);
        } else {
            console.log("No file selected or upload cancelled.");
        }
    };


    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const clear = () => {
        setUploadedFilesName('');
    };

    return (
        <div
            className={`${classNames ? `file-upload1` : "file-upload w-100"}  ${isDragging ? 'dragging' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {/* <p></p> */}
            <button className="text-break p-1" onClick={handleButtonClick}>{uploadedFilesName ? uploadedFilesName : buttonName ? buttonName : translate(languageData, "AddArtiSelecrDragFile")}</button>
            <input
                type="file"
                className="hidden-input"
                ref={fileInputRef}
                onChange={handleInputChange}
                name={name}
                accept={allowedFileExtensions}
            />
            <div className="text-danger">{errorMessage}</div>
        </div>
    );
};

export default FileUpload;
