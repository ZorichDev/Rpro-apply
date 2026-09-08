import { ROLES } from "shared";
export function dashboardPathForRole(role) {
    switch (role) {
        case ROLES.STUDENT:
            return "/student";
        case ROLES.INSTITUTION:
            return "/institution";
        case ROLES.VENDOR:
            return "/vendor";
        case ROLES.RECRUITMENT_PARTNER:
            return "/partner";
        default:
            return "/";
    }
}
