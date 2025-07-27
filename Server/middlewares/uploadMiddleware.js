const multer = require("multer");
const fs = require("fs");

const directories = [
  "uploads/banner",
  "uploads/about",
  "uploads/blog",
  "uploads/footer",
  "uploads/footerThree",
  "uploads/sociallink",
  "uploads/contact",
];

directories.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const bannerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/banner");
  },
  filename: (req, file, cb) => {
    cb(null, `banner-${Date.now()}${file.originalname}`);
  },
});

const aboutStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/about");
  },
  filename: (req, file, cb) => {
    const sectionId = req.body.sectionId;
    cb(null, `${sectionId}-${Date.now()}${file.originalname}`);
  },
});

const blogStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/blog");
  },
  filename: (req, file, cb) => {
    cb(null, `blog-${Date.now()}${file.originalname}`);
  },
});

const footerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/footer");
  },
  filename: (req, file, cb) => {
    cb(null, `footer-${Date.now()}${file.originalname}`);
  },
});

const footerStorageThree = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/footerThree");
  },
  filename: (req, file, cb) => {
    cb(null, `footerThree-${file.fieldname}${file.originalname}`);
  },
});

const linkStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/sociallink");
  },

  filename: (req, file, cb) => {
    cb(null, `sociallink-${Date.now()}${file.originalname}`);
  },
});

const contactStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/contact");
  },
  filename: (req, file, cb) => {
    cb(null, `contacts-${Date.now()}${file.originalname}`);
  },
});

const uploadBanner = multer({ storage: bannerStorage });
const uploadAbout = multer({ storage: aboutStorage });
const uploadBlog = multer({ storage: blogStorage });
const uploadFooter = multer({ storage: footerStorage });
const uploadFooterThree = multer({ storage: footerStorageThree });
const uploadLink = multer({ storage: linkStorage });
const uploadContact = multer({ storage: contactStorage });

module.exports = {
  uploadBanner,
  uploadAbout,
  uploadBlog,
  uploadFooter,
  uploadFooterThree,
  uploadLink,
  uploadContact,
};
