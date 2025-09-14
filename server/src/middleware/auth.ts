import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/database';
import { User } from '../types';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Get user from Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

export const requireUserType = (userType: 'customer' | 'professional') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user?.user_type !== userType) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${userType} account required.`
      });
    }
    next();
  };
};

export const requireVerifiedUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user?.is_verified) {
    return res.status(403).json({
      success: false,
      message: 'Account verification required'
    });
  }
  next();
};
