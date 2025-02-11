function Header() {
  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('isAuthenticated');
    window.location.href = "/login"; 
  }; 

  return (
    <header className=" bg-gradient-to-br from-red-600 to-orange-300 text-white py-4 px-6 flex justify-between items-center shadow-md z-50">
      <h1 className="text-xl font-bold">Attendance System</h1>
      <button 
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Logout
      </button>
    </header>
  );
}

export default Header;