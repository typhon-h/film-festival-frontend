import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Main from './layouts/Main';
import ViewFilms from './pages/ViewFilms';

function App() {
  return (
    <div className="App">
      <Main>
        <Router>
          <div style={{ minHeight: '85vh' }}>
            <Routes>
              <Route path="/films" element={<ViewFilms />}></Route>
              <Route path="/component/test" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </Main>
    </div>
  );
}
export default App;