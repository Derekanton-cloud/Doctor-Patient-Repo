exports.getDashboardData = (req, res) => {
    try {
      if (req.user.role === "doctor") {
        return res.json({ message: "Welcome to the Doctor Dashboard" });
      } else if (req.user.role === "patient") {
        return res.json({ message: "Welcome to the Patient Dashboard" });
      } else {
        return res.status(403).json({ message: "Access denied" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  };
  