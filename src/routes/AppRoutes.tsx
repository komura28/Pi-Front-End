import {BrowserRouter, Routes, Route} from "react-router-dom"; 
import { PublicRoutes } from "./PublicRoutes";
import { PrivateRoutes } from "./PrivateRoutes";
import { UnauthorizedPage } from "../pages/UnauthorizedPage";

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path= "/*" element={<PublicRoutes/>}/>
                <Route path= "/app/*" element={<PrivateRoutes/>}/>
                <Route path= "/unauthorized" element={<UnauthorizedPage/>}/>
            </Routes>
        </BrowserRouter>
    )
}