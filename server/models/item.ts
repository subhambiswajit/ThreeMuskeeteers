import * as mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  _id: String,
  parentItem: String,
  name: String,
  desc: String,
  tags: String
});

const Item = mongoose.model('item', itemSchema);

export default Item;
