import { Request, Response } from 'express';
import asyncHandler from '../middlewares/asyncHandler';
import { pool } from '../config/database';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken';

// ✅ Manager Registration
export const registerManager = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // Check if email already exists
  const [existing]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    return res.status(400).json({ message: 'Email already registered' });
  }

    // Check if manager count has reached the limit (max 10)
  const [managerCountResult]: any = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = "manager"');
  const managerCount = managerCountResult[0]?.count || 0;

  if (managerCount >= 10) {
    return res.status(400).json({ message: 'Maximum limit of 10 managers reached' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert new manager into users table
  const [result]: any = await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, "manager")',
    [name, email, hashedPassword]
  );

  const newManagerId = result.insertId;

  const token = generateToken({
    id: newManagerId,
    role: 'manager',
  });

  res.status(201).json({
    token,
    role: 'manager',
  });
});

// ✅ Manager/Employee Login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const [rows]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  const user = rows[0];

  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const token = generateToken({
    id: user.id,
    role: user.role,
  });

  res.json({
    token,
    role: user.role,
  });
});
