document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");
  
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const formData = new FormData(registerForm);
  
      const user = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        password: formData.get("password"),
        phone: formData.get("phone"),
        emergencyContact: formData.get("emergencyContact"),
        role: formData.get("role"),
      };
  
      // Validate input fields
      for (const [key, value] of Object.entries(user)) {
        if (!value) {
          alert(`${key} is required`);
          return;
        }
      }
  
      // Handle additional fields for doctor and patient
      if (user.role === "doctor") {
        user.license = formData.get("license");
        user.specialization = formData.get("specialization");
        user.languages = formData.get("languages");
        user.availability = formData.get("availability");
        user.hospital = formData.get("hospital");
        user.licenseFile = formData.get("licenseFile");
        user.boardDoc = formData.get("boardDoc");
        user.govId = formData.get("govId");
      } else if (user.role === "patient") {
        user.bloodGroup = formData.get("bloodGroup");
        user.medicalHistory = formData.get("medicalHistory");
        user.govIdPatient = formData.get("govIdPatient");
      }
  
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          body: JSON.stringify(user),
          headers: { "Content-Type": "application/json" },
        });
  
        const data = await response.json();
  
        if (response.ok) {
          alert("Registration successful! Please verify your OTP.");
          window.location.href = "/otp.html";
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Registration error:", error);
        alert("An error occurred. Please try again later.");
      }
    });
  });
  