import express, { Request, Response } from 'express';
import path from 'path';
import { promises as fs } from 'fs';
import cors from 'cors';

const app = express();
app.use(cors());

const port = process.env.PORT || 3000;

const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath));

interface DataResponse {
  data?: any;
  error?: string;
}

app.get('/api/data/:name?', async (req: Request, res: Response<DataResponse>) => {
  const dataSet = req.params.name || 'sample';
  const filePath = path.join(__dirname, `data/tree_data_${dataSet}.json`);

  try {
    const data = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      res.status(404).json({ error: 'Data not found' });
    } else if (err instanceof SyntaxError) {
      res.status(500).json({ error: 'Failed to parse data' });
    } else {
      res.status(500).json({ error: 'Failed to read data' });
    }
  }
});

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

export default app;
