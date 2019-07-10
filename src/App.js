import React from "react";

// TradingView 컴포넌트 임포트
import { TVChartContainer } from "./components/TVChartContainer/index";

import "./App.css";
import "./error.css";

function App() {
  return (
    <div className="App">
      <TVChartContainer />
    </div>
  );
}

export default App;
