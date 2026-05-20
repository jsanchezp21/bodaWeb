import { Router } from 'express';
import { createRsvp, exportRsvps, getRsvps } from '../controllers/rsvpController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', createRsvp);
router.get('/', requireAuth, getRsvps);
router.get('/export', requireAuth, exportRsvps);

export default router;
