import {BrowserRouter, Routes, Route} from "react-router-dom"; 
import { PublicRoutes } from "./PublicRoutes";
import { PrivateRoutes } from "./PrivateRoutes";
import { UnauthorizedPage } from "../pages/UnauthorizedPage";
import { AppAdminLayout } from "../components/layouts/AppAdminLayout";


export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route  element={<AppAdminLayout />}>
                <Route path= "/app/*" element={<PrivateRoutes/>}/>
                <Route path= "/unauthorized" element={<UnauthorizedPage/>}/>
                </Route>
                
                <Route path= "/*" element={<PublicRoutes/>}/>
            </Routes>
        </BrowserRouter>
    )
}