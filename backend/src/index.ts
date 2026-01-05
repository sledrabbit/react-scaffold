import 'dotenv/config';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { Pool } from 'pg';

const PORT = Number(process.env.PORT ?? 4000);
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL must be defined in a .env file');
}

const pool = new Pool({ connectionString: DATABASE_URL });
const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', async (_req: Request, res: Response) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ status: 'error', error: (error as Error).message });
  }
});

app.post('/query', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sql, params } = req.body ?? {};

    if (typeof sql !== 'string' || sql.trim().length === 0) {
      return res.status(400).json({ message: 'sql is required in the request body' });
    }

    const values = Array.isArray(params) ? params : [];
    const result = await pool.query(sql, values);

    res.json({ rows: result.rows, rowCount: result.rowCount });
  } catch (error) {
    next(error);
  }
});

app.post('/insert', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sql, params } = req.body ?? {};

    if (typeof sql !== 'string' || sql.trim().length === 0) {
      return res.status(400).json({ message: 'sql is required in the request body' });
    }

    const values = Array.isArray(params) ? params : [];
    const result = await pool.query(sql, values);

    res.json({ rowCount: result.rowCount, rows: result.rows });
  } catch (error) {
    next(error);
  }
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(500).json({ message: 'Internal Server Error', detail: error.message });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
