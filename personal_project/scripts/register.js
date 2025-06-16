document.getElementById("registerForm")?.addEventListener("submit", async function(e) {
  e.preventDefault();

  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const userType = document.getElementById("userType").value;

  if (!email || !password) {
    alert("All fields are required.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, userType })
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Registration failed");

    alert("Registration successful! You can now log in.");
    window.location.href = "login.html";
  } catch (err) {
    alert("Error: " + err.message);
  }
});
