

import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar/NavBar';

const Alldriver = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const token = localStorage.getItem('token');

  // Fetch drivers from API
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        //const fleetManagerId =309; // Get from auth context or props
        
        const response = await fetch(
  'http://localhost:8000/api/drivers',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    }
  }
);

        if (!response.ok) {
          throw new Error('Failed to fetch drivers');
        }

        const data = await response.json();
        setDrivers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  // Rest of your component remains the same...
  const handleViewClick = (driver) => {
    setSelectedDriver({ ...driver });
    setIsViewModalOpen(true);
  };

  const handleEditClick = (driver) => {
  setSelectedDriver({
    ...driver,
    id: driver.id,               // for users table update
    userId: driver.id            // same value reused for driverdetails
  });
  setIsEditModalOpen(true);
};


const handleDeleteClick = async (driver) => {
  const confirmDelete = window.confirm(`Are you sure you want to delete ${driver.driverName}?`);

  if (!confirmDelete) return;

  try {
    const response = await fetch(`http://localhost:8000/api/drivers/${driver.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to delete driver');
    }

    // ✅ Remove from UI
    setDrivers(prev => prev.filter(d => d.driverId !== driver.driverId));

    alert('✅ Driver deleted successfully!');
  } catch (error) {
    console.error('Delete error:', error);
    alert('❌ Failed to delete driver: ' + error.message);
  }
};








  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedDriver(null);
  };











const handleUpdateDriver = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/drivers', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        id: selectedDriver.id,               // For users table
        userId: selectedDriver.userId,       // For driverdetails table
        driverUsername: selectedDriver.driverUsername,
        driverName: selectedDriver.driverName,
        licenseNo: selectedDriver.licenseNo,
        contactNo: selectedDriver.contactNo
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to update driver');
    }

    const updatedData = await response.json();
    console.log(updatedData.message);

    alert('✅ Driver updated successfully!');
    // Optional: refetch driver list here instead of local update
    setDrivers(prevDrivers =>
      prevDrivers.map(driver =>
        driver.driverId === selectedDriver.driverId ? selectedDriver : driver
      )
    );

    handleCloseModal();
  } catch (error) {
    console.error('Update error:', error);
    alert('Failed to update driver: ' + error.message);
  }
};






  const handleInputChange = (field, value) => {
    setSelectedDriver(prev => ({
      ...prev,
      [field]: value
    }));
  };


const filteredDrivers = drivers.filter(driver =>
    driver.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.driverUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.licenseNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div style={styles.loading}>Loading drivers...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (

    
    <div style={styles.container}>
       <div>
        <NavBar />
      </div>

      <div style={styles.mainContent}>
    {/* Your table controls and table go here */}
       </div>

      
       <div style={styles.tableControls}>
        <div style={styles.entriesControl}>
          <select 
            value={entriesPerPage} 
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            style={styles.select}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span style={styles.controlLabel}> entries per page</span>
        </div>

        <div style={styles.searchControl}>
          <label style={styles.searchLabel}>Search:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search drivers..."
            style={styles.searchInput}
          />
        </div>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.headerCell}>Driver ID</th>
              <th style={styles.headerCell}>Driver Username</th>
              <th style={styles.headerCell}>Driver Name</th>
              <th style={styles.headerCell}>License No</th>
              <th style={styles.headerCell}>Contact No</th>
              <th style={styles.headerCell}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.slice(0, entriesPerPage).map((driver, index) => (
              <tr key={driver.driverId} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                <td style={styles.cell}>{driver.driverId}</td>
                <td style={styles.cell}>{driver.driverUsername}</td>
                <td style={styles.cell}>{driver.driverName}</td>
                <td style={styles.cell}>{driver.licenseNo}</td>
                <td style={styles.cell}>{driver.contactNo}</td>
                <td style={styles.actionCell}>
                  <button 
                    style={styles.viewBtn}
                    onClick={() => handleViewClick(driver)}
                  >
                    View
                  </button>
                  <button 
                    style={styles.editBtn}
                    onClick={() => handleEditClick(driver)}
                  >
                    Edit
                  </button>
                  <button 
                    style={styles.deleteBtn}
                    onClick={() => handleDeleteClick(driver)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedDriver && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Driver Details</h3>
              <button style={styles.closeButton} onClick={handleCloseModal}>×</button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.viewContent}>
                <div style={styles.photoSection}>
                  <div style={styles.photoContainer}>
                    <svg width="120" height="120" viewBox="0 0 120 120" style={styles.avatarSvg}>
                      <circle cx="60" cy="60" r="60" fill="#e9ecef"/>
                      <circle cx="60" cy="45" r="20" fill="#6c757d"/>
                      <path d="M20 100 Q20 75 60 75 Q100 75 100 100 Q100 110 60 110 Q20 110 20 100 Z" fill="#6c757d"/>
                    </svg>
                  </div>
                  <p style={styles.photoLabel}></p>
                </div>
                
                <div style={styles.detailsSection}>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Driver ID:</span>
                    <span style={styles.detailValue}>{selectedDriver.driverId}</span>
                  </div>
                  
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Driver Username:</span>
                    <span style={styles.detailValue}>{selectedDriver.driverUsername}</span>
                  </div>
                  
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Driver Name:</span>
                    <span style={styles.detailValue}>{selectedDriver.driverName}</span>
                  </div>
                  
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>License No:</span>
                    <span style={styles.detailValue}>{selectedDriver.licenseNo}</span>
                  </div>
                  
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Contact No:</span>
                    <span style={styles.detailValue}>{selectedDriver.contactNo}</span>
                  </div>
                </div>
              </div>
              
              <div style={styles.viewActions}>
                <button style={styles.closeViewBtn} onClick={handleCloseModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedDriver && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Edit Driver Details</h3>
              <button style={styles.closeButton} onClick={handleCloseModal}>×</button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Driver ID:</label>
                <input
                  type="text"
                  value={selectedDriver.driverId}
                  readOnly
                  style={styles.readonlyInput}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Driver Username:</label>
                <input
                  type="text"
                  value={selectedDriver.driverUsername}
                  onChange={(e) => handleInputChange('driverUsername', e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Driver Name:</label>
                <input
                  type="text"
                  value={selectedDriver.driverName}
                  onChange={(e) => handleInputChange('driverName', e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>License No:</label>
                <input
                  type="text"
                  value={selectedDriver.licenseNo}
                  onChange={(e) => handleInputChange('licenseNo', e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Contact No:</label>
                <input
                  type="tel"
                  value={selectedDriver.contactNo}
                  onChange={(e) => handleInputChange('contactNo', e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.formActions}>
                <button style={styles.updateBtn} onClick={handleUpdateDriver}>
                  Update Driver
                </button>
                <button style={styles.cancelBtn} onClick={handleCloseModal}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },


  mainContent: {
  padding: '60px 20px 20px 20px', // Top: 60px, Right: 20px, Bottom: 20px, Left: 20px
    },

    
  pageHeader: {
    marginBottom: '20px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'normal',
    color: '#333',
    margin: 0
  },
  tableControls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '4px'
  },
  entriesControl: {
    display: 'flex',
    alignItems: 'center',
    color: 'black',
    

  },
  select: {
    padding: '3px',
    border: '1px solid #ddd',
    borderRadius: '3px',
    marginLeft: '-10px',
  },
  controlLabel: {
    marginLeft: '5px',
    fontSize: '14px'
  },
  searchControl: {
    display: 'flex',
    alignItems: 'center'
  },
  searchLabel: {
    marginRight: '10px',
    fontSize: '14px'
  },
  searchInput: {
    padding: '5px 8px',
    border: '1px solid #ddd',
    borderRadius: '3px',
    fontSize: '14px'
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '4px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  headerRow: {
    backgroundColor: '#f8f9fa'
  },
  headerCell: {
    padding: '12px 15px',
    textAlign: 'left',
    borderBottom: '2px solid #dee2e6',
    fontWeight: '600',
    color: '#495057',
    fontSize: '14px'
  },
  evenRow: {
    backgroundColor: '#f8f9fa'
  },
  oddRow: {
    backgroundColor: 'white'
  },
  cell: {
    padding: '12px 15px',
    borderBottom: '1px solid #dee2e6',
    fontSize: '14px',
    color: '#495057'
  },
 actionCell: {
  padding: '12px 15px',
  borderBottom: '1px solid #dee2e6',
  fontSize: '14px',
  color: '#495057',
  display: 'flex',
  gap: '5px', // Space between buttons
},
  viewBtn: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '3px',
    marginRight: '5px',
    cursor: 'pointer',
    fontSize: '12px',
    
  },
  editBtn: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '6px 6px',
    borderRadius: '3px',
    marginRight: '5px',
    cursor: 'pointer',
    fontSize: '12px'
    
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '8px',
    width: '500px',
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflow: 'auto'
    
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #dee2e6',
    marginTop: '50px' // Add this to push the modal down
  },
  modalTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#333'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
    padding: 0,
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalBody: {
    padding: '20px'
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
    color: '#031324ff'

  },
  readonlyInput: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: '#f8f9fa',
    color: '#6c757d',
    boxSizing: 'border-box'
  },
  formActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px'
  },
  updateBtn: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    flex: 1
  },
  cancelBtn: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    flex: 1
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '16px',
    color: '#666'
  },
  error: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '16px',
    color: '#dc3545',
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: '4px'
  },
  // View Modal Styles
  viewContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px'
  },
  photoSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '30px'
  },
  photoContainer: {
    border: '3px solid #dee2e6',
    borderRadius: '50%',
    padding: '10px',
    backgroundColor: 'white',
    marginBottom: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  },
  avatarSvg: {
    borderRadius: '50%'
  },
  photoLabel: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
    fontWeight: '500'
  },
  detailsSection: {
    width: '100%',
    maxWidth: '400px'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f0f0f0'
  },
  detailLabel: {
    fontWeight: '600',
    color: '#333',
    fontSize: '14px',
    flex: '1'
  },
  detailValue: {
    color: '#666',
    fontSize: '14px',
    flex: '1',
    textAlign: 'right',
    wordBreak: 'break-word'
  },
  viewActions: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '25px',
    paddingTop: '20px',
    borderTop: '1px solid #dee2e6'
  },
  closeViewBtn: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  }
};

export default Alldriver;
