import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function About() {
  const Navigation = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      Navigation("/login")
    }
  }, []);
  return (
    <>
      <h1>About</h1>


    </>
  )
}

export default About
