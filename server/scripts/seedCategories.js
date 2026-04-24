import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Category } from '../models/CatalogModels.js';

dotenv.config();

const seedCategories = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    
    const categories = [
      {
        name: 'Fresh Milk',
        description: 'Farm fresh organic milk delivered within hours of milking.',
        image: 'https://res.cloudinary.com/demo/image/upload/v1672345678/milk_bottle.jpg',
        isActive: true
      },
      {
        name: 'Curd & Yogurt',
        description: 'Probiotic-rich thick curd and artisanal yogurts.',
        image: 'https://res.cloudinary.com/demo/image/upload/v1672345678/curd_pot.jpg',
        isActive: true
      },
      {
        name: 'Ghee & Butter',
        description: 'Traditional Bilona Ghee and pure salted/unsalted butter.',
        image: 'https://res.cloudinary.com/demo/image/upload/v1672345678/ghee_jar.jpg',
        isActive: true
      },
      {
        name: 'Paneer & Cheese',
        description: 'Soft malai paneer and locally sourced artisanal cheeses.',
        image: 'https://res.cloudinary.com/demo/image/upload/v1672345678/paneer_block.jpg',
        isActive: true
      }
    ];

    for (const cat of categories) {
      const exists = await Category.findOne({ name: cat.name });
      if (!exists) {
        await Category.create(cat);
        console.log(`Created category: ${cat.name}`);
      } else {
        console.log(`Category already exists: ${cat.name}`);
      }
    }

    console.log('Categories seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error.message);
    process.exit(1);
  }
};

seedCategories();
