import { Request, Response } from 'express';
import { Model } from 'mongoose';

const summary = async (Model: Model<any>, req: Request, res: Response | any): Promise<void> => {
  try {
    // Query the database for a count of all documents
    const countAllDocsPromise = Model.countDocuments({ removed: false });

    // Query the database for a count of filtered documents
    const countFilterPromise = Model.countDocuments({
      removed: false,
      [req.query.filter as any]: req.query.equal,
    }).exec();

    // Resolving both promises
    const [countFilter, countAllDocs] = await Promise.all([
      countFilterPromise,
      countAllDocsPromise,
    ]);

    if (countAllDocs > 0) {
      return res.status(200).json({
        success: true,
        result: { countFilter, countAllDocs },
        message: 'Successfully counted all documents',
      });
    } else {
      return res.status(203).json({
        success: false,
        result: [],
        message: 'Collection is Empty',
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'An error occurred while summarizing documents',
      error: error.message,
    });
  }
};

export default summary;
