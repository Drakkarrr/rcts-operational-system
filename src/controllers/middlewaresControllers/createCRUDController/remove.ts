import { Request, Response } from 'express';
import { Model } from 'mongoose';

const remove = async (Model: Model<any>, req: Request, res: Response | any): Promise<void> => {
  try {
    // Find the document by id and delete it
    let updates = {
      removed: true,
    };

    // Find the document by id and delete it
    const result = await Model.findOneAndUpdate(
      { _id: req.params.id, removed: false },
      { $set: updates },
      {
        new: true, // return the new result instead of the old one
      }
    ).exec();

    // If no results found, return document not found
    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found',
      });
    } else {
      return res.status(200).json({
        success: true,
        result,
        message: 'Document deleted successfully',
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'An error occurred while deleting the document',
      error: error.message,
    });
  }
};

export default remove;
