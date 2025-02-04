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

export async function forgotPassword(email: string): Promise<boolean> {
  try {
    const response = await fetch(
      `http://localhost:8000/users?email=${encodeURIComponent(email)}`,
    );
    const users: User[] = await response.json();

    return users.length > 0;
  } catch (error) {
    console.error("Forgot password error:", error);
    throw error;
  }
}

// export async function getCurrentUser(): Promise<User | null> {
//     const userId = localStorage.getItem('currentUserId');
//     if (!userId) return null;

//     try {
//         const response = await fetch(`http://localhost:8000/users/${userId}`);
//         return await response.json();
//     } catch (error) {
//         console.error("Get current user error:", error);
//         return null;
//     }
// }

export function logout() {
  localStorage.removeItem("currentUserId");
}

export function getCurrentUser(): User | null {
  const userString = localStorage.getItem("currentUserId");
  return userString ? JSON.parse(userString) : null;
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem("currentUserId");
}
