// const getAuthHeader = () => {
//   const token = localStorage.getItem("accessToken");
//   if (token) {
//     return { headers: { Authorization: `Bearer ${token}` } };
//   }
//   return {};
// };

// export default getAuthHeader;
const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    return { headers: { Authorization: `Bearer ${token}` } };
  }
  return {};
};

export default getAuthHeader;