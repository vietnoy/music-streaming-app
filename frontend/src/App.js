import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import ScrollToTop from "./components/ScrollToTop";
function App() {
    return (
        <Router>
            <ScrollToTop />
            <Routes>
                <Route path="/*" element={<Home />} />
                <Route path="/library" element={<Library />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </Router>
    );
}

export default App;

// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/*" element={<Home />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

