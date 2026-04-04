
export interface Campaign {
    id: number;
    title: string;
    platform: 'Facebook' | 'Google' | 'LinkedIn' | 'Twitter';
    status: 'Draft' | 'Active' | 'Paused' | 'Completed';
    budget: number;
    createdAt?: string;
    updatedAt?: string;
    description?: string;
}