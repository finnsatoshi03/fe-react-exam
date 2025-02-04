import { User } from "../lib/types";
import { API_BASE_URL } from "./apiURL";

export async function login(
  email: string,
  password: string,
): Promise<User | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
    );
    const users: User[] = await response.json();
    if (users.length > 0) {
      localStorage.setItem("currentUserId", users[0].id.toString());
      localStorage.setItem("currentUser", JSON.stringify(users[0]));
      return users[0];
    }
    return null;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function forgotPassword(email: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/users?email=${encodeURIComponent(email)}`,
    );
    const users: User[] = await response.json();

    return users.length > 0;
  } catch (error) {
    console.error("Forgot password error:", error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const userStr = localStorage.getItem("currentUser");
  if (!userStr) return null;

  try {
    const user = JSON.parse(userStr) as User;
    return user;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
}

export function logout() {
  localStorage.removeItem("currentUserId");
  localStorage.removeItem("currentUser");
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem("currentUser");
}
