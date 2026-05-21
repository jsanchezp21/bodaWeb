import { Router } from 'express';
import {
  createRsvp,
  exportRsvps,
  getRsvps,
  deleteRsvp
} from '../controllers/rsvpController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', createRsvp);
router.get('/', requireAuth, getRsvps);
router.get('/export', requireAuth, exportRsvps);
router.delete('/:id', requireAuth, deleteRsvp);

export default router;
