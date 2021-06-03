import React, { Component } from 'react';
import MainCalendar from './components/MainCalendar';

import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <h1>Adi's calendar</h1>
                <MainCalendar />
            </div>
        );
    }
}

export default App;
