import React from 'react';

import DateSlider from './component/DateSlider';
import { categories } from './data';
import './App.scss';

const App: React.FC = () => {
  return (
    <div className="App">
      <DateSlider categories={categories} />
    </div>
  );
}

export default App;
