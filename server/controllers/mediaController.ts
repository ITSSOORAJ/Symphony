import { Request, Response } from 'express';
import Media from '../models/Media';
import { getIsConnected } from '../config/db';
import { memoryStore } from '../config/store';

export const getMedia = async (req: Request, res: Response) => {
  try {
    const { category, type } = req.query;
    const isConnected = getIsConnected();

    if (isConnected) {
      const query: any = {};
      if (category && category !== 'All') query.category = category;
      if (type) query.mediaType = type;

      const mediaItems = await Media.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: mediaItems.length, data: mediaItems });
    } else {
      let filtered = [...memoryStore.media];
      if (category && category !== 'All') {
        filtered = filtered.filter(m => m.category === category);
      }
      if (type) {
        filtered = filtered.filter(m => m.mediaType === type);
      }
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return res.json({ success: true, count: filtered.length, data: filtered });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createMedia = async (req: Request, res: Response) => {
  try {
    const { title, category, mediaType, url, thumbnailUrl, description } = req.body;

    if (!title || !category || !mediaType || !url) {
      return res.status(400).json({ success: false, message: 'Title, category, mediaType, and URL are required.' });
    }

    const isConnected = getIsConnected();

    if (isConnected) {
      const newMedia = new Media({
        title,
        category,
        mediaType,
        url,
        thumbnailUrl,
        description,
      });
      await newMedia.save();
      return res.status(201).json({ success: true, data: newMedia });
    } else {
      const newMedia = {
        _id: 'med_' + Date.now(),
        title,
        category,
        mediaType,
        url,
        thumbnailUrl,
        description,
        createdAt: new Date().toISOString(),
      };
      memoryStore.media.unshift(newMedia);
      return res.status(201).json({ success: true, data: newMedia });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMedia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const isConnected = getIsConnected();

    if (isConnected) {
      await (Media as any).findByIdAndDelete(id);
    } else {
      memoryStore.media = memoryStore.media.filter(m => m._id !== id);
    }

    return res.json({ success: true, message: 'Media deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
