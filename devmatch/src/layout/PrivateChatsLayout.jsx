import { Outlet } from "react-router-dom";
import ShadowDOM from "react-shadow";
import { useThemeStore } from "../store/useThemeStore"; 
import Navbarchart from '../components/Navbarchat'
const PrivateChatsLayout = () => {
  const { theme } = useThemeStore(); 

  return (
    <ShadowDOM.div mode="open">
      <link rel="stylesheet" href="/tailwind-chat-built.css" />
      <div className="app-container" data-theme={theme}>
        <Navbarchart/>
        <Outlet />
      </div>
    </ShadowDOM.div>
  );
};

export default PrivateChatsLayout;
