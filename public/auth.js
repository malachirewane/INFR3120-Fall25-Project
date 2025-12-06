document.addEventListener("DOMContentLoaded", async () => {
  const loginLink = document.getElementById("nav-login");
  const logoutForm = document.getElementById("nav-logout-form");
  const userSpan = document.getElementById("nav-user");

  // Check if a user is logged in to show/hide nav items
  try {
    const res = await fetch("/auth/me");
    if (res.ok) {
      const user = await res.json();
      if (loginLink) loginLink.style.display = "none";
      if (logoutForm) logoutForm.style.display = "inline-block";
      if (userSpan) {
        userSpan.textContent = user.email;
        userSpan.style.display = "inline-block";
      }
    } else {
      if (loginLink) loginLink.style.display = "inline-block";
      if (logoutForm) logoutForm.style.display = "none";
      if (userSpan) userSpan.style.display = "none";
    }
  } catch (err) {
    // If check fails assume logged out
    if (loginLink) loginLink.style.display = "inline-block";
    if (logoutForm) logoutForm.style.display = "none";
    if (userSpan) userSpan.style.display = "none";
  }

  // Logout handler (navbar)
  if (logoutForm) {
    logoutForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await fetch("/auth/logout", { method: "POST" });
      window.location.href = "/";
    });
  }

  // Login form handler
  const loginForm = document.getElementById("login-form");
  const loginMessage = document.getElementById("login-message");

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (loginMessage) loginMessage.textContent = "";

      const formData = new FormData(loginForm);
      const body = {
        email: formData.get("email"),
        password: formData.get("password"),
      };

      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (loginMessage) {
          loginMessage.textContent = data.error || "Login failed.";
        } else {
          alert(data.error || "Login failed.");
        }
        return;
      }

      window.location.href = "/";
    });
  }

  // Register form handler
  const registerForm = document.getElementById("register-form");
  const registerMessage = document.getElementById("register-message");

  if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (registerMessage) registerMessage.textContent = "";

      const formData = new FormData(registerForm);
      const body = {
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
      };

      const res = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (registerMessage) {
          registerMessage.textContent = data.error || "Registration failed.";
        } else {
          alert(data.error || "Registration failed.");
        }
        return;
      }

      window.location.href = "/";
    });
  }
});
