import React from "react";

import "./App.css";
import "./error.css";

function App() {
  return (
    <div className="App">
      <div className="error">
        <div className="bgArea">
          <div className="contText">Preparing</div>
          <div className="bg">
            <img src="./pre_bg.jpg" alt="" />
          </div>
        </div>

        <div className="textArea">
          <div className="subject">Sorry,</div>
          <br />
          <div className="substance">
            홈페이지 리뉴얼 중입니다.
            <br />
            이용에 불편을 끼쳐드려 죄송합니다.
          </div>
          <ul className="afterSelect">
            <li>
              <a href="/">
                <div className="icon">
                  <img src="./images/goHome.png" alt="" />
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
