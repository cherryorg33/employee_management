import jwt from 'jsonwebtoken';

// generateToken.ts
interface TokenPayload {
  id: number;
  role: string;
}

export const generateToken = ({ id, role }: TokenPayload): string => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: '1d',
  });
};

