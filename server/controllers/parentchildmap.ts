import ParentChildMap from '../models/parentchildmap';
import BaseCtrl from './base';

export default class ParentChildMapCtrl extends BaseCtrl {
  model = ParentChildMap;

  getChildren = async (parentId: String) => {
    let children = await this.model.find({parentId: parentId});
    return children;
  }
}
