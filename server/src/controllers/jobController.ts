import { Response } from 'express';
import { JobService } from '../services/jobService';
import { ApiResponse, AuthenticatedRequest } from '../types';

export class JobController {
  static async createJob(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const jobData = {
        ...req.body,
        customer_id: req.user!.id
      };

      const job = await JobService.createJob(jobData);

      const response: ApiResponse = {
        success: true,
        data: job,
        message: 'Job created successfully'
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

  static async getJobs(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const filters = {
        category_id: req.query.category_id as string,
        location: req.query.location as string,
        budget_min: req.query.budget_min ? Number(req.query.budget_min) : undefined,
        budget_max: req.query.budget_max ? Number(req.query.budget_max) : undefined,
        rating_min: req.query.rating_min ? Number(req.query.rating_min) : undefined,
        availability: req.query.availability as string,
        languages: req.query.languages ? (req.query.languages as string).split(',') : undefined
      };

      const pagination = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 20,
        sort_by: req.query.sort_by as string || 'created_at',
        sort_order: (req.query.sort_order as 'asc' | 'desc') || 'desc'
      };

      const result = await JobService.getJobs(filters, pagination);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Jobs fetched successfully'
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

  static async getJobById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { jobId } = req.params;
      const job = await JobService.getJobById(jobId);

      if (!job) {
        const response: ApiResponse = {
          success: false,
          error: 'Job not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: job,
        message: 'Job fetched successfully'
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

  static async updateJob(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { jobId } = req.params;
      const job = await JobService.updateJob(jobId, req.body);

      const response: ApiResponse = {
        success: true,
        data: job,
        message: 'Job updated successfully'
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

  static async deleteJob(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { jobId } = req.params;
      await JobService.deleteJob(jobId);

      const response: ApiResponse = {
        success: true,
        message: 'Job deleted successfully'
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

  static async applyForJob(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { jobId } = req.params;
      const applicationData = {
        ...req.body,
        job_id: jobId,
        professional_id: req.user!.id
      };

      const application = await JobService.applyForJob(applicationData);

      const response: ApiResponse = {
        success: true,
        data: application,
        message: 'Application submitted successfully'
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

  static async getJobApplications(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { jobId } = req.params;
      const applications = await JobService.getJobApplications(jobId);

      const response: ApiResponse = {
        success: true,
        data: applications,
        message: 'Applications fetched successfully'
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

  static async acceptApplication(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { applicationId } = req.params;
      await JobService.acceptApplication(applicationId);

      const response: ApiResponse = {
        success: true,
        message: 'Application accepted successfully'
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

  static async completeJob(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { jobId } = req.params;
      await JobService.completeJob(jobId);

      const response: ApiResponse = {
        success: true,
        message: 'Job completed successfully'
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

  static async getUserJobs(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const jobs = await JobService.getUserJobs(req.user!.id, req.user!.user_type);

      const response: ApiResponse = {
        success: true,
        data: jobs,
        message: 'User jobs fetched successfully'
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
