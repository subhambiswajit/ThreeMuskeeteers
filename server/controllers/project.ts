import Project from '../models/project';
import BaseCtrl from './base';

export default class ProjectCtrl extends BaseCtrl {
  model = Project;

  getProjectInfo = async (req, res) => {
    let project = await this.model.find({});
    res.status(200).json(project);
  }
}
