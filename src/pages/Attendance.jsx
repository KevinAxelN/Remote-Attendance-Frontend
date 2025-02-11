import { useState, useEffect } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ConfirmationModal from "../components/ConfirmationModal";
import InformationModal from '../components/InformationModal';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SuccessModal from '../components/SuccessModal';
import LoadingOverlay from '../components/LoadingOverlay';

function Attendance() {
  const userId = localStorage.getItem('userId');
  const [view, setView] = useState('attendance');
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [date, setDate] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  const [picture, setPicture] = useState(null);
  const [checkinTimeToday, setCheckinTimeToday] = useState(null);
  const [checkoutTimeToday, setCheckoutTimeToday] = useState(null);
  const [checkinImage, setCheckinImage] = useState(null);
  const [username, setUsername] = useState('');
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showInformationModal, setShowInformationModal] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState('');
  const [isNeedReloadPage, setIsNeedReloadPage] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isNeedReloadPage) {
      window.location.reload();
      setIsNeedReloadPage(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNeedReloadPage]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.post(
          'http://localhost:8080/user',
          {
            p_id: userId
          }, 
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );

        if (response.data) {
          setUsername(response.data.username);
        } else {
          console.warn("User not found!");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleCheckout = async () => {
    setIsLoading(true);

    if (!userId) {
      setErrorMessage('User ID not found!');
      setShowInformationModal(true);
      setIsLoading(false);
      return;
    }
  
    const formData = {
      p_userId: userId,
      p_checkOutDate: new Date().toISOString().split('T')[0].replace(/-/g, ''),
      p_checkOutTime: new Date().toLocaleTimeString()
    };
    
    try {
      const response = await axios.post(
        'http://localhost:8080/checkout',
        formData, 
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      setSuccessMessage(`${response.data.message}`);
      setShowSuccessModal(true);
    } catch (error) {
      setErrorMessage(`${error.response?.data?.error || error.response?.data?.message || "An error occurred when check-out!"}`);
      setShowInformationModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckin = async () => {
    setIsLoading(true);

    if (!userId) {
      // alert('User ID not found!');
      setErrorMessage('User ID not found!');
      setShowInformationModal(true);
      return;
    }
    
    if (!picture) {
      // alert('Please select a photo before check-in!');
      setErrorMessage('Please select a photo before check-in!');
      setShowInformationModal(true);
      return;
    }
  
    const formData = {
      p_userId: userId,
      p_checkInDate: new Date().toISOString().split('T')[0].replace(/-/g, ''),
      p_checkInTime: new Date().toLocaleTimeString(),
      p_picture: picture
    };
    
    try {
      const response = await axios.post(
        'http://localhost:8080/checkin',
        formData, 
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      console.log('RESPONSEE: ' , response);

      if (response.data.message) {
        setSuccessMessage(`${response.data.message}`);
        setShowSuccessModal(true);
      } else if (response.data.error.message) {
        setErrorMessage(`${response.data.error.message || "An error occurred!"}`);
        setShowInformationModal(true);
      } else {
        setErrorMessage(`An error occurred!`);
        setShowInformationModal(true);
      }
      
    } catch (error) {
      console.error('Check-in error:', error);
      // alert(`Something wrong when check-in: ${error.response?.data?.error || "An error occurred!"}`);
      setErrorMessage(`${error.response?.data?.error || error.response?.data?.message  || "An error occurred while checkin!"}`);
      setShowInformationModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckAttendance = async () => {
    setIsLoading(true);

    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
  
    try {
      const response = await axios.get(`http://localhost:8080/getAttendance`, {
        params: { p_userId: userId, p_checkinTime: today },
        headers: { "Content-Type": "application/json" }
      });
  
      setCheckinTimeToday(response.data.checkInTime || 'you have\'nt checkin today');
      setCheckoutTimeToday(response.data.checkOutTime || 'you have\'nt checkout today');
  
      if (response.data.picture) {
        setCheckinImage(`data:image/jpeg;base64,${response.data.picture}`);
      }
  
    } catch (error) {
      console.error("Error fetching attendance:", error);
      // alert("Failed to get Attendances.");
      console.log('ERROR MESSAGE', error);
      setErrorMessage(`${error.response?.data?.error || error.response?.data?.message || "Error fetching attendancse!"}`);
      setShowInformationModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPicture(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div>
      <Header />
     
      <div className="flex flex-col items-start justify-start p-6 h-[calc(100vh-4rem)] gap-6 bg-gray-100 ">
        
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-orange-400 to-red-600 text-white shadow-lg rounded-2xl w-full p-6">
          <h2 className="text-3xl font-bold mb-2 tracking-wide drop-shadow-lg">Attendance Page</h2>
          <p className="text-lg font-medium bg-white text-orange-600 px-4 py-2 rounded-xl shadow-md">
            Welcome to the attendance system, <span className="font-bold">{username}</span>!
          </p>
        </div>
        
        <div className='grid lg:grid-cols-2 gap-4 bg-gray-100 p-6 w-full'>
          
          <div className="items-center justify-center bg-white shadow-md rounded-lg py-6 px-[10%] w-full">
            <div className="text-xl font-semibold mb-2">{date}</div>
            <div className="text-3xl font-bold text-green-600 border-2 border-green-500 rounded-lg px-6 py-4 bg-black">
              {time}
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6 w-full">
            {view === 'attendance' ? (
              <div className='flex flex-col items-center'>
                <h2 className="text-2xl font-bold">Checkin / Checkout</h2>
                <p className="mb-4">Don't forget to checkin and checkout today!</p>

                <div className="flex gap-4">
                  
                  <button 
                    onClick={() => {
                      if (!imagePreview) {
                        // alert("Please upload an attendance picture before check-in!");
                        setErrorMessage(`Please upload an attendance picture before check-in!`);
                        setShowInformationModal(true);
                        return;
                      }
                      setShowCheckinModal(true);
                    }} 
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Check In
                  </button>
                  
                  <button 
                    onClick = {() => {
                      setShowCheckoutModal(true);
                    }} 
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Check Out
                  </button>
                
                </div>

                <h2 className='mt-4'>Please upload attendance picture before checkin:</h2>
                <div className="w-full flex justify-center">
                  <input 
                    type="file" 
                    accept="image/png, image/jpeg, image/jpg" 
                    className="p-2 border rounded w-full max-w-sm"
                    onChange={handleFileChange} 
                  />
                </div>

                {imagePreview && (
                  <div className="flex justify-center my-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-56 h-42 object-contain rounded-md shadow"
                    />
                  </div>
                )}

                <button
                  onClick={() => {
                    setView('checkAttendance');
                    handleCheckAttendance();
                  }}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Check My Attendance
                </button>
              </div>
            ) : (
              <div className='flex flex-col items-center'>
                <h2 className="text-2xl font-bold">My Attendance</h2>
                <p className="mb-4">Here are your attendance records Today.</p>

                <p>Check-in Time: {checkinTimeToday}</p>
                <p>Check-out Time: {checkoutTimeToday}</p>

                <h2 className='mt-4'>My Attendance Picture:</h2>
                <div className='mb-2 border '>
                  {checkinImage && <img src={checkinImage} className="w-64 h-48 object-contain rounded-md shadow" alt="Check-in photo"  />}
                </div>

                <button onClick={() => setView('attendance')} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">Back</button>
              </div>
            )}
          </div>
        
        </div>
      
      </div>

      <ConfirmationModal
        isOpen={showCheckinModal}
        onClose={() => setShowCheckinModal(false)}
        onConfirm={() => {
          handleCheckin();
          setShowCheckinModal(false);
        }}
        title="Check-in Confirmation"
        message="Are you sure you want to check in with this picture?"
        imagePreview={imagePreview}
      />
      <ConfirmationModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onConfirm={() => {
          handleCheckout();
          setShowCheckoutModal(false);
        }}
        title="Check-out Confirmation"
        message="Are you sure you want to check out?"
      />
      <InformationModal
        show={showInformationModal}
        onHide={() => setShowInformationModal(false)}
        icon={<AssignmentIcon style={{ fontSize: "3rem" }} />}
        header={""}
        item={errorMessage}
      />
      <SuccessModal
        show={showSuccessModal}
        onHide={() => {
          setShowSuccessModal(false);
          setIsNeedReloadPage(true);
        }}
        icon={
          <CheckCircleIcon style={{ fontSize: "3rem" }}/>
        }
        header={""}
        item={successMessage}
      />
      <LoadingOverlay isLoading={isLoading} />
    </div>
  );
}

export default Attendance;