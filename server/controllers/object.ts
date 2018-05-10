import Object from '../models/object';
import BaseCtrl from './base';

export default class ObjectCtrl extends BaseCtrl {
  model = Object;

  getObjectsForParentId = async (parentId: String) => {
    let files = await this.model.find({parentId: parentId});
    return files;
  }

  updateFiles = async(id, data) => {
    //await this.model.remove({parentId : id});
    let fileArray = new Array();
    if ( data.length > 0 ) {
      for (let i = 0; i < data.length; i++) {
        let cfield = { parentId: id, label: data[i].label, fileName: data[i].fileName };
        fileArray.push(cfield);
      }
      this.model.collection.insert(fileArray);
    }
  }
}
