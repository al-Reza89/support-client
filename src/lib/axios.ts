// // lib/axios.ts
// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   withCredentials: true,
// });

// let isRefreshing = false;

// // Add refresh token function
// const refreshToken = async () => {
//   try {
//     await axiosInstance.post("/api/auth/refresh");
//   } catch (error) {
//     throw new Error("Failed to refresh token");
//   }
// };

// // Add auth clearing function
// const clearAuth = () => {
//   // Clear cookies if needed
//   document.cookie =
//     "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
//   document.cookie =
//     "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
// };

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Only attempt refresh if error is 401 and it's not a refresh token request
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (!isRefreshing) {
//         isRefreshing = true;
//         originalRequest._retry = true;

//         try {
//           await refreshToken();
//           isRefreshing = false;
//           return axiosInstance(originalRequest);
//         } catch (refreshError) {
//           isRefreshing = false;
//           clearAuth();
//           window.location.href = "/signin";
//           return Promise.reject(refreshError);
//         }
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
