import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import InformationModal from '../components/InformationModal';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SuccessModal from '../components/SuccessModal';
import LoadingOverlay from '../components/LoadingOverlay';

function Login({ setIsAuthenticated, setUserId }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [showInformationModal, setShowInformationModal] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState('');

  const handleLogin = async () => {
    setIsLoading(true);

    if (!username || !password ) {
      // alert('Username atau password wajib diisi');
      setErrorMessage(`Username and Password are required`);
      setIsLoading(false);
      setShowInformationModal(true);
      return;
    }

    // if (username === 'kevin' && password === '123') {
    //   setIsAuthenticated(true);
    //   setUserId(2); // data.userId    
    //   localStorage.setItem('userId', 2);
    //   navigate('/attendance');
    // } else {
    //   alert('Username or password is incorrect!');
    // }

    try {
      const response = await axios.post('http://localhost:8080/login', { username, password });
      const data = response.data;
      
      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('userId', data.user.user_id);
        navigate('/attendance');
      } else {
        // alert('Username or password is incorrect!');
        setErrorMessage(`Username or password is incorrect!`);
        setIsLoading(false);
        setShowInformationModal(true);
      }
      setIsLoading(false);

    } catch (error) {
      setIsLoading(false);

      console.error('Login error:', error);
      // alert('Something wrong, please try again!');
      setErrorMessage(`${error.response?.data?.error || error.response?.data?.message  || "An error occurred!"}`);
      setIsLoading(false);
      setShowInformationModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (

    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-red-400 to-orange-400">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">

        <div className="bg-redToOrange text-white text-center py-4 rounded-2xl">
          <h1 className="text-2xl font-bold">Remote Attendance</h1>
          <p className="text-md text-blue-200">Check in and out easily</p>
        </div>

        <div className="p-6">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleLogin}
            className="w-full inline-flex justify-center rounded-lg border bg-green-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:mt-0 sm:text-sm"
          >
            Login
          </button>
        </div>
      </div>
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

export default Login;