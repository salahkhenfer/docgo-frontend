import { useAppContext } from "../AppContext";
import LandingPage from "../LandingPage/LandingPage";
import UserDashboard from "./UserDashboard";

const Home = () => {
    const { isAuth, user } = useAppContext();

    // Show UserDashboard for authenticated users, LandingPage for guests
    return isAuth && user ? <UserDashboard /> : <LandingPage />;
};

export default Home;
