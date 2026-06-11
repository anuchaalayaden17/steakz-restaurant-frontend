import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

const demoAccounts = [
  { label: "Admin", email: "admin@steakz.com", password: "12345678" },
  { label: "HQ Manager - All Branches", email: "hq.manager@steakz.com", password: "12345678" },

  { label: "BM - London Central", email: "bm.london.central@steakz.com", password: "12345678" },
  { label: "Chef - London Central", email: "chef.london.central@steakz.com", password: "12345678" },
  { label: "Cashier - London Central", email: "cashier.london.central@steakz.com", password: "12345678" },
  { label: "Waiter - London Central", email: "waiter.london.central@steakz.com", password: "12345678" },

  { label: "BM - Manchester", email: "bm.manchester@steakz.com", password: "12345678" },
  { label: "Chef - Manchester", email: "chef.manchester@steakz.com", password: "12345678" },
  { label: "Cashier - Manchester", email: "cashier.manchester@steakz.com", password: "12345678" },
  { label: "Waiter - Manchester", email: "waiter.manchester@steakz.com", password: "12345678" },

  { label: "BM - Liverpool", email: "bm.liverpool@steakz.com", password: "12345678" },
  { label: "Chef - Liverpool", email: "chef.liverpool@steakz.com", password: "12345678" },
  { label: "Cashier - Liverpool", email: "cashier.liverpool@steakz.com", password: "12345678" },
  { label: "Waiter - Liverpool", email: "waiter.liverpool@steakz.com", password: "12345678" },

  { label: "BM - Birmingham", email: "bm.birmingham@steakz.com", password: "12345678" },
  { label: "Chef - Birmingham", email: "chef.birmingham@steakz.com", password: "12345678" },
  { label: "Cashier - Birmingham", email: "cashier.birmingham@steakz.com", password: "12345678" },
  { label: "Waiter - Birmingham", email: "waiter.birmingham@steakz.com", password: "12345678" },

  { label: "BM - Leeds", email: "bm.leeds@steakz.com", password: "12345678" },
  { label: "Chef - Leeds", email: "chef.leeds@steakz.com", password: "12345678" },
  { label: "Cashier - Leeds", email: "cashier.leeds@steakz.com", password: "12345678" },
  { label: "Waiter - Leeds", email: "waiter.leeds@steakz.com", password: "12345678" },

  { label: "BM - Bristol", email: "bm.bristol@steakz.com", password: "12345678" },
  { label: "Chef - Bristol", email: "chef.bristol@steakz.com", password: "12345678" },
  { label: "Cashier - Bristol", email: "cashier.bristol@steakz.com", password: "12345678" },
  { label: "Waiter - Bristol", email: "waiter.bristol@steakz.com", password: "12345678" },

  { label: "BM - Glasgow", email: "bm.glasgow@steakz.com", password: "12345678" },
  { label: "Chef - Glasgow", email: "chef.glasgow@steakz.com", password: "12345678" },
  { label: "Cashier - Glasgow", email: "cashier.glasgow@steakz.com", password: "12345678" },
  { label: "Waiter - Glasgow", email: "waiter.glasgow@steakz.com", password: "12345678" },
];

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@steakz.com");
  const [password, setPassword] = useState("Admin123!");
  const [message, setMessage] = useState("");

  const handleDemoAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAccount = demoAccounts.find(
      (account) => account.email === e.target.value
    );

    if (selectedAccount) {
      setEmail(selectedAccount.email);
      setPassword(selectedAccount.password);
      setMessage("");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "ADMIN") navigate("/admin");
      else if (user.role === "HM") navigate("/hm");
      else if (user.role === "BM") navigate("/bm");
      else if (user.role === "CHEF") navigate("/chef");
      else if (user.role === "CASHIER") navigate("/cashier");
      else if (user.role === "WAITER") navigate("/waiter");
      else setMessage("Unknown user role.");
    } catch (error) {
      setMessage("Login failed. Check email or password.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <Link to="/" className="login-logo">
          Steakz
        </Link>

        <h1>Welcome Back</h1>
        <p>Sign in to access the Steakz management dashboard.</p>

        <form onSubmit={handleLogin}>
          <label>Demo Account</label>
          <select onChange={handleDemoAccountChange} defaultValue="">
            <option value="">Select role and branch</option>

            {demoAccounts.map((account) => (
              <option key={account.email} value={account.email}>
                {account.label}
              </option>
            ))}
          </select>

          <label>Email Address</label>
          <input
            type="email"
            placeholder="admin@steakz.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Admin123!"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Sign In</button>
        </form>

        {message && <p className="login-error">{message}</p>}
      </div>
    </div>
  );
}

export default Login;