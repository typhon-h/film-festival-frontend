import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Main from './layouts/Main';
import ViewFilms from './pages/ViewFilms';
import React from 'react';

function App() {
  const ref = React.useRef<HTMLButtonElement>(null)


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
          <button ref={ref} onClick={() => { document.documentElement.scrollTop = 0; document.body.scrollTop = 0; }} className='btn btn-light justify-content-center fixed-bottom fs-1 border m-4 col-2 col-md-1 m-md-5' style={{ display: 'none', left: 'auto' }}><i className="bi bi-caret-up-fill"></i></button>

        </Main>
      </Router>
    </div >
  );
}
export default App;