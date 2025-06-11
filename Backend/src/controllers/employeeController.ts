import { Request, Response } from 'express';
import asyncHandler from '../middlewares/asyncHandler';
import { pool } from '../config/database';

export const getMyManager = asyncHandler(async (req: Request, res: Response) => {
  const employeeId = req.user?.id;

  const [rows]: any = await pool.query(
    'SELECT m.id, m.name, m.email FROM users u JOIN users m ON u.manager_id = m.id WHERE u.id = ?',
    [employeeId]
  );

  if (rows.length === 0) {
    res.status(404).json({ message: 'Manager not found' });
    return;
  }

  res.json(rows[0]);
});
