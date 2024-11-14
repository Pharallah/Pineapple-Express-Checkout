import React from "react";
import routes from './routes'
import "./index.css";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter(routes, {
    future: {
      v7_relativeSplatPath: true,
    },
  });

const root = createRoot(document.getElementById("root"));

root.render(<RouterProvider 
    router={router}
    future={{
        v7_startTransition: true,
      }} />
);
