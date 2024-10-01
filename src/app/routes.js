import { lazy } from "react";
import { Navigate } from "react-router-dom";

import AuthGuard from "./auth/AuthGuard";
import { authRoles } from "./auth/authRoles";

import Loadable from "./components/Loadable";
import MatxLayout from "./components/MatxLayout/MatxLayout";



import materialRoutes from "app/views/material-kit/MaterialRoutes";

// SESSION PAGES
const NotFound = Loadable(lazy(() => import("app/views/sessions/NotFound")));
const JwtLogin = Loadable(lazy(() => import("app/views/sessions/JwtLogin")));
const JwtRegister = Loadable(lazy(() => import("app/views/sessions/JwtRegister")));
const ForgotPassword = Loadable(lazy(() => import("app/views/sessions/ForgotPassword")));

// E-CHART PAGE
const AppEchart = Loadable(lazy(() => import("app/views/charts/echarts/AppEchart")));
// DASHBOARD PAGE
const Analytics = Loadable(lazy(() => import("app/views/dashboard/Analytics")));
const Studentfirstpage = Loadable(lazy(() => import("./views/student/studentfirstpage")));
const Professorfirstpage = Loadable(lazy(() => import("./views/professor/professorfirstpage")));
const CreateProfessor = Loadable(lazy(() => import("./views/professor/createprofessor")));
const CreateStudent = Loadable(lazy(() => import("./views/student/createstudent")));
const routes = [
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [
      ...materialRoutes,
      // dashboard route
      { path: "/dashboard/default", element: <Analytics />, auth: authRoles.admin },
      // e-chart route
      { path: "/charts/echarts", element: <AppEchart />, auth: authRoles.editor },
      { path: "/dashboard/default", element: <Analytics />, auth: authRoles.admin },
      { path: "/student/studentfirstpage", element: <Studentfirstpage />, auth: authRoles.admin },
      { path: "/professor/professorfirstpage", element: <Professorfirstpage />, auth: authRoles.admin },
      { path: "/professor/createprofessor", element: <CreateProfessor />, auth: authRoles.admin },
      { path: "/professor/updateprofessor/:id", element: <CreateProfessor />, auth: authRoles.admin },
      { path: "/student/createstudent", element: <CreateStudent />, auth: authRoles.admin },
     
    ]
  },

  // session pages route
  { path: "/session/404", element: <NotFound /> },
  { path: "/session/signin", element: <JwtLogin /> },
  { path: "/session/signup", element: <JwtRegister /> },
  { path: "/session/forgot-password", element: <ForgotPassword /> },

  { path: "/", element: <Navigate to="/session/signin" /> },
  { path: "*", element: <NotFound /> }
];

export default routes;
