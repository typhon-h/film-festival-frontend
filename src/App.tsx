import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Main from './layouts/Main';

function App() {
  return (
    <div className="App">
      <Main>
        <Router>
          <div>
            <Routes>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </Main>
    </div>
  );
}
export default App;