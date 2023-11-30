import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Auction from './components/Auction';
import JSONToIPFS from './components/JSONToIPFS';
import { Body } from "./components";
import BidNotifications from "./components/Bids";
// Import other components you want to navigate to

function App() {
    return (
        <Router>
            <NavBar />
            <BidNotifications />
            <Body>
                <Routes>
                    <Route path="/" element={<Auction />} />
                    <Route path="/auction" element={<Auction />} />
                    <Route path="/json" element={<JSONToIPFS />} />
                    {/* Add more Route components here for additional pages */}
                </Routes>
            </Body>
        </Router>
    );
}

export default App;
