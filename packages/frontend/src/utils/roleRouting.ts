import { ROLES } from "shared";
import type { Role } from "shared";

export function dashboardPathForRole(role: Role): string {
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
