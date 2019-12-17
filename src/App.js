import React from 'react';
import './App.css';
import Canvas from './Canvas.js';
import Animation from "./Animation.js";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <Canvas width="1024" height="1024" frequency='128' color="#e1f762" fadeEnd="1000" fadeStart="700" />
            </header>
        </div>
    );
}

export default App;
