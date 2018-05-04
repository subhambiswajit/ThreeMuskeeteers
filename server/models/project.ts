import * as mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  _id: String,
  name: String,
  desc: String,
  rootNodeId: String,
});

const Project = mongoose.model('project', projectSchema);

export default Project;
