import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Tìm div có class là 'center-content'
    const scrollContainer = document.querySelector('.center-content');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    } else {
      // Nếu không thấy thì scroll toàn trang
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
