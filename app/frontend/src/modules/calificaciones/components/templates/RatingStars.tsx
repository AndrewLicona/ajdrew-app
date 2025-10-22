// modules/calificaciones/components/templates/RatingStars.tsx
'use client';

import React, { useState } from 'react';
import './RatingStars.css';

interface RatingStarsProps {
  rating?: number;
  onRatingChange: (rating: number) => void;
  maxStars?: number;
}

export default function RatingStars({

  rating = 0,
  onRatingChange,
  maxStars = 5,

}: RatingStarsProps) {

  const [hover, setHover] = useState(0);



  return (
    <div className="rating-stars">
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={index}
            className={`star ${starValue <= (hover || rating) ? 'active' : ''}`}
            onClick={() => {
              onRatingChange(starValue);
            }}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
            aria-label={`Calificar con ${starValue} ${starValue === 1 ? 'estrella' : 'estrellas'}`}>
            ★
          </button>
        );
      })}
    </div>
  );
}