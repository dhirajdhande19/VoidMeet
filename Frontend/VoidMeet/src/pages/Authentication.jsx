import axios from "axios";
import { useContext, useEffect, useState } from "react";
import "../styles/Authentication.css";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import { cardActionAreaClasses } from "@mui/material/CardActionArea";
import { AuthContext } from "../contexts/AuthContext";
import Snackbar from "@mui/material/Snackbar";
// import { Navbar } from "./landing";

const URL = `https://api.unsplash.com/photos/random?client_id=${import.meta.env.VITE_UNSPLASH_CLIENT_ID}`;

export default function Authentication() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get(URL).then((data) => {
          setData(data.data.urls.full);
          // console.log(data.data.urls.full);
          // Data (url) will be printed 2 times every time window reloads
          // because of StrictMode from main.jsx but there nothing to worry about its okay !!
        });
      } catch (e) {
        console.log("ERROR:", e.message);
      }
    };

    fetchData();
  }, []); // -> this '[]' (empty array) stops your program from going kaboom i.e. stops infinite calling to API

  let [form, setForm] = useState(true); // we set form = true coz we want to show login form by default
  // if form = true -> show login form &
  // if form = false -> show register form

  // function onLogin() {
  //   setForm(true);
  // }

  // function onRegister() {
  //   setForm(false);
  // }

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState();
  const [message, setMessage] = useState();
  const [open, setOpen] = useState(false);

  const { handleRegister, handleLogin } = useContext(AuthContext);

  let handleAuth = async () => {
    try {
      if (form === true) {
        /* i.e if login? */
        let result = await handleLogin(email, password);
        //console.log(result);
        setMessage(result);
        setError("");
      }
      if (form === false) {
        /* i.e if register? */

        if (!name || !email || !password) {
          return setError("Please provide data to continue");
        }

        let result = await handleRegister(name, email, password);
        console.log(result);
        setMessage(result);
        setOpen(true);
        setError("");
        setName("");
        setEmail("");
        setPassword("");
        setForm(true);
      }
    } catch (err) {
      //return console.log("err: ", err);
      let message = err.response.data.message;
      setError(message);
    }
  };

  return (
    <div className="container">
      <div className="img-section">
        <img src={data} />
      </div>
      <div className="auth-section">
        <div className="btns">
          <Button
            className="formBtn"
            variant={form ? "contained" : "outlined"}
            onClick={() => {
              setForm(true);
            }}
          >
            Login
          </Button>
          <Button
            className="formBtn"
            variant={form ? "outlined" : "contained"}
            onClick={() => {
              setForm(false);
            }}
          >
            Register
          </Button>
        </div>

        {/* checks conditons for "form" and renders component based on answer */}

        <Card className="form">
          <CardContent>
            <form action="">
              {form ? (
                <>
                  {" "}
                  {/* For Login */}
                  <h2>🔐Sign in to continue</h2>
                  <br />
                </>
              ) : (
                <>
                  {/* For Register */}
                  <h2>📝Create your account</h2>
                  <br />
                  <div>
                    <TextField
                      id="name"
                      label="Full Name"
                      variant="standard"
                      value={name}
                      required
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                  </div>
                  <br />
                </>
              )}

              <div>
                <TextField
                  id="email"
                  label="Email"
                  variant="standard"
                  value={email}
                  required
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <br />
              <div>
                <TextField
                  id="password"
                  label="Password"
                  variant="standard"
                  value={password}
                  required
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <br />
              <br />
              <p style={{ color: "red" }}>{error}</p>
              <br />
              <Button onClick={handleAuth} type="button" variant="outlined">
                {form ? "LogIn" : "Register"}
              </Button>
              <br />
              <p
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => {
                  setForm(!form);
                }}
              >
                {form ? "New Here? Register!" : "Already a User? Login!"}
              </p>
            </form>
          </CardContent>
        </Card>
        <Snackbar open={open} autoHideDuration={4000} message={message} />
      </div>
    </div>
  );
}

// export const Login = () => {
//   return (
//     <Card className="form">
//       <CardContent>
//         <form action="">
//           {" "}
//           <h2>🔐Sign in to continue</h2>
//           <br />
//           <div>
//             <TextField
//               id="standard-basic"
//               label="Email"
//               variant="standard"
//               onChange={(e) => {
//                 setEmail(e.target.value);
//               }}
//             />
//           </div>
//           <br />
//           <div>
//             <TextField
//               id="standard-basic"
//               label="Password"
//               variant="standard"
//               onChange={(e) => {
//                 setPassword(e.target.value);
//               }}
//             />
//           </div>
//           <br />
//           <br />
//           <Button type="submit" variant="outlined">
//             LogIn
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   );
// };

// export const Register = () => {
//   return (

//   );
// };

// const handleLogin = () => {
//   console.log("logged in");
// };

// const handelRegister = () => {
//   console.log("registered");
// };
