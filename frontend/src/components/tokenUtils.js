import jwtDecode from "jwt-decode";
import axios from "axios";

// Function to decode the token and extract the user ID
export const getUserIdFromToken = () => {
  const token = localStorage.getItem("authToken");

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.id; // Assuming the ID is stored in the token
    } catch (error) {
      console.error("Invalid token", error);
    }
  }
  return null;
};

// Function to fetch the current user details using the extracted ID
export const getCurrentUser = async () => {
  try {
    const userId = getUserIdFromToken();
    if (userId) {
      const response = await axios.get(
        `http://localhost:8080/api/user/${userId}`
      );
      return response.data.data; // Assuming the response structure contains `data`
    }
  } catch (error) {
    console.error("Error fetching current user:", error);
  }
  return null;
};
