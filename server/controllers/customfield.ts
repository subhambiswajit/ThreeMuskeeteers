import CustomField from '../models/customfield';
import BaseCtrl from './base';

export default class CustomFieldCtrl extends BaseCtrl {
  model = CustomField;

  getFieldsForParentId = async (parentId: String) => {
    let fields = await this.model.find({parentId: parentId});
    return fields;
  }

  updateCustomFields = async(id, data) => {
    await this.model.remove({parentId : id});
    let fieldArray = new Array();
    if ( data.length > 0 ) {
      for (let i = 0; i < data.length; i++) {
        let cfield = { parentId: id, label: data[i].label, value: data[i].value };
        fieldArray.push(cfield);
      }
      this.model.collection.insert(fieldArray);
    }
  }

}
