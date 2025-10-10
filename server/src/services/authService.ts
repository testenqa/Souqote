import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { supabase, supabaseAdmin } from '../config/database';
import { User } from '../types';

export class AuthService {
  static async register(userData: {
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
    user_type: 'customer' | 'professional';
    password: string;
  }): Promise<{ user: User; token: string }> {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .or(`email.eq.${userData.email},phone.eq.${userData.phone}`)
      .single();

    if (existingUser) {
      throw new Error('User already exists with this email or phone');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Create user
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert({
        email: userData.email,
        phone: userData.phone,
        first_name: userData.first_name,
        last_name: userData.last_name,
        user_type: userData.user_type,
        password_hash: hashedPassword,
        is_verified: false,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      throw new Error('Failed to create user');
    }

    // Generate JWT token
    const payload = { userId: user.id, email: user.email };
    const secret = process.env.JWT_SECRET || 'fallback-secret-key';
    const options: SignOptions = { expiresIn: process.env.JWT_EXPIRES_IN || '7d' };
    const token = jwt.sign(payload, secret, options);

    return { user, token };
  }

  static async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // Get user with password hash
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    if (!user.is_active) {
      throw new Error('Account is deactivated');
    }

    // Generate JWT token
    const payload = { userId: user.id, email: user.email };
    const secret = process.env.JWT_SECRET || 'fallback-secret-key';
    const options: SignOptions = { expiresIn: process.env.JWT_EXPIRES_IN || '7d' };
    const token = jwt.sign(payload, secret, options);

    // Remove password hash from response
    delete user.password_hash;

    return { user, token };
  }

  static async verifyEmail(userId: string, verificationCode: string): Promise<void> {
    // In a real implementation, you would verify the code from your verification table
    // For now, we'll just mark the user as verified
    const { error } = await supabaseAdmin
      .from('users')
      .update({ is_verified: true })
      .eq('id', userId);

    if (error) {
      throw new Error('Failed to verify email');
    }
  }

  static async verifyPhone(userId: string, verificationCode: string): Promise<void> {
    // In a real implementation, you would verify the code from your verification table
    // For now, we'll just mark the user as verified
    const { error } = await supabaseAdmin
      .from('users')
      .update({ is_verified: true })
      .eq('id', userId);

    if (error) {
      throw new Error('Failed to verify phone');
    }
  }

  static async sendVerificationEmail(email: string, userId: string): Promise<void> {
    // In a real implementation, you would send an email with verification code
    // For now, we'll just log it
    console.log(`Sending verification email to ${email} for user ${userId}`);
  }

  static async sendVerificationSMS(phone: string, userId: string): Promise<void> {
    // In a real implementation, you would send an SMS with verification code
    // For now, we'll just log it
    console.log(`Sending verification SMS to ${phone} for user ${userId}`);
  }

  static async resetPassword(email: string): Promise<void> {
    // In a real implementation, you would send a password reset email
    console.log(`Sending password reset email to ${email}`);
  }

  static async updatePassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    const { error } = await supabaseAdmin
      .from('users')
      .update({ password_hash: hashedPassword })
      .eq('id', userId);

    if (error) {
      throw new Error('Failed to update password');
    }
  }
}
