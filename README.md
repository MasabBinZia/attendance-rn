<p>
  <img src="https://github.com/user-attachments/assets/a9eb5bc5-f5ba-4732-a3f2-5f5eaf6a6e1e" alt="Elite Accounting Hub Logo" width="100" height="100">
</p>

# Agri Time - Employee Attendance Mobile App

Agri Time is an attendance tracking mobile application designed for in-house employees within an organization. It helps organizations monitor and manage employee attendance efficiently through mobile devices.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Tech Stack](#tech-stack)
- [Firebase Setup](#firebase-setup)
- [Contributing](#contributing)
- [License](#license)

## Features

- Employee clock-in and clock-out functionality.
- Real-time attendance tracking and storage using Firebase.
- Mobile-friendly interface built with React Native and Expo.
- Secure authentication with Firebase Authentication.
- Employee attendance history and analytics.

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/MasabBinZia/attendance-rn.git
   ```

2. Navigate into the project directory:

   ```bash
   cd agri-time
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the Expo development server:

   ```bash
   expo start
   ```

5. Scan the QR code in the Expo Go app on your mobile device to run the app.

## Usage

1. Employees can log in using their credentials.
2. Once logged in, they can easily clock in or clock out with a single tap.
3. Attendance data is stored in Firebase, allowing managers to track attendance in real-time.
4. The app provides an attendance history and summary for each employee.

## Tech Stack

- **React Native**: For building the cross-platform mobile app.
- **Expo**: For rapid development and testing on mobile devices.
- **Firebase**: For real-time database, authentication, and cloud storage.
- **TypeScript**: For type-safe and scalable development.

## Firebase Setup

1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
2. Add Firebase to your React Native project by following the instructions [here](https://firebase.google.com/docs/web/setup).
3. Set up Firebase Authentication to manage user sign-ins.
4. Set up a Firestore database to store attendance records.
5. Add your Firebase configuration to your project as shown below:

   ```typescript
   // firebaseConfig.ts
   export const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

## Contributing

Contributions are welcome! Please fork this repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
