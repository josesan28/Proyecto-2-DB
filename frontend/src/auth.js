const KEY = "token";
const KEY_USER = "empleado";

export const authStorage = {
  save(token, empleado) {
    localStorage.setItem(KEY, token);
    localStorage.setItem(KEY_USER, JSON.stringify(empleado));
  },
  clear() {
    localStorage.removeItem(KEY);
    localStorage.removeItem(KEY_USER);
  },
  getToken() { return localStorage.getItem(KEY); },
  getEmpleado() {
    const raw = localStorage.getItem(KEY_USER);
    return raw ? JSON.parse(raw) : null;
  },
  isLoggedIn() { return !!localStorage.getItem(KEY); },
};