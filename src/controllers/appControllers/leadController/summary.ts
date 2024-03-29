import { Request, Response } from 'express';
import mongoose, { Document } from 'mongoose';
import moment from 'moment';

const OfferModel = mongoose.model('Offer');

const summary = async (Model: any, req: Request, res: Response) => {
  try {
    let defaultType = 'month';
    const { type } = req.query;

    if (type && ['week', 'month', 'year'].includes(type as string)) {
      defaultType = type as string;
    } else if (type) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Invalid type',
      });
    }

    const currentDate = moment();
    let startDate = currentDate.clone().startOf(defaultType as moment.unitOfTime.StartOf);
    let endDate = currentDate.clone().endOf(defaultType as moment.unitOfTime.StartOf);

    const pipeline = [
      {
        $facet: {
          totalClients: [
            {
              $match: {
                removed: false,
                enabled: true,
              },
            },
            {
              $count: 'count',
            },
          ],
          newClients: [
            {
              $match: {
                removed: false,
                created: { $gte: startDate.toDate(), $lte: endDate.toDate() },
                enabled: true,
              },
            },
            {
              $count: 'count',
            },
          ],
          activeClients: [
            {
              $lookup: {
                from: OfferModel.collection.name,
                localField: '_id',
                foreignField: 'lead',
                as: 'offer',
              },
            },
            {
              $match: {
                'offer.removed': false,
              },
            },
            {
              $group: {
                _id: '$_id',
              },
            },
            {
              $count: 'count',
            },
          ],
        },
      },
    ];

    const aggregationResult: any[] = await Model.aggregate(pipeline);

    const result = aggregationResult[0];
    const totalClients = result.totalClients[0] ? result.totalClients[0].count : 0;
    const totalNewClients = result.newClients[0] ? result.newClients[0].count : 0;
    const activeClients = result.activeClients[0] ? result.activeClients[0].count : 0;

    const totalActiveClientsPercentage =
      totalClients > 0 ? (activeClients / totalClients) * 100 : 0;
    const totalNewClientsPercentage = totalClients > 0 ? (totalNewClients / totalClients) * 100 : 0;

    return res.status(200).json({
      success: true,
      result: {
        new: Math.round(totalNewClientsPercentage),
        active: Math.round(totalActiveClientsPercentage),
      },
      message: 'Successfully get summary of new clients',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Internal server error',
    });
  }
};

export default summary;
