import "../styles/Home.css";

import { useContext, useEffect, useRef, useState } from "react";
import WithAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

import IconButton from "@mui/material/IconButton";
import RestoreIcon from "@mui/icons-material/Restore";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ReplayIcon from "@mui/icons-material/Replay";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Divider from "@mui/material/Divider";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import { nanoid } from "nanoid";

function Home() {
  let navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");

  const { addToUserHistory } = useContext(AuthContext);

  let handleJoinVideoCall = async () => {
    if (!meetingCode) {
      setMeetingCode(url);
      await addToUserHistory(url);
      navigate(`/${url}`);
      return;
    }
    await addToUserHistory(meetingCode);
    navigate(`/${meetingCode}`);
  };

  const textRef = useRef();

  let copyText = async () => {
    try {
      await navigator.clipboard.writeText(textRef.current.textContent);
    } catch (e) {
      throw e;
    }
  };

  let [url, setUrl] = useState(null);

  useEffect(() => {
    let getCode = () => {
      setUrl(nanoid(6));
    };
    getCode();
  }, []);

  let getCode = () => {
    setUrl(nanoid(6));
  };

  return (
    <>
      <div className="home-container">
        <div className="home-hero">
          <h2>Click. Connect. Collaborate 🚀</h2>
          <img src="/hero-home.png" />
        </div>
        <div className="generate-code">
          <h3>Generate Meeting Code?</h3>
          <div className="generate-code-inline">
            <div className="generate-code-inp">
              <IconButton onClick={getCode}>
                <ReplayIcon />
              </IconButton>
              <Divider orientation="vertical" flexItem />
              <p ref={textRef}>{url}</p>
              <Divider orientation="vertical" flexItem />
              <IconButton onClick={copyText}>
                <ContentCopyIcon />
              </IconButton>
            </div>
            <div>
              <Button
                onClick={handleJoinVideoCall}
                size="small"
                variant="contained"
              >
                join
              </Button>
            </div>
          </div>
        </div>
        <div className="have-code">
          <h3>Have Meeting Code?</h3>
          <div>
            <input
              type="text"
              placeholder="Enter code"
              onChange={(e) => setMeetingCode(e.target.value)}
            />
            {/* <TextField
            onChange={(e) => setMeetingCode(e.target.value)}
            variant="standard"
            label="Enter Meeting Code"
          /> */}
            <Button
              onClick={handleJoinVideoCall}
              size="small"
              variant="contained"
            >
              Join
            </Button>
          </div>
        </div>
        <div className="how-it-works">
          <h2>How It Works?</h2>
          <div>
            <div className="step-1">
              <h3>Step 1</h3>
              <p>
                Enter meeting code or just generate one if u don't have any!
              </p>
            </div>
            <div className="step-2">
              <h3>Step 2</h3>
              <p>Enter the name u want to join with.</p>
            </div>
            <div className="step-3">
              <h3>Step 3</h3>
              <p>That's all Room Created!</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default WithAuth(Home);

// let fnx = () => {
//   <div className="container">
//     <div>
//       {" "}
//       <TextField
//         onChange={(e) => setMeetingCode(e.target.value)}
//         variant="standard"
//         label="Enter Meeting Code"
//       />
//       <Button onClick={handleJoinVideoCall} variant="contained">
//         Join
//       </Button>
//     </div>
//   </div>;
// };
