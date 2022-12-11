import Axios from "axios";
function Logout() {
  Axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/api/logout`,
    {},
    { withCredentials: true }
  ).then((response) => {
    if (response.status === 200) {
      window.location.href = process.env.REACT_APP_FRONTEND_URL + "/login";
    }
  });
  return null;
}

export default Logout;
