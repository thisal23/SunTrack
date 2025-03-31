import React, { useState } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import NavRepo from '../../components/Navbarreports/navrepo';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ReportsPage.css';

function Reportspage() {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <>
      <div>
        <NavBar />
      </div>
      <div className="box">
        <div className="repoNav">
          <NavRepo />
        </div>
        
      </div>
    </>
  );
}

export default Reportspage;
