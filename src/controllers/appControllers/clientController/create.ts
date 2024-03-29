import { Request, Response } from 'express';
import mongoose from 'mongoose';

const People = mongoose.model('People');
const Company = mongoose.model('Company');

const create = async (Model: mongoose.Model<any>, req: Request, res: Response): Promise<void> => {
  try {
    // Creating a new document in the collection

    if (req.body.type === 'people') {
      if (!req.body.people) {
        res.status(403).json({
          success: false,
          message: 'Please select a people',
        });
        return;
      } else {
        let client = await Model.findOne({
          people: req.body.people,
          removed: false,
        });

        if (client) {
          res.status(403).json({
            success: false,
            result: null,
            message: 'Client Already Exist',
          });
          return;
        }

        let { firstname, lastname } = await People.findOneAndUpdate(
          {
            _id: req.body.people,
            removed: false,
          },
          { isClient: true },
          {
            new: true, // return the new result instead of the old one
            runValidators: true,
          }
        ).exec();
        req.body.name = firstname + ' ' + lastname;
        req.body.company = undefined;
      }
    } else {
      if (!req.body.company) {
        res.status(403).json({
          success: false,
          message: 'Please select a company',
        });
        return;
      } else {
        let client = await Model.findOne({
          company: req.body.company,
          removed: false,
        });

        if (client) {
          res.status(403).json({
            success: false,
            result: null,
            message: 'Client Already Exist',
          });
          return;
        }
        let { name } = await Company.findOneAndUpdate(
          {
            _id: req.body.company,
            removed: false,
          },
          { isClient: true },
          {
            new: true, // return the new result instead of the old one
            runValidators: true,
          }
        ).exec();
        req.body.name = name;
        req.body.people = undefined;
      }
    }

    req.body.removed = false;
    const result = await new Model({
      ...req.body,
    }).save();

    // Returning successful response
    res.status(200).json({
      success: true,
      result,
      message: 'Successfully Created the document in Model',
    });
  } catch (error: string | any) {
    res.status(500).json({
      success: false,
      result: null,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

export default create;
