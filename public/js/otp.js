document.addEventListener("DOMContentLoaded", () => {
    const otpForm = document.getElementById("otp-form");
  
    otpForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const email = document.getElementById("email").value.trim();
      const otp = document.getElementById("otp").value.trim();
  
      if (!email || !otp) {
        alert("Please fill in all fields");
        return;
      }
  
      try {
        const response = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          alert("OTP verified successfully!");
          window.location.href = "/login.html";
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("OTP verification error:", error);
        alert("An error occurred. Please try again later.");
      }
    });
  
    // Resend OTP
    document.getElementById("resend-otp").addEventListener("click", async () => {
      const email = document.getElementById("email").value.trim();
  
      if (!email) {
        alert("Please enter your email to resend OTP");
        return;
      }
  
      try {
        const response = await fetch("/api/auth/resend-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          alert("OTP resent successfully!");
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Resend OTP error:", error);
        alert("An error occurred. Please try again later.");
      }
    });
  });
  