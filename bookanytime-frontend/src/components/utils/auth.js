export const getUserRole = () => {
  const userData = localStorage.getItem("user");

  if (!userData) {
    console.warn("No user data found in localStorage");
    return "user"; // Default role when no data is found
  }

  try {
    const user = JSON.parse(userData);
    console.log("User in auth:", user);
    return user?.isAdmin ? "admin" : "user";
  } catch (error) {
    console.error("Error parsing user data:", error);
    return "user"; // Default role in case of JSON error
  }
};
