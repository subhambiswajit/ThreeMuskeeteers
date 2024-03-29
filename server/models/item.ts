import * as mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  parentItem: String,
  name: String,
  desc: String,
  tags: String
});

const Item = mongoose.model('item', itemSchema);

export default Item;
