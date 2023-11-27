import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MyApp from './page';
import SearchPage from './searchpage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={MyApp} />
        <Route path="/second" Component={SearchPage} />
      </Routes>
    </Router>
  );
};

export default App;
