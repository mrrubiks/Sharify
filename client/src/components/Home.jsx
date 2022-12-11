import Axios from "axios";
let userId = "";
function Home() {
  console.log("Home");
  Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/isAuthenticated`, {
    withCredentials: true,
  }).then((res) => {
    if (res.data.isAuthenticated) {
      console.log(res.data);
      sessionStorage.setItem("userId", res.data.userId);
      window.location.href = process.env.REACT_APP_FRONTEND_URL + "/posts";
    } else {
      window.location.href = process.env.REACT_APP_FRONTEND_URL + "/login";
    }
  });
  return null;
}

export default Home;
export { userId };
