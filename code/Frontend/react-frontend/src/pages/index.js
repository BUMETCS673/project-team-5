import React from "react";
import { Outlet } from "react-router-dom";
//This component  serves as a placeholder for rendering child routes, allowing the content associated with specific routes to be displayed when navigated to
export default function Index() {
  return <Outlet />;
}
