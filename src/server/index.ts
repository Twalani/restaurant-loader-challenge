import express, { Request, Response } from 'express';
import { streamRestaurants } from './restaurantLoader';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../../public')));

// Example API route
app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from Express!' });
});

app.get(
  '/api/restaurants/stream',
  async (_req: Request, res: Response) => {
    res.setHeader(
      'Content-Type',
      'application/x-ndjson',
    );
    
    // Disable caching so clients receive streamed updates immediately.
    res.setHeader(
      'Cache-Control',
      'no-cache',
    );

    await streamRestaurants(res);
  },
);

// Streaming endpoint - sends chunks every 0.3 seconds for 5 seconds
app.get('/api/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/x-ndjson'); // newline-delimited JSON
  res.setHeader('Cache-Control', 'no-cache');

  let counter = 0;
  const maxDuration = 3000; // 3 seconds
  const interval = 100; // 0.1 seconds
  const startTime = Date.now();

  const intervalId = setInterval(() => {
    const elapsed = Date.now() - startTime;
    counter++;

    const chunk = {
      type: 'progress',
      progress: counter,
    };

    // NDJSON streams send one JSON object per line, allowing
    // the client to process updates incrementally
    res.write(JSON.stringify(chunk) + '\n');

    // Check if we've exceeded the max duration
    if (elapsed >= maxDuration) {
      clearInterval(intervalId);
      const conclusionChunk = {
        type: 'conclusion',
        conclusion: `Streaming completed after ${counter} updates`,
      };
      res.write(JSON.stringify(conclusionChunk) + '\n');
      res.end();
    }
  }, interval);
});

// Add more routes here as needed
// app.get('/api/example', (req: Request, res: Response) => {
//   res.json({ data: 'example' });
// });

// Serve index.html for root route
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
