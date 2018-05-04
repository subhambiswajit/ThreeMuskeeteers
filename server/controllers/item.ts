import Item from '../models/item';
import BaseCtrl from './base';
import ObjectCtrl from './object';
import CustomFieldCtrl from './customfield';
import ParentChildMapCtrl from './parentchildmap';


export default class ItemCtrl extends BaseCtrl {
  model = Item;

  customFieldCtrl = new CustomFieldCtrl();
  objectCtrl = new ObjectCtrl();
  parentChildMapCtrl = new ParentChildMapCtrl();

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
     // 5ad5424dc6e3447aacd12338	Estore Flow
     // 5ad5424dc6e3447aacd1233a	Fast AR Flow
     let rootId = '5ad5424dc6e3447aacd1233a';
     if (req.params.id != null) {
      rootId = req.params.id;
     }
     let result = await this.getChildren(rootId, '');
     let item = await this.model.find({_id: rootId});
     if (item != null && item.length > 0)
     {
      var root =  {name: item[0].name, id: item[0]._id + '_' + Math.random(), children: result};
      res.status(200).json(root);
     }
    }

    getChildren = async (id: string, root: string) => {
      let resultItems = null;
      let children =  await this.getParentChild(id);
      resultItems = await this.populateChildren(children, root);
      return resultItems;
  }

    populateChildren = async (items, root) => {
      //console.log('populate');
      let childItems = new Array();
      for (let i = 0; i < items.length; i++) {
            let child = {name: items[i].name, id: items[i]._id + '_' + Math.random(), children: null};
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


  //  getChildItems = async (req, res) => {
  //    if (req.params.parentid == null) {
  //     this.model.find({parentItem: null}, (err, items) => {
  //       if (err) { return console.error(err); }
  //       res.status(200).json(items);
  //     });
  //    } else {
  //    this.model.find({parentItem: req.params.parentid}, (err, items) => {
  //      if (err) { return console.error(err); }
  //      this.model.find({tags : new RegExp( req.params.parentid, 'i' ) }, (err2, itemsTagged) => {
  //       if (err2) { return console.error(err2); }
  //       res.status(200).json(items.concat(itemsTagged));
  //     });
  //    });
  //   }
  //  }

   getChildItems = async (req, res) => {
    if (req.params.parentid != null) {
      let items = await this.getParentChild(req.params.parentid);
      if (items.length === 0) {
        items =  await this.getParentChild('5ad543c6c6e3447aacd12476');
      }
      console.log(items.length);
      res.status(200).json(items);
    }
  }

    getParentChild = async (id: String) => {
      let children =  await this.parentChildMapCtrl.getChildren(id);
      let inQuery = {$in : null};
      let childArray = new Array();
      for (let i = 0; i < children.length; i++) {
          childArray.push(children[i].childId);
      }
      inQuery.$in = childArray;
      let items = await this.model.find({_id: inQuery});
      return items;
    }
  }


