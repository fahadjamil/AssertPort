export function isLoggedIn() {
  return !!localStorage.getItem("authToken");
}
