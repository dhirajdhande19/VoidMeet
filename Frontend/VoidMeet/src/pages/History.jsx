import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import HomeIcon from "@mui/icons-material/Home";
import IconButton from "@mui/material/IconButton";
import CardContent from "@mui/material/CardContent";
import HistoryIcon from "@mui/icons-material/History";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import WithAuth from "../utils/withAuth";
import "../styles/History.css";

function History() {
  const { getUserHistory } = useContext(AuthContext);

  const [meetings, setMeetings] = useState([]);

  const routeTo = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getUserHistory();
        setMeetings(history);
      } catch (e) {
        // implement snackbar maybe
      }
    };
    fetchHistory();
  }, []);

  let formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <div className="history-container">
      {meetings.length === 0 ? (
        <h3>
          No History yet!
          <SentimentVeryDissatisfiedIcon />
        </h3>
      ) : (
        <h3>
          {" "}
          Your Meeting History
          <HistoryIcon />
        </h3>
      )}

      {meetings.length !== 0 ? (
        meetings.map((e, i) => {
          return (
            <div className="one-card" key={i}>
              <Card>
                <CardContent>
                  <p className="card-head">Meeting Details</p>
                  <p>Code: {e.meetingCode}</p>
                  <p>Date: {formatDate(e.date)}</p>
                </CardContent>
              </Card>
              <br />
            </div>
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
}

export default WithAuth(History);
