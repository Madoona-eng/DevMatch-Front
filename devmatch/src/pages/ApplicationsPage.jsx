// pages/ApplicationsPage.js
import React from 'react';
import ApplicationsList from '../components/ApplicationsList';
import Navbar from '../components/Navbar';

const ApplicationsPage = () => {
  return (
    <>
      <Navbar />
      <ApplicationsList />
    </>
  );
};

export default ApplicationsPage;