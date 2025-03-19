const express = require('express');
const dataProcessing = require('./lib/reqBodyProcessing');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server works fine!');
});

app.post('/api/data', async (req, res) => {
  try {
    const data = req.body;
    if (!data || !data.action || !data.content) {
      return res.status(400).json({ error: 'Request body is missing action or content' });
    }

    const result = await dataProcessing.process(data);

    switch (data.action) {
      case 'create':
        return res.status(201).json({ message: 'Created point successfully!', result });
      case 'update':
        return res.status(200).json({ message: `Update LAT and LONG successfully!`, result });
      case 'delete':
        return res.status(200).json({ message: `Delete point successfully!`, result });
      case 'read':
        return res.status(200).json({ message: `Read data from point successfully!`, result });
      case 'readAll':
        return res.status(200).json({ message: `Read all points and data successfully!`, result });
      case 'getNumberOfDocuments':
        return res.status(200).json({ message: `Get number of documents successfully!`, result });
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error(`Error in /api/data (action: ${req.body.action || 'unknown'}):`, error.message);
    switch (error.status) {
      case 404:
        return res.status(404).json({ error: 'NOT FOUND', details: error.message});
      case 409:
        return res.status(409).json({ error: 'CONFLICT', details: error.message});
      default:
        return res.status(500).json({ error: 'FAIL', details: error.message });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server now is running on: http://localhost:${PORT}`);
});