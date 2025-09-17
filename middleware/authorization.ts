import type { User } from "../models"
import type { AuthenticatedRequest } from "./authentication"
import type { ServerResponse } from "http"

export const authorizeRoles = (...roles: string[]) => {
    return async (
        req: AuthenticatedRequest,
        res: ServerResponse,
    ): Promise<boolean> => {
        const userRole = (req.user as User).role

        if (!userRole || !roles.includes(userRole)) {
            res.statusCode = 403
            res.end(JSON.stringify({ message: "Forbidden"}))
            return false
        }

        return true
    }
}