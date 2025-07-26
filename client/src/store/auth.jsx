import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

// Create context
export const AuthContext = createContext();

// Helper function to get token from cookies
const getTokenFromCookies = () => {
    const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="));
    return cookieValue ? cookieValue.split("=")[1] : null;
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(getTokenFromCookies());
    const [user, setUser] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isDeveloper, setIsDeveloper] = useState(false);
    const [isUser, setIsUser] = useState(false);
    const [isVendor, setIsVendor] = useState(false);
    // const navigate = useNavigate();
    const authorizationToken = `Bearer ${token}`;
    // const navigate = useNavigate();

    // Function to store token in cookies
    const storeTokenInCookies = (serverToken) => {
        setToken(serverToken);
        document.cookie = `authToken=${serverToken}; path=/; max-age=3600; secure; samesite=strict`;
    };

    // API URL from environment variables
    const API = import.meta.env.VITE_APP_URI_API;
    // console.log("API OF BACKEND ",API);

    // Check if the user is logged in
    let isLoggedIn = !!token;
    // console.log("isLoggedIn", isLoggedIn);

    // Logout functionality
    const LogoutUser = () => {
        setToken(null);
        setUser(null);
        setIsAdmin(false);
        setIsDeveloper(false);
        setIsUser(false);
        setIsVendor(false);


        // Clear cart and table number from localStorage
        localStorage.removeItem("cart");

        // Remove token from cookies
        document.cookie = "authToken=; path=/; max-age=0";
        toast.success(`Logout Successfully`);

        setTimeout(() => {
            window.location.href = "/";
        }, 500);
    };

    // JWT Authentication - fetch current logged-in user data
    const userAuthentication = async () => {
        if (!token) return;
        try {
            setIsLoading(true);
            const response = await axios.get(`${API}/api/auth/current-user`, {
                headers: {
                    Authorization: authorizationToken,
                },
                withCredentials: true,
            });
            if (response.status == 200) {
                const data = response.data;
                // console.log('data: ',data)
                setUser(data.user);

            } else {
                console.error("Error fetching user data");
            }
        } catch (error) {
            console.log("Error fetching user data", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Effect to handle initial user authentication if token exists
    useEffect(() => {
        if (token ) {
            userAuthentication();
        } else {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        // Reset all role flags first
        setIsAdmin(false);
        // setisUser(false);
        setIsDeveloper(false);
        // setIsSessionActive(false);
        // Check and set roles based on the user object
        if (user) {
            const { isDeveloper, isAdmin, isUser, isVendor } = user;
            // console.log('User: ',user)
            setIsAdmin(isAdmin); // Admin if any of the roles is true
            setIsDeveloper(isDeveloper);
            setIsUser(isUser);
            setIsVendor(isVendor);
            // setisUser(isUser || false);
            setIsDeveloper(isDeveloper || false);
            if (isDeveloper) {
                console.log(`This is Developer`);
            }
        }
    }, [user]);



    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                storeTokenInCookies,
                LogoutUser,
                user,
                authorizationToken,
                isLoading,
                isAdmin,
                isDeveloper,
                API,
                isUser,
                isVendor,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use AuthContext
export const useAuth = () => {
    const authContextValue = useContext(AuthContext);
    if (!authContextValue) {
        throw new Error("useAuth must be used within the AuthProvider");
    }
    return authContextValue;
};
