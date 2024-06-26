import { Request, Response } from 'express';
import mongoose from 'mongoose';

const QuoteModel = mongoose.model('Quote');
const InvoiceModel = mongoose.model('Invoice');
const People = mongoose.model('People');
const Company = mongoose.model('Company');

const remove = async (Model: any, req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if the client has any associated quotes or invoices
    const [quote, invoice] = await Promise.all([
      QuoteModel.findOne({ client: id, removed: false }).exec(),
      InvoiceModel.findOne({ client: id, removed: false }).exec(),
    ]);

    if (quote || invoice) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Cannot delete client if they have any associated quotes or invoices',
      });
    }

    // Remove the client from the Model
    const result = await Model.findOneAndDelete({ _id: id, removed: false }).exec();

    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: `No client found with id: ${id}`,
      });
    }

    // Update isClient flag for People or Company
    const updateQuery = result.type === 'people' ? { isClient: false } : { isClient: false };

    await (result.type === 'people' ? People : Company)
      .findOneAndUpdate({ _id: result[result.type]._id, removed: false }, updateQuery, {
        new: true,
        runValidators: true,
      })
      .exec();

    return res.status(200).json({
      success: true,
      result: null,
      message: `Successfully deleted the client with id: ${id}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Internal server error',
    });
  }
};

export default remove;
