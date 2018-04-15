import Object from '../models/object';
import BaseCtrl from './base';

export default class ObjectCtrl extends BaseCtrl {
  model = Object;

  getObjectsForParentId = async (parentId: String) => {
    let files = await this.model.find({parentId: parentId});
    return files;
  }
}
