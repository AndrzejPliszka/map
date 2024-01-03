const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.post('/', (req, res) => {
  res.json({ message: 'Hehehehehehe jest polaczenie z serwerem co nie' });
});

app.listen(port, () => {
  console.log(`Serwer działa ${port}`);
});
