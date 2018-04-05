import * as mongoose from 'mongoose';

const customfieldSchema = new mongoose.Schema({
  _id: String,
  label: String,
  value: String,
});

const CustomField = mongoose.model('customfield', customfieldSchema);

export default CustomField;
