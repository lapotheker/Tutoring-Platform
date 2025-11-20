/**
 * User Role Constants (mirrors backend)
 * 1 = Student, 2 = Tutor, 3 = Administrator
 */
export const ROLES = {
  STUDENT: 1,
  TUTOR: 2,
  ADMIN: 3,
};

export const ROLE_NAMES = {
  1: "Student",
  2: "Tutor",
  3: "Administrator",
};

export function getRoleName(role) {
  return ROLE_NAMES[role] || "Unknown";
}
