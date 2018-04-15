import CustomField from '../models/customfield';
import BaseCtrl from './base';

export default class CustomFieldCtrl extends BaseCtrl {
  model = CustomField;

  getFieldsForParentId = async (parentId: String) => {
    let fields = await this.model.find({parentId: parentId});
    return fields;
  }
}
