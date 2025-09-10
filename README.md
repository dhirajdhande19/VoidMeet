# 🎥 VoidMeet – Real-Time Video Chat App

**VoidMeet** is a Zoom-like video conferencing application built with **React**, **Socket.IO**, and **WebRTC**.  
It enables users to create or join meeting rooms and engage in **real-time video, audio, and chat communication** 
using peer-to-peer connections powered by **PeerJS**.


---

## 🚀 Features

- **🎥 Join or Create Meetings:** Instantly create or join meeting rooms.  
- **🖥️ Screen Sharing:** Share your screen with participants in real time.  
- **🔊 Real-Time Video & Audio:** Powered by **WebRTC + PeerJS** for smooth communication.  
- **💬 Live Chat Messaging:** Chat with participants using **Socket.IO**.  
- **🔐 Basic Authentication:** Register and log in for a personalized experience.  
- **🎙️ Mic & Camera Controls:** Toggle your microphone and camera easily.  
- **📱 Responsive Design:** Clean, minimal interface across all devices.

---


<!-- 
## 🫶 Upcoming Features
- **⚡ Video Optimization:** More reliable video call and meeting logic.
- **🔐 User Authentication (JWT):** Secure login and user sessions.
- **🖥️ Fullscreen Video:** Pin any user’s video to fullscreen with toggle options.
- **🗑️ Meeting History Management:** Delete single or all meeting history entries.
- **📱 Responsive Design:** Seamless experience across mobile, tablet, and desktop.
- **📹 Screen Recording:** Record and save meetings within the app.
- **💬 Enhanced Chat:** Emojis, file sharing, and improved chat experience.
- **📅 Meeting Scheduling:** Calendar integration for scheduling and reminders.
- **🌙 Dark Mode:** Modern UI with a dark/light mode toggle.
- **🐳 Docker Support:** Containerized setup with `docker-compose` for quick deployment.
- **⚙️ CI/CD Pipelines:** Automated builds, testing, and deployment using GitHub Actions.
-->



---

## 🔐 Authentication

VoidMeet includes basic user authentication:
- Register/Login with username & password
- Passwords are hashed using `bcrypt`
- Access to Home & History is restricted to logged-in users

> Note: Uses simple session tokens (not JWT-based)

---

## 🛠️ Tech Stack

- **Frontend:** React, WebRTC, PeerJS, Socket.IO Client  
- **Backend:** Node.js, Express, Socket.IO, MongoDB (Atlas), bcrypt  
- **Deployment:** Frontend & Backend deployed separately on **Render**

---

## 🌐 Live App

👉 [Try VoidMeet](https://voidmeet.onrender.com)

>  🛰️ Backend and frontend are deployed separately on Render and connected using a simple environment toggle in code.

---

## 🙋‍♂️ Author

Built by [Dhiraj Dhande](https://github.com/dhirajdhande19)  
As a learning project to explore WebRTC, PeerJS, and real-time socket communication.
