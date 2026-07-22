import { Role } from '@prisma/client';
import { ForbiddenError } from './errors';

export const ROLE_HIERARCHY: Record<Role, number> = {
  SUPER_ADMIN: 4,
  ADMIN: 3,
  EDITOR: 2,
  USER: 1,
};

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function requireRole(userRole: Role, requiredRole: Role): void {
  if (!hasRole(userRole, requiredRole)) {
    throw new ForbiddenError(
      `Requires ${requiredRole} role or higher`
    );
  }
}

export function requireAnyRole(userRole: Role, allowedRoles: Role[]): void {
  if (!allowedRoles.includes(userRole)) {
    throw new ForbiddenError(
      `Requires one of these roles: ${allowedRoles.join(', ')}`
    );
  }
}

export function requireSuperAdmin(userRole: Role): void {
  if (userRole !== Role.SUPER_ADMIN) {
    throw new ForbiddenError('Requires SUPER_ADMIN role');
  }
}

export function requireAdminOrAbove(userRole: Role): void {
  requireRole(userRole, Role.ADMIN);
}

export function requireEditorOrAbove(userRole: Role): void {
  requireRole(userRole, Role.EDITOR);
}

export function canManageCourses(userRole: Role): boolean {
  return hasRole(userRole, Role.ADMIN);
}

export function canManageBlog(userRole: Role): boolean {
  return hasRole(userRole, Role.EDITOR);
}

export function canManageServices(userRole: Role): boolean {
  return hasRole(userRole, Role.ADMIN);
}

export function canManagePortfolio(userRole: Role): boolean {
  return hasRole(userRole, Role.EDITOR);
}

export function canManageTestimonials(userRole: Role): boolean {
  return hasRole(userRole, Role.EDITOR);
}

export function canManageFAQ(userRole: Role): boolean {
  return hasRole(userRole, Role.EDITOR);
}

export function canManagePricing(userRole: Role): boolean {
  return hasRole(userRole, Role.ADMIN);
}

export function canManageCareers(userRole: Role): boolean {
  return hasRole(userRole, Role.ADMIN);
}

export function canManageInquiries(userRole: Role): boolean {
  return hasRole(userRole, Role.ADMIN);
}

export function canManageMedia(userRole: Role): boolean {
  return hasRole(userRole, Role.EDITOR);
}
