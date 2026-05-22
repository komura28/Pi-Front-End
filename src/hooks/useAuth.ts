import { useContext } from "react";
import {AuthContext} from "../contexts/AuthContextObject"

export function useAuth() {
    return useContext(AuthContext);
}