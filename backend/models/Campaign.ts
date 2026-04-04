import { DataTypes, Model, type Optional } from 'sequelize';
import sequelize from '../config/database';

interface CampaignAttributes {
    id: number;
    title: string;
    platform: 'Facebook' | 'Google' | 'LinkedIn' | 'Twitter';
    status: 'Draft' | 'Active' | 'Paused' | 'Completed';
    budget: number;
    description?: string;
}

interface CampaignCreationAttributes extends Optional<CampaignAttributes, 'id' | 'status'> { }

class Campaign extends Model<CampaignAttributes, CampaignCreationAttributes> implements CampaignAttributes {
    declare id: number;
    declare title: string;
    declare platform: 'Facebook' | 'Google' | 'LinkedIn' | 'Twitter';
    declare status: 'Draft' | 'Active' | 'Paused' | 'Completed';
    declare budget: number;
    declare description: string;
}

Campaign.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        platform: {
            type: DataTypes.ENUM('Facebook', 'Google', 'LinkedIn', 'Twitter'),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('Draft', 'Active', 'Paused', 'Completed'),
            defaultValue: 'Draft',
        },
        budget: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'campaigns',
    }
);

export default Campaign;