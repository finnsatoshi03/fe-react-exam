import { User } from "../lib/types";

export async function login(
  email: string,
  password: string,
): Promise<User | null> {
  try {
    const response = await fetch(
      `http://localhost:8000/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
    );
    const users: User[] = await response.json();

    if (users.length > 0) {
      // Store user ID in localStorage for session management
      localStorage.setItem("currentUserId", users[0].id.toString());
      return users[0];
    }

    return null;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export function logout() {
  localStorage.removeItem("user");
}

export function getCurrentUser(): User | null {
  const userString = localStorage.getItem("user");
  return userString ? JSON.parse(userString) : null;
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem("user");
}
