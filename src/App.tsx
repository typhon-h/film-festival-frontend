import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Main from './layouts/Main';
import ViewFilms from './pages/ViewFilms';
import ViewFilm from './pages/ViewFilm';
import DirectorCardPlaceholder from './components/placeholder/DirectorCardPlaceholder';
import ViewFilmPlaceholder from './pages/placeholder/ViewFilmPlaceholder';
import ReviewsPanelPlaceholder from './components/placeholder/ReviewsPanelPlaceholder';

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
              <Route path="/films/:filmId" element={<ViewFilm />}></Route>
              <Route path="/component/test" element={<ReviewsPanelPlaceholder />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>

          {/* Return to top button */}
          <div ref={ref} className='justify-content-center fixed-bottom m-4 m-md-5' style={{ display: 'none', left: 'auto' }}>

            <span role={'button'} onClick={() => { document.documentElement.scrollTop = 0; document.body.scrollTop = 0; }} className='fs-1 text-info p-0'><i className="bi bi-arrow-up-circle-fill "></i></span>
          </div>
        </Main>
      </Router>
    </div >
  );
}
export default App;