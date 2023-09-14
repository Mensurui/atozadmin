import React, { useState } from "react";

const Carousel = () => {
  const images = [ // Replace these with your image URLs
    "image1.jpg",
    "image2.jpg",
    "image3.jpg",
  ];
  const [currentImage, setCurrentImage] = useState(0);

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="carousel">
      <img src={images[currentImage]} alt="Carousel" className="carousel-image" />
      <button className="carousel-button prev" onClick={prevImage}>
        Previous
      </button>
      <button className="carousel-button next" onClick={nextImage}>
        Next
      </button>
    </div>
  );
};

export default Carousel;
