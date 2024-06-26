import { Request, Response } from 'express';
import { Model } from 'mongoose';

const filter = async <T extends Document>(Model: Model<T>, req: Request, res: Response) => {
  try {
    if (req.query.filter === undefined || req.query.equal === undefined) {
      return res.status(403).json({
        success: false,
        result: null,
        message: 'filter not provided correctly',
      });
    }
    const result = await Model.find({
      removed: false as any,
    })
      .where(req.query.filter as any)
      .equals(req.query.equal)
      .exec();
    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found ',
      });
    } else {
      // Return success response
      return res.status(200).json({
        success: true,
        result,
        message: 'Successfully found all documents',
      });
    }
  } catch (error: any) {
    // Handle errors
    return res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to filter documents',
    });
  }
};

export default filter;
