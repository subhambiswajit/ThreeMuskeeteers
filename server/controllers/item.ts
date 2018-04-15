import Item from '../models/item';
import BaseCtrl from './base';
import ObjectCtrl from './object';
import CustomFieldCtrl from './customfield';


export default class ItemCtrl extends BaseCtrl {
  model = Item;

  customFieldCtrl = new CustomFieldCtrl();
  objectCtrl = new ObjectCtrl();

    // searchbyField
    search = (req, res) => {
      this.model.find({name : new RegExp( req.params.text, 'i' ) }, (err, items) => {
        if (err) { return console.error(err); }
        console.log(new RegExp('^' + req.params.text + '$', 'i' ));
        res.status(200).json(items);
      });
    }

    getItemInfo =  async (req, res) => {
      let itemInfo = {id: null, name: null, desc: null, customFields: null, files: null};
      let item = await this.model.find({_id: req.params.id});
      console.log(item);
      if (item != null && item.length > 0) {
        console.log('inside');
        itemInfo.name = item[0].name;
        itemInfo.desc = item[0].desc;
        itemInfo.id = item[0]._id;
        
        itemInfo.customFields = await this.customFieldCtrl.getFieldsForParentId(item[0]._id);
        itemInfo.files = await this.objectCtrl.getObjectsForParentId(item[0]._id);
      }
      res.status(200).json(itemInfo);
    }

   getFullTree = async (req, res) => {
     // let pro = new Promise()
     let result = await this.getChildren(null, '');
     var root =  {name: 'OnBoard', id: 'root', children: result};
     res.status(200).json(root);
    }

    getChildren = async (id: string, root: string) => {
      let resultItems = null;
      if (id == null)
      {
       // console.log('sync');
        let items = await this.model.find({parentItem: null});
       // console.log(items);
        resultItems = await this.populateChildren(items, root);
      } else {
         let items = await this.model.find({parentItem: id}, null);
         let items2 = await this.model.find({tags : new RegExp( id, 'i' ) }, null);
         let mergedItems = items.concat(items2);
         resultItems = await this.populateChildren(mergedItems, root);
    }
    return resultItems;
  };

    populateChildren = async (items, root) => {
      //console.log('populate');
      let childItems = new Array();
      for (let i = 0; i < items.length; i++) {
            let child = {name: items[i].name, id: items[i]._id, children: null};
         //   console.log(child);
            if (!( root.indexOf(items[i].id) >= 0 )) {
              root += ',' + items[i]._id;
              let children = await this.getChildren(items[i].id, root);
              child.children = children;
            }
            childItems.push(child);
         }
         return childItems;
      }


  //   function readFilePromise(fileName: string): Promise<Buffer>{
  //     return new Promise(function(resolve, reject) {
  //        fs.readFile(fileName, function(err, data: Buffer) {
  //           if(err !== null) return reject(err);
  //           resolve(data);
  //        });
  //     });
  //  }


   getChildItems = (req, res) => {
     if (req.params.parentid == null) {
      this.model.find({parentItem: null}, (err, items) => {
        if (err) { return console.error(err); }
        res.status(200).json(items);
      });
     } else {
     this.model.find({parentItem: req.params.parentid}, (err, items) => {
       if (err) { return console.error(err); }
       this.model.find({tags : new RegExp( req.params.parentid, 'i' ) }, (err2, itemsTagged) => {
        if (err2) { return console.error(err2); }
        res.status(200).json(items.concat(itemsTagged));
      });
     });
    }
   }
}

