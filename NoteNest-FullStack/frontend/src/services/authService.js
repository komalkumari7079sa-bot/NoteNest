import api from "./api";

// Messages returned by the ORIGINAL backend (routes/user.route.js and
// midddlewere/auth.middlewere.js). The backend answers errors with HTTP 200
// and a { msg } body, so we compare the message text.
const MSG = {
  registered: "User registered successfully",
  loggedIn: "User login successfully",
  wrongCredentials: "wrong credientials", // spelling comes from the backend
  signupFirst: "Signup first",
  dashboardOk: "Welcome to Note Application",
};

export async function register({ name, email, password }) {
  const { data } = await api.post("/user/register", { name, email, password });
  if (data?.msg === MSG.registered) return;
  throw new Error(
    "Registration failed. Check that MongoDB is connected, then try again."
  );
}

export async function login({ email, password }) {
  const { data } = await api.post("/user/login", { email, password });
  if (data?.token) return data.token;
  if (data?.msg === MSG.signupFirst) {
    throw new Error("No account uses this email yet. Create an account first.");
  }
  if (data?.msg === MSG.wrongCredentials) {
    throw new Error("That email and password don't match.");
  }
  throw new Error("Sign in failed. Please try again.");
}

// Calls the protected GET /dashboard route to check the saved token.
// Returns "valid", "invalid" or "offline" (backend unreachable - we do not
// sign people out just because the server is down).
export async function verifySession() {
  try {
    const { data } = await api.get("/dashboard");
    return data?.msg === MSG.dashboardOk ? "valid" : "invalid";
  } catch {
    return "offline";
  }
}

// Calls the public GET /home route. Used by the connection badge.
export async function pingBackend() {
  try {
    const { data } = await api.get("/home", { timeout: 6000 });
    return data?.msg === MSG.dashboardOk;
  } catch {
    return false;
  }
}
