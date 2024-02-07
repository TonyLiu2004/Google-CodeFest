const express = require('express');
const app = express();
const path = require('path');

const publicDirectory = path.join(__dirname, 'build'); // Assuming 'build' is your build output directory

app.use(express.static(publicDirectory));

app.get('*.jsx', (req, res) => {
  const requestedFilePath = path.join(publicDirectory, req.path);

  res.sendFile(requestedFilePath, {
    headers: {
      'Content-Type': 'application/javascript',
    },
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});