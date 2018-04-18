import * as mongoose from 'mongoose';

const parentChildMapSchema = new mongoose.Schema({
  _id: String,
  parentId: String,
  parentName: String,
  childId: String,
  childName: String,
});

const CustomField = mongoose.model('parentchildmap', parentChildMapSchema);

export default CustomField;
