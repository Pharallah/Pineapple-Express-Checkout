import App from "./pages/App";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { ContextProvider } from "./context/Context";
import OrderHistory from "./pages/OrderHistory";

const routes = [
    {
        path: '/',
        element: ( 
            <ContextProvider>
                <App/>
            </ContextProvider>
        ),
    },
    {
        path: "/signup",
        element: (
            <ContextProvider>
                <Signup />
            </ContextProvider>
        ),
    },
    {
        path: "/login",
        element: (
            <ContextProvider>
                <Login />
            </ContextProvider>
        ),
    },
    {
        path: "/dashboard",
        element: (
            <ContextProvider>
                <Dashboard />
            </ContextProvider>
        ),
    },
    {
        path: "/orders",
        element: (
            <ContextProvider>
                <OrderHistory />
            </ContextProvider>
        ),
    },
    
]

export default routes;