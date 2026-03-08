import React from "react";
import "./App.css";
import CesiumViewer from "./components/CesiumViewer";

function App(): React.ReactElement {
  return (
    <div className="App">
      <CesiumViewer />
    </div>
  );
}

export default App;
