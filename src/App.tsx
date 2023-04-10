import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Main from './layouts/Main';
import ViewFilms from './pages/ViewFilms';
import ViewFilm from './pages/ViewFilm';
import SimilarFilms from './components/SimilarFilms';
import Home from './pages/Home';
import Register from './pages/Register';
import ScrollToTop from './components/ScrollToTop';
import { AuthContext } from './util/Contexts';
import Protected from './layouts/Protected';

function App() {
  const [activeUser, setActiveUser] = React.useState<number>(0)

  return (
    <div className="App">
      <Router>
        <AuthContext.Provider value={[activeUser, setActiveUser]}>
          <Main>
            <div style={{ minHeight: '85vh' }}>
              <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/home" element={<Home />}></Route>
                <Route path="/register" element={<Protected auth={false}><Register /></Protected>}></Route>
                <Route path="/films" element={<ViewFilms />}></Route>
                <Route path="/films/:filmId" element={<ViewFilm />}></Route>
                <Route path="/component/test" element={<SimilarFilms filmId={1} directorId={2} genreId={2} />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <ScrollToTop />
          </Main>
        </AuthContext.Provider>
      </Router>
    </div >
  );
}
export default App;