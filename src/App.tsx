import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Main from './layouts/Main';
import FilmCard from './components/FilmCard';

function App() {
  return (
    <div className="App">
      <Main>
        <Router>
          <div>
            <Routes>
              <Route path="/component/test" element={<FilmCard title={"Test"} filmId={1} genreId={1} directorId={4} directorFirstName={'FName'} directorLastName={'LName'} releaseDate={'12-07-2002'} ageRating={'PG'} rating={6.33} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </Main>
    </div>
  );
}
export default App;