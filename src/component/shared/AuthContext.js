import axios from "axios";
import { createContext, useState } from "react";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (Cookies.get("accessToken")) {
      let tokens = Cookies.get("accessToken");
      return jwt_decode(tokens);
    }
    return null;
  });

  const login = async (payload) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/login`,
      {
        email: payload.email,
        password: payload.password,
      }
    );

    const {
      access_token,
      refresh_token,
      access_token_expired_at,
      refresh_token_expired_at,
    } = response.data;

    Cookies.set("accessToken", access_token, {
      expires: new Date(access_token_expired_at),
    });
    Cookies.set("refreshToken", refresh_token, {
      expires: new Date(refresh_token_expired_at),
    });

    setUser(jwt_decode(access_token));
  };

  const navigate = useNavigate();

  const logout = async () => {
    await axios.delete(
      `${process.env.REACT_APP_API_URL}/logout/${user.userID}`
    );

    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
