const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());

const uploadFolder = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

const storage = multer.diskStorage({
  destination: uploadFolder,
  filename: (_, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

app.post('/upload', upload.single('video'), (req, res) => {
  const name = req.query.name || 'Unknown';
  const email = req.query.email || 'No Email';
  console.log(`🎥 Uploaded by ${name} (${email}): ${req.file.originalname}`);
  res.send({ status: 'success', path: req.file.path });
});

app.use('/uploads', express.static(uploadFolder));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
