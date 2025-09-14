import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { ApiResponse } from '../types';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { user, token } = await AuthService.register(req.body);

      // Send verification email
      await AuthService.sendVerificationEmail(user.email, user.id);

      // Send verification SMS
      await AuthService.sendVerificationSMS(user.phone, user.id);

      const response: ApiResponse = {
        success: true,
        data: { user, token },
        message: 'Registration successful. Please verify your email and phone.'
      };

      res.status(201).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: error.message
      };
      res.status(400).json(response);
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { user, token } = await AuthService.login(email, password);

      const response: ApiResponse = {
        success: true,
        data: { user, token },
        message: 'Login successful'
      };

      res.json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: error.message
      };
      res.status(401).json(response);
    }
  }

  static async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const { userId, verificationCode } = req.body;
      await AuthService.verifyEmail(userId, verificationCode);

      const response: ApiResponse = {
        success: true,
        message: 'Email verified successfully'
      };

      res.json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: error.message
      };
      res.status(400).json(response);
    }
  }

  static async verifyPhone(req: Request, res: Response): Promise<void> {
    try {
      const { userId, verificationCode } = req.body;
      await AuthService.verifyPhone(userId, verificationCode);

      const response: ApiResponse = {
        success: true,
        message: 'Phone verified successfully'
      };

      res.json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: error.message
      };
      res.status(400).json(response);
    }
  }

  static async resendVerification(req: Request, res: Response): Promise<void> {
    try {
      const { email, phone } = req.body;

      if (email) {
        await AuthService.sendVerificationEmail(email, '');
      }

      if (phone) {
        await AuthService.sendVerificationSMS(phone, '');
      }

      const response: ApiResponse = {
        success: true,
        message: 'Verification code sent'
      };

      res.json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: error.message
      };
      res.status(400).json(response);
    }
  }

  static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      await AuthService.resetPassword(email);

      const response: ApiResponse = {
        success: true,
        message: 'Password reset email sent'
      };

      res.json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: error.message
      };
      res.status(400).json(response);
    }
  }

  static async updatePassword(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { newPassword } = req.body;
      
      await AuthService.updatePassword(userId, newPassword);

      const response: ApiResponse = {
        success: true,
        message: 'Password updated successfully'
      };

      res.json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: error.message
      };
      res.status(400).json(response);
    }
  }
}
