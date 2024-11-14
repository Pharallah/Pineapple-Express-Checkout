import App from "./pages/App";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import { ContextProvider } from "./context/Context";

const routes = [
    {
        path: '/',
        element: (
            <ContextProvider>
                <App/>
            </ContextProvider>
        ),
        children: [
            {
                path: "/dashboard",
                element: <Dashboard/>,
            },
            {
                path: "/signup",
                element: <Signup/>,
            },
            {
                path: "/login",
                element: <Login/>,
            },
            {
                path: "/orders",
                element: <Orders/>,
            },
            {
                path: "/cart",
                element: <Cart/>,
            },
        ]
    },
]

export default routes;