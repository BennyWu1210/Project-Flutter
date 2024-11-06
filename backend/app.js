const express = require('express');
const cors = require('cors');
const repositoryRoutes = require('./routes/repository');
const codeRoutes = require('./routes/code');
const traceRoutes = require('./routes/trace');

const app = express();
const PORT = 8080;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/repository', repositoryRoutes);
app.use('/api/code', codeRoutes);
app.use('/api/trace', traceRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
