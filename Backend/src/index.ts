import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import managerRoutes from './routes/managerRoutes';
import employeeRoutes from './routes/employeeRoutes';
import { errorHandler } from './middlewares/errorHandler';
import {pool} from './config/database'

dotenv.config();


declare global {
    namespace Express {
      interface Request {
        user?: {
          id: number;
          role: 'manager' | 'employee';
          manager_id?: number;
        };
      }
    }
  }





const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

declare global {
    namespace Express {
      interface Request {
        user?: {
          id: number;
          role: 'manager' | 'employee';
          manager_id?: number;
        };
      }
    }
  };


  // 9. Start server
const PORT = process.env.PORT || 5000;
pool.getConnection()
  .then(() => {
    console.log('✅ MySQL connected!');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1);
  });



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/employee', employeeRoutes);



// Global error handler
app.use(errorHandler);

