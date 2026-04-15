import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { LoginPage } from "./feature/auth/pages/LoginPage"
import './index.css'
<<<<<<< Updated upstream


import { BrowserRouter } from 'react-router-dom';
import { ReactQueryProvider } from './app/providers/ReactQueryProvider';
import { AuthProvider } from './app/providers/AuthProvider';
import { AppRouter } from './app/router/AppRouter';

function App() {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AuthProvider>
    </ReactQueryProvider>
  );
=======

function App() {
  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
    </>
  )
>>>>>>> Stashed changes
}

export default App;