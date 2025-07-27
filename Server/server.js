require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const bannerRoutes = require("./routes/bannerRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const blogRoutes = require("./routes/blogRoutes");
const userRoutes = require("./routes/userRoutes");
const footerRoutes = require("./routes/footerRoutes");
const footerTwoRoutes = require("./routes/footerTwoRoutes");
const footerThreeRoutes = require("./routes/footerThreeRoutes");
const socialLinksRoutes = require("./routes/socialLinkRoutes");
const contactRoutes = require("./routes/contactRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const headingRoutes = require("./routes/headingRoutes");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use("/uploads", express.static("uploads"));

connectDB();

app.use("/api", bannerRoutes);
app.use("/api", aboutRoutes);
app.use("/api", blogRoutes);
app.use("/api", userRoutes);
app.use("/api", footerRoutes);
app.use("/api", footerTwoRoutes);
app.use("/api", footerThreeRoutes);
app.use("/api", socialLinksRoutes);
app.use("/api", contactRoutes);
app.use("/api", enquiryRoutes);
app.use("/api", headingRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
