import { Router } from 'express';
import { JobController } from '../controllers/jobController';
import { validateRequest, jobSchema, jobApplicationSchema } from '../middleware/validation';
import { authenticateToken, requireUserType, requireVerifiedUser } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', JobController.getJobs);
router.get('/:jobId', JobController.getJobById);

// Protected routes
router.use(authenticateToken);
router.use(requireVerifiedUser);

// Customer routes
router.post('/', requireUserType('customer'), validateRequest(jobSchema), JobController.createJob);
router.put('/:jobId', requireUserType('customer'), JobController.updateJob);
router.delete('/:jobId', requireUserType('customer'), JobController.deleteJob);
router.get('/:jobId/applications', requireUserType('customer'), JobController.getJobApplications);
router.post('/:jobId/applications/:applicationId/accept', requireUserType('customer'), JobController.acceptApplication);
router.post('/:jobId/complete', requireUserType('customer'), JobController.completeJob);

// Professional routes
router.post('/:jobId/apply', requireUserType('professional'), validateRequest(jobApplicationSchema), JobController.applyForJob);

// Common routes
router.get('/user/my-jobs', JobController.getUserJobs);

export default router;
