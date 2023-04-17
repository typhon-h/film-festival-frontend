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
import { AuthContext, OnlineContext } from './util/Contexts';
import Protected from './layouts/Protected';
import Login from './pages/Login';
import axios from 'axios';
import Logout from './pages/Logout';
import CreateFilm from './pages/CreateFilm';
import EditFilm from './pages/EditFilm';
import Profile from './pages/Profile';

function App() {
  const [activeUser, setActiveUser] = React.useState<number>(localStorage.getItem('activeUser') as unknown as number)
  axios.defaults.headers.common = {
    'x-authorization': localStorage.getItem('token')
  }


  const [isOnline, setIsOnline] = React.useState(navigator.onLine)

  // Handler modified to only 'trigger' on the change from offline>online to preserve page content
  React.useEffect(() => {
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", handleStatusChange)
    window.addEventListener("offline", handleStatusChange)

    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);

    }
  }, [isOnline])

  return (
    <div className="App">
      <Router>
        <OnlineContext.Provider value={React.useMemo(() => [isOnline], [isOnline])} >
          <AuthContext.Provider value={React.useMemo(() => [activeUser, setActiveUser], [activeUser, setActiveUser])}>
            <Main>
              <div style={{ minHeight: '85vh' }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/register" element={<Protected auth={false}><Register /></Protected>} />
                  <Route path="/login" element={<Protected auth={false}><Login /></Protected>} />
                  <Route path="/logout" element={<Protected><Logout /></Protected>} />
                  <Route path="/profile" element={<Protected><Profile /></Protected>}></Route>
                  <Route path="/films" element={<ViewFilms />} />
                  <Route path="/films/:filmId" element={<ViewFilm />} />
                  <Route path="/films/create" element={<Protected><CreateFilm /></Protected>} />
                  <Route path="/films/:filmId/edit" element={<Protected><EditFilm /></Protected>} />
                  <Route path="/component/test" element={<SimilarFilms filmId={1} directorId={2} genreId={2} />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <ScrollToTop />
            </Main>
          </AuthContext.Provider>
        </OnlineContext.Provider>
      </Router>
    </div >
  );
}
export default App;