# smart-Autonomous-luggage-carring-robot
final year project to display the web view on the controller side and on server side.



🧳 Smart Autonomous Luggage Carrier Robot

An AI-powered autonomous robot designed to carry luggage and follow the user seamlessly. This project integrates computer vision, object detection, and IoT controls to create a hands-free luggage carrier that intelligently navigates environments.

🚀 Features

✅ Autonomous Following – Tracks and follows the user using OpenCV and MediaPipe.

✅ Obstacle Detection – Uses sensors (Ultrasonic/IR) to avoid collisions.

✅ Object Detection – Live COCO-SSD model for real-time object tracking.

✅ Web Interface – HTML, CSS, and JavaScript-based interface with:

Webcam access & live video stream

Bounding box visualization with coordinates

Snapshot & video recording

✅ Firebase Integration – Sends detection data and control signals to ESP32.

✅ Embedded Control – ESP32 + Arduino Uno to drive motors and hardware.

🛠️ Tech Stack
Software

Python (OpenCV, MediaPipe, TensorFlow.js)

JavaScript (COCO-SSD, Firebase SDK)

React (for UI expansion - optional)

Firebase Realtime Database

Hardware

ESP32-WROOM

Arduino Uno

Ultrasonic Sensors (for obstacle detection)

Motor Driver (L298N / similar)

DC Motors & Chassis

Rechargeable Battery Pack

📐 System Architecture

Vision Module (Laptop/Onboard Pi): Captures video → detects person/luggage → calculates (x, y) coordinates.

Communication Module: Coordinates sent via Wi-Fi → ESP32 → Arduino Uno.

Control Module: Arduino drives motors according to received coordinates.

Web Interface: Allows live monitoring, object detection, and manual override.

🔧 Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/smart-autonomous-luggage-carrier.git
cd smart-autonomous-luggage-carrier

2️⃣ Backend (Python + OpenCV)
pip install opencv-python mediapipe tensorflow firebase-admin
python main.py

3️⃣ Web Interface

Open index.html in your browser to access the detection dashboard.

4️⃣ ESP32 & Arduino Setup

Flash ESP32 with Firebase integration code.

Connect Arduino Uno via Serial (TX/RX).

Upload motor control sketch to Arduino.

📸 Demo

👉
Live object detection interface

Robot following user in real-time

📌 Future Improvements

🔋 Power optimization for longer battery life

🌐 Full mobile app integration

🤖 SLAM-based navigation for better environment mapping

🎤 Voice assistant control

👨‍💻 Contributors

Atharv Shete – Hardware & Software Integration

⭐ Support

If you like this project, please ⭐ the repo and share feedback!

## Robot File Flowchart

![File](/assembly bot.jpg)
