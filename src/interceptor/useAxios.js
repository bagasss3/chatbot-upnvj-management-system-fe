import axios from "axios";
import jwt_decode from "jwt-decode";
import { useContext } from "react";
import AuthContext from "../component/shared/AuthContext";
import Cookies from "js-cookie";

const axiosInstance = axios.create({});

const useAxios = () => {
  const { setUser } = useContext(AuthContext);

  axiosInstance.interceptors.request.use(async (config) => {
    const currAccessToken = Cookies.get("accessToken");
    if (currAccessToken) {
      config.headers.Authorization = `Bearer ${currAccessToken}`;
      return config;
    }
    const currRefreshToken = Cookies.get("refreshToken");
    try {
      let response = await axios.post(
        `${process.env.REACT_APP_API_URL}/refresh-token`,
        { refreshtoken: currRefreshToken }
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

      config.headers.Authorization = `Bearer ${access_token}`;
      return config;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Cookies.remove("refreshToken");
        setUser(null);
        // Redirect to the login page
        window.location.href = "/login";
      }
      throw error;
    }
  });

  return axiosInstance;
};

export default useAxios;
