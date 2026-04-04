import { Request, Response } from 'express';
import Campaign from '../models/Campaign';

// Get all campaigns
export const getCampaigns = async (req: Request, res: Response) => {
    try {
        const campaigns = await Campaign.findAll({ order: [['createdAt', 'DESC']] });
        res.json(campaigns);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Create new campaign
export const createCampaign = async (req: Request, res: Response) => {
    try {
        const { title, platform, budget, description } = req.body;
        const newCampaign = await Campaign.create({
            title,
            platform,
            budget,
            description,
            status: 'Active'
        });
        res.status(201).json(newCampaign);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Delete campaign
export const deleteCampaign = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await Campaign.destroy({ where: { id } });
        if (deleted) {
            res.json({ message: "Campaign deleted successfully" });
        } else {
            res.status(404).json({ error: "Campaign not found" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Update campaign
export const updateCampaign = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [updatedRows] = await Campaign.update(req.body, { where: { id } });

        if (updatedRows > 0) {
            const updatedCampaign = await Campaign.findOne({ where: { id } });
            res.json(updatedCampaign);
        } else {
            res.status(404).json({ error: "Campaign not found or no changes made" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};