import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { checkCurrency } from '@/utils/currency';
import { increaseBySettingKey } from '@/middlewares/settings';
import { calculate } from '@/helpers';

const QuoteModel = mongoose.model('Quote');

const create = async (req: Request | any, res: Response) => {
  try {
    const { items = [], taxRate = 0, discount = 0, currency } = req.body;

    // default
    let subTotal = 0;
    let taxTotal = 0;
    let total = 0;

    if (!checkCurrency(currency)) {
      return res.status(400).json({
        success: false,
        result: null,
        message: "currency doesn't exist",
      });
    }

    // Calculate the items array with subTotal, total, taxTotal
    items.forEach((item: any) => {
      const itemTotal = calculate.multiply(item.quantity, item.price);
      // sub total
      subTotal = calculate.add(subTotal, itemTotal) as number;
      // item total
      item.total = itemTotal;
    });

    taxTotal = calculate.multiply(subTotal, taxRate / 100) as number;
    total = calculate.add(subTotal, taxTotal) as number;

    const body = {
      ...req.body,
      subTotal,
      taxTotal,
      total,
      items,
      createdBy: req.admin._id,
    };

    // Creating a new document in the collection
    const result = await new QuoteModel(body).save();

    const fileId = `quote-${result._id}.pdf`;

    const updateResult = await QuoteModel.findOneAndUpdate(
      { _id: result._id },
      { pdf: fileId },
      { new: true }
    ).exec();

    // Returning successful response
    increaseBySettingKey({
      settingKey: 'last_quote_number',
    });

    // Returning successful response
    return res.status(200).json({
      success: true,
      result: updateResult,
      message: 'Quote created successfully',
    });
  } catch (error: string | any) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: 'Internal Server Error',
    });
  }
};

export default create;
