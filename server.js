const express = require('express');
const app = express();
const path = require('path');

const publicDirectory = path.join(__dirname, 'dist'); // Assuming 'build' is your build output directory

app.use(express.static(publicDirectory));

// Serve JSX files with the correct MIME type
app.get('*.jsx', (req, res) => {
  const requestedFilePath = path.join(publicDirectory, req.path);

  res.sendFile(requestedFilePath, {
    headers: {
      'Content-Type': 'text/javascript', // Change to 'text/javascript' for JSX files
    },
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});