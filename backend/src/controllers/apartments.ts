// backend/src/controllers/apartments.ts
import { Request, Response } from 'express';
import Apartment, { IApartment } from '../models/apartment';

// Define error types
interface MongooseError extends Error {
  code?: number;
  name: string;
}

// List all apartments
export const listApartments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = { $text: { $search: search as string } };
    }

    const apartments = await Apartment.find(query);
    res.json(apartments);
  } catch (err: unknown) {
    const error = err as Error;
    console.error('List apartments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single apartment
export const getApartment = async (req: Request, res: Response) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    if (!apartment) {
      return res.status(404).json({ message: 'Apartment not found' });
    }
    res.json(apartment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching apartment' });
  }
};

// Create a new apartment
export const createApartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      unitName,
      unitNumber,
      project,
      price,
      bedrooms,
      bathrooms,
      area,
      description,
      images,
      amenities
    } = req.body;

    // Validate required fields
    if (!unitName || !unitNumber || !project || !price) {
      res.status(400).json({
        error: 'Missing required fields',
        required: ['unitName', 'unitNumber', 'project', 'price']
      });
      return;
    }

    const apartment = new Apartment({
      unitName,
      unitNumber,
      project,
      price: Number(price),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      area: Number(area),
      description,
      images: images || [],
      amenities: amenities || []
    });

    const savedApartment = await apartment.save();
    res.status(201).json(savedApartment);
  } catch (err: unknown) {
    const error = err as MongooseError;
    console.error('Create apartment error:', error);
    
    if (error.name === 'ValidationError') {
      res.status(400).json({ error: error.message });
      return;
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update an apartment
export const updateApartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const apartment = await Apartment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!apartment) {
      res.status(404).json({ error: 'Apartment not found' });
      return;
    }

    res.json(apartment);
  } catch (err: unknown) {
    const error = err as MongooseError;
    console.error('Update apartment error:', error);
    
    if (error.name === 'ValidationError') {
      res.status(400).json({ error: error.message });
      return;
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete an apartment
export const deleteApartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const apartment = await Apartment.findByIdAndDelete(req.params.id);

    if (!apartment) {
      res.status(404).json({ error: 'Apartment not found' });
      return;
    }

    res.json({ message: 'Apartment deleted successfully' });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Delete apartment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};