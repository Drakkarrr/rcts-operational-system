import createCRUDController from '@/controllers/middlewaresControllers/createCRUDController';
import create from './create';
import summary from './summary';
import update from './update';
import remove from './remove';
import sendMail from './sendMail';

// const modelName = 'Payment';
// const methods = createCRUDController(modelName);

const methods = createCRUDController('Payment');

methods.mail = sendMail;
methods.create = create;
methods.update = update;
methods.delete = remove;
methods.summary = summary;

export default methods;
