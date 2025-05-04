import React from "react";
import { useNavigate } from 'react-router-dom';
import "../../styles/SectionScroller.css";

const SectionScroller = ({ title, items }) => {
  const navigate = useNavigate();
  return (
    <div className="section-scroller">
      <h3>{title}</h3>
      <div className="card-row">
        {items.map((item, index) => (
          <div
          className="music-card"
          key={index}
          onClick={() => {
            const type = (item.type === "single" || item.type === "composite") ? "album" : item.type;
            navigate(`/${type}/${item.id}`);
          }}
        >
        
            <img src={item.image} alt={item.title} />
            <p className="title">{item.title}</p>
            <p className="subtitle">{item.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionScroller;