import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landing";
import Authentication from "./pages/Authentication";
import { AuthProvider } from "./contexts/AuthContext";
import VideoMeeetComponent from "./pages/VideoMeet";
import Home from "./pages/Home";
import History from "./pages/History";
import Layout from "./PageLayout/Layout"; // ✅ Layout includes Navbar + Footer
import NavOnly from "./PageLayout/NavOnly";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* These routes use layout (with Navbar and Footer) */}
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/history" element={<History />} />
          </Route>

          <Route element={<NavOnly />}>
            <Route path="/auth" element={<Authentication />} />
          </Route>

          {/* Special routes without layout */}
          <Route path="/" element={<LandingPage />} />

          <Route path="/:url" element={<VideoMeeetComponent />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
