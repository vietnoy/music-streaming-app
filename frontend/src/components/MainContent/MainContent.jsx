import React from "react";
import SectionScroller from "./SectionScroller";
import "../../styles/MainContent/MainContent.css";

const MainContent = ({ setCurrentSong }) => {
  const madeForYou = [
    { title: "Daily Mix 1", subtitle: "VALORANT, Suzy", image: "/default_cover.jpg" },
    { title: "Daily Mix 2", subtitle: "Justin Bieber, Billie", image: "/default_cover.jpg" },
  ];

  const jumpBackIn = [
    { title: "Kendrick Lamar", subtitle: "This is Kendrick", image: "/default_cover.jpg" },
    { title: "Queen", subtitle: "This is Queen", image: "/default_cover.jpg" },
  ];

  return (
    <div className="main-content">
      <SectionScroller title="Made For Khang Do" items={madeForYou} />
      <SectionScroller title="Jump back in" items={jumpBackIn} />
    </div>
  );
};

export default MainContent;