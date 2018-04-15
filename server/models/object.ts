import * as mongoose from 'mongoose';

const objectSchema = new mongoose.Schema({
  _id: String,
  parentId: String,
  type: String,
  label: String,
  fileName: String,
  value: String,
});

const CustomField = mongoose.model('object', objectSchema);

export default CustomField;
