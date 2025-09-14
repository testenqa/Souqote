import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message
      });
    }
    next();
  };
};

// Validation schemas
export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\+971[0-9]{9}$/).required(),
  first_name: Joi.string().min(2).max(50).required(),
  last_name: Joi.string().min(2).max(50).required(),
  user_type: Joi.string().valid('customer', 'professional').required(),
  password: Joi.string().min(8).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const jobSchema = Joi.object({
  title: Joi.string().min(5).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  category_id: Joi.string().uuid().required(),
  location: Joi.string().min(5).max(200).required(),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
  budget_min: Joi.number().min(0).optional(),
  budget_max: Joi.number().min(0).optional(),
  preferred_date: Joi.date().optional(),
  urgency: Joi.string().valid('low', 'medium', 'high').required()
});

export const jobApplicationSchema = Joi.object({
  message: Joi.string().min(10).max(500).required(),
  proposed_price: Joi.number().min(0).required(),
  estimated_duration: Joi.string().min(1).max(50).required()
});

export const reviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().max(500).optional()
});

export const profileSchema = Joi.object({
  bio: Joi.string().max(500).optional(),
  location: Joi.string().max(100).optional(),
  emirates_id: Joi.string().optional(),
  trade_license: Joi.string().optional(),
  insurance_document: Joi.string().optional(),
  years_experience: Joi.number().min(0).max(50).optional(),
  hourly_rate: Joi.number().min(0).optional(),
  languages: Joi.array().items(Joi.string()).optional(),
  specialties: Joi.array().items(Joi.string()).optional(),
  availability: Joi.string().max(100).optional()
});
