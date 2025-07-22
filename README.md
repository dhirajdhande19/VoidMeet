# 🎥 VoidMeet – Real-Time Video Chat App

VoidMeet is a Zoom-like video chat app built with **React**, **Socket.IO**, and **WebRTC**. 
It allows users to join a room and video chat with others in real time using peer-to-peer connections.

---

## 🚀 Features

- Join or create a meeting room
- Screen sharing support 
- Real-time video & audio (WebRTC + PeerJS)
- Chat messaging with Socket.IO
- Basic user authentication (register + login)
- Toggle mic and camera
- Minimal, responsive interface

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
