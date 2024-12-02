import express, { Request, Response } from 'express';

const app = express();
const port = 3001;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('TypeScript - Node Setup');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
