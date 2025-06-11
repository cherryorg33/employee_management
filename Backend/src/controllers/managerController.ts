import { Request, Response } from 'express';
import asyncHandler from '../middlewares/asyncHandler';
import { pool } from '../config/database';
  import bcrypt from 'bcrypt';

// import bycrpt

export const getMyEmployees = asyncHandler(async (req: Request, res: Response) => {
  const managerId = req.user?.id;

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 5;
  const search = (req.query.search as string) || "";

  const offset = (page - 1) * limit;

  try {
    // Get total count
    const [countRows]: any = await pool.query(
      `SELECT COUNT(*) as total FROM users WHERE role = 'employee' AND manager_id = ? AND (name LIKE ? OR email LIKE ?)`,
      [managerId, `%${search}%`, `%${search}%`]
    );
    const totalEmployees = countRows[0].total;
    const totalPages = Math.ceil(totalEmployees / limit);

    // Get paginated results
    const [rows]: any = await pool.query(
      `SELECT id, name, email FROM users WHERE role = 'employee' AND manager_id = ? AND (name LIKE ? OR email LIKE ?) ORDER BY id DESC LIMIT ? OFFSET ?`,
      [managerId, `%${search}%`, `%${search}%`, limit, offset]
    );

    res.json({
      employees: rows,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch employees", error });
  }
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

   // 1. Check if the email already exists
  const [existingEmail]: any = await pool.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  if (existingEmail.length > 0) {
    return res.status(400).json({ message: 'Email is already registered' });
  }

  // 2. Check if the manager already has 20 employees
  const [employeeCountResult]: any = await pool.query(
    'SELECT COUNT(*) as count FROM users WHERE role = "employee" AND manager_id = ?',
    [managerId]
  );
  const employeeCount = employeeCountResult[0]?.count || 0;

  if (employeeCount >= 20) {
    return res.status(400).json({ message: 'Maximum limit of 20 employees reached for this manager' });
  }

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
