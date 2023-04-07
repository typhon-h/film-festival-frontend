import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Main from './layouts/Main';
import ViewFilms from './pages/ViewFilms';
import React from 'react';

function App() {
  const ref = React.useRef<HTMLDivElement>(null)


  const toggle_return_to_top = () => {
    if (ref.current) {
      if (document.documentElement.scrollTop > 50 || document.body.scrollTop > 50) {
        ref.current.style.display = "flex";
      } else {
        ref.current.style.display = "none";
      }
    }
  }

  window.addEventListener("scroll", toggle_return_to_top)


  return (
    <div className="App">
      <Router>
        <Main>
          <div style={{ minHeight: '85vh' }}>
            <Routes>
              <Route path="/films" element={<ViewFilms />}></Route>
              <Route path="/component/test" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>

          {/* Return to top button */}
          <div ref={ref} className='justify-content-center fixed-bottom m-4 col-2 col-md-1 m-md-5' style={{ display: 'none', left: 'auto' }}>
            <button onClick={() => { document.documentElement.scrollTop = 0; document.body.scrollTop = 0; }} className='btn btn-outline-info bg-light fs-2 col-12'><i className="bi bi-arrow-up-circle"></i></button>
          </div>
        </Main>
      </Router>
    </div >
  );
}
export default App;