// PixabayImageSearch.js
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { useLanguage } from '../../Context/languageContext';
import { translate } from '../../../utility/helper';
const PixabayImageSearch = ({ onSelectImage }) => {
  const [pixabayUrl, setPixabayUrl] = useState('');
  const [pixabayImages, setPixabayImages] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const { languageData } = useLanguage();

  const handlePixabaySearch = () => {
    const apiKey = '40830107-516989e1559b076d66f20b16e';
    const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${pixabayUrl}&image_type=photo`;

    axios.get(apiUrl)
      .then(response => {
        setPixabayImages(response.data.hits);
        setShowModal(true);
      })
      .catch(error => {
        console.error('Error fetching images from Pixabay:', error);
      });
  };

  const handlePixabayImageSelect = (selectedPixabayImage) => {
    onSelectImage(selectedPixabayImage);
    setPixabayImages([]);
    setShowModal(false);
    setPixabayUrl('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className='input-group'>
      <input
        className='form-control'
        type='text'
        placeholder={translate(languageData, "searchPixabay")}
        onChange={(e) => setPixabayUrl(e.target.value)}
        value={pixabayUrl}
      />
      <span className='input-group-text'>
        <button
          className='btn btn-outline-primary'
          onClick={handlePixabaySearch}
          style={{ width: "30px", height: "30px", padding: "0" }}
        >
          <FaSearch />
        </button>
      </span>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{translate(languageData, "SelectPixabayImage")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-wrap mt-2 ml-3">
            {pixabayImages.map(pixabayImage => (
              <div key={pixabayImage.id} className="my-1" onClick={() => handlePixabayImageSelect(pixabayImage)}>
                <img src={pixabayImage.previewURL} alt={pixabayImage.tags} className='border border-primary w-75' />
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            {translate(languageData, "close")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PixabayImageSearch;
