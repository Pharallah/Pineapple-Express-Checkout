import App from "./pages/App";
import Account from "./pages/Account";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Cart from "./pages/Cart";
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
        children: [
            {
                path: "cart",
                element: <Cart />,
            },
            {
                path: "account",
                element: (
                    <ContextProvider>
                        <Account />
                    </ContextProvider>
                ),
            },
        ]
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