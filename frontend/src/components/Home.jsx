import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useState, useEffect } from "react"; // Import useState and useEffect

const Home = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null); // State to hold user data

  // Function to fetch user details using the ID from token
  const fetchUserDetails = async () => {
    try {
      const userId = getUserIdFromToken();
      console.log("USER ID: ", userId);
      if (userId) {
        const response = await axios.get(
          `http://localhost:8080/api/user/${userId}`
        );
        console.log("RESPONSE: ", response.data);

        if (response.data && response.data.data) {
          setUserDetails(response.data.data); // Update the state with user data
        }
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // Decode token to extract id
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken) {
          console.log("DECODED", decodedToken);
          const id = decodedToken.id;
          return id;
        }
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
    return null;
  };

  useEffect(() => {
    fetchUserDetails(); // Fetch user details on component mount
  }, []);

  console.log("USER DETAILS: ", userDetails);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Welcome to Your Dashboard!
        </h2>
        {userDetails ? (
          <div>
            <p className="text-center text-gray-600 mb-4">
              Hello, {userDetails.name} {/* Displaying user details */}
            </p>
            <p className="text-center text-gray-600 mb-4">
              Email: {userDetails.email}
            </p>
          </div>
        ) : (
          <p className="text-center text-gray-600 mb-4">
            Loading user details...
          </p>
        )}
        <div className="space-y-4">
          <button
            onClick={() => navigate("/reset-password")}
            className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            Reset Password
          </button>
          <button
            onClick={() => handleLogout()}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  // eslint-disable-next-line no-unreachable
  const handleLogout = () => {
    // Clear the token and navigate to the login page
    localStorage.removeItem("authToken");
    navigate("/login");
  };
};

export default Home;
