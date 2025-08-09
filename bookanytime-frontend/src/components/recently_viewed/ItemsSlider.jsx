import React, { useRef } from 'react';
import './ItemsSlider.css';
import { Container } from 'react-bootstrap';

const ItemsSlider = ({ title, children }) => {
  const scrl = useRef(null);

  return (
    <Container fluid className="items-slider-container" style={{ width: "90vw", marginLeft: "30px" }}>
      <h4 className="item-title">{title}</h4>
      <div className="item-slider">
        <div ref={scrl} className="item-container">
          {children}
        </div>
      </div>
    </Container>
  );
};

export default ItemsSlider;