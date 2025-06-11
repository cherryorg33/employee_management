import { Request, Response } from 'express';
import asyncHandler from '../middlewares/asyncHandler';
import { pool } from '../config/database';
  import bcrypt from 'bcrypt';

// import bycrpt

export const getMyEmployees = asyncHandler(async (req: Request, res: Response) => {
  const managerId = req.user?.id;

  const [rows]: any = await pool.query(
    'SELECT id, name, email FROM users WHERE role = "employee" AND manager_id = ?',
    [managerId]
  );

  res.json(rows);
});

export const getEmployeeDetails = asyncHandler(async (req: Request, res: Response) => {
  const employeeId = req.params.id;
  const managerId = req.user?.id;

  const [rows]: any = await pool.query(
    'SELECT id, name, email FROM users WHERE id = ? AND role = "employee" AND manager_id = ?',
    [employeeId, managerId]
  );

  if (rows.length === 0) {
    res.status(404).json({ message: 'Employee not found' });
    return;
  }

  res.json(rows[0]);
});

export const addEmployee = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const managerId = req.user?.id;

  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.query(
    'INSERT INTO users (name, email, password, role, manager_id) VALUES (?, ?, ?, "employee", ?)',
    [name, email, hashedPassword, managerId]
  );

  res.status(201).json({ message: 'Employee added' });
});

export const updateEmployee = asyncHandler(async (req: Request, res: Response) => {
  const employeeId = req.params.id;
  const managerId = req.user?.id;
  const { name, email } = req.body;

  const [result]: any = await pool.query(
    'UPDATE users SET name = ?, email = ? WHERE id = ? AND role = "employee" AND manager_id = ?',
    [name, email, employeeId, managerId]
  );

  if (result.affectedRows === 0) {
    res.status(404).json({ message: 'Employee not found or unauthorized' });
    return;
  }

  res.json({ message: 'Employee updated' });
});

export const deleteEmployee = asyncHandler(async (req: Request, res: Response) => {
  const employeeId = req.params.id;
  const managerId = req.user?.id;

  const [result]: any = await pool.query(
    'DELETE FROM users WHERE id = ? AND role = "employee" AND manager_id = ?',
    [employeeId, managerId]
  );

  if (result.affectedRows === 0) {
    res.status(404).json({ message: 'Employee not found or unauthorized' });
    return;
  }

  res.json({ message: 'Employee deleted' });
});
