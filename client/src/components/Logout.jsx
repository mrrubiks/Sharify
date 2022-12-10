import Axios from "axios";
import {useNavigate} from 'react-router-dom';
function Logout() {
    const navigate = useNavigate();
    Axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/logout`, {}, { withCredentials: true })
        .then((response) => {
            if (response.status === 200) {
                navigate("/login");
            }
        });
    return null;    
}

export default Logout;