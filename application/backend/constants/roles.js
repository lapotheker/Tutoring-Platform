/**
 * User Role Constants
 * 1 = Student, 2 = Tutor, 3 = Administrator
 */
const ROLES = {
  STUDENT: 1,
  TUTOR: 2,
  ADMIN: 3,
};

/**
 * Role names mapping (for display/logging)
 */
const ROLE_NAMES = {
  1: "Student",
  2: "Tutor",
  3: "Administrator",
};

/**
 * Get role name from role number
 */
function getRoleName(role) {
  return ROLE_NAMES[role] || "Unknown";
}

/**
 * Check if role is valid
 */
function isValidRole(role) {
  return role === ROLES.STUDENT || role === ROLES.TUTOR || role === ROLES.ADMIN;
}

module.exports = {
  ROLES,
  ROLE_NAMES,
  getRoleName,
  isValidRole,
};
