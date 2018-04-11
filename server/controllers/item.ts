import Item from '../models/item';
import BaseCtrl from './base';

export default class ItemCtrl extends BaseCtrl {
  model = Item;

    // searchbyField
    search = (req, res) => {
      this.model.find({name : new RegExp( req.params.text, 'i' ) }, (err, items) => {
        if (err) { return console.error(err); }
        console.log(new RegExp('^' + req.params.text + '$', 'i' ));
        res.status(200).json(items);
      });
    }

    getItemInfo = (req,res) => {
      this.get(req,res);
      // var itemInfo = {
      //   name: 'sample 1',
      //   desc: 'Sample Description',
      //   customFields:[
      //     {
      //       label:'Countries Supported',
      //       value:'US, UK, NZ & AU',
      //     },
      //     {
      //       label:'Languages Supported',
      //       value:'ENG-US & ENG-AU',
      //     },
      //     {
      //       label:'Sample SKUs',
      //       value:'1234567, 3333333, 3323423',
      //     },
      
      //   ],
      //   objects:[
      //   {
      //     label:'Screenshot',
      //     type:'jpg',
      //     link:'http://some linkj'
      //   },
      //   {
      //     label:'Document',
      //     type:'pdf',
      //     link:'http://some linkj'
      //   },
      // ]
      // }
      // res.status(200).json(itemInfo);
    }

   getChildItems = (req, res) => {
    //  var items = [{
    //    _id:'001',
    //    name: 'sample 1',
    //    desc: 'Sample description'
    //  },
    //  {
    //   _id:'002',
    //   name: 'sample 2',
    //   desc: 'Sample description'
    // },
    // {
    //   _id:'003',
    //   name: 'sample 3',
    //   desc: 'Sample description'
    // }
    // ]
    // res.status(200).json(items);
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
       //res.status(200).json(items);
     });
    }
   }
}

