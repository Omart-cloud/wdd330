document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch("https://wdd330-backend-mj9r.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("housingUser", JSON.stringify(data.user));
      alert("Login successful!");
      if (data.user.userType === "agent") {
        window.location.href = "dashboard.html";
      } else if (data.user.userType === "client") {
        window.location.href = "client_dashboard.html";
      } else {
        window.location.href = "index.html";
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  });
});

// this function is in auth.js also
async function registerUser(email, password, userType = "client") {
  try {
    const response = await fetch("https://wdd330-backend-mj9r.onrender.com/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, userType })
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Registration failed");

    alert("Registration successful! Please login.");
    window.location.href = "login.html";
  } catch (err) {
    alert("Registration error: " + err.message);
  }
}
