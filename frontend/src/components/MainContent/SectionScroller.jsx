import React from "react";
import "../../styles/SectionScroller.css";

const SectionScroller = ({ title, items }) => {
  return (
    <div className="section-scroller">
      <h3>{title}</h3>
      <div className="card-row">
        {items.map((item, index) => (
          <div className="music-card" key={index}>
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