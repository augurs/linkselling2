import React, { useState } from 'react';
import { AiOutlineStar , AiFillStar } from 'react-icons/ai';

const StarRating = ({ initialRating, onRatingChange }) => {
  const [rating, setRating] = useState(initialRating || 0);

//   const handleRatingClick = (clickedRating) => {
//     setRating(clickedRating);
//     onRatingChange(clickedRating);
//   };

  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= rating ? 'selected' : ''}`}
        //   onClick={() => handleRatingClick(star)}
        >
         {star <= rating ? <AiFillStar/> :<AiOutlineStar /> } 
        </span>
      ))}
    </div>
  );
};

export default StarRating;
