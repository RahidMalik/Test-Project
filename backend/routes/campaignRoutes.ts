import { Router } from 'express';
import {
    getCampaigns,
    createCampaign,
    deleteCampaign,
    updateCampaign
} from '../controllers/campaignRoutes';

const router = Router();

// Routes mapping
router.get('/', getCampaigns);          // GET /api/campaigns
router.post('/', createCampaign);       // POST /api/campaigns
router.put('/:id', updateCampaign);     // PUT /api/campaigns/:id
router.delete('/:id', deleteCampaign);  // DELETE /api/campaigns/:id

export default router;