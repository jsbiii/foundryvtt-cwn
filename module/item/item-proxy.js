import { CwnItem } from "./entity.js";
import { CwnAsset } from "./asset.js";

//Provide a type string to class object mapping to keep our code clean
const itemMappings = {
  asset: CwnAsset,
  spell: CwnItem,
  ability: CwnItem,
  armor: CwnItem,
  weapon: CwnItem,
  cyberware: CwnItem,
  item: CwnItem,
  focus: CwnItem,
  art: CwnItem,
  skill: CwnItem,
  cyberdeck: CwnItem,
  subject: CwnItem,
  verb: CwnItem
};

export const CwnItemProxy = new Proxy(function () {}, {
  //Will intercept calls to the "new" operator
  construct: function (target, args) {
    const [data] = args;
    //Handle missing mapping entries
    if (!itemMappings.hasOwnProperty(data.type))
      throw new Error("Unsupported Entity type for create(): " + data.type);

    //Return the appropriate, actual object from the right class
    return new itemMappings[data.type](...args);
  },

  //Property access on this weird, dirty proxy object
  get: function (target, prop, receiver) {
    switch (prop) {
      case "create":
      case "createDocuments":
        //Calling the class' create() static function
        return function (data, options) {
          if (data.constructor === Array) {
            //Array of data, this happens when creating Actors imported from a compendium
            return data.map(i => CwnItem.create(i, options));
          }

          if (!itemMappings.hasOwnProperty(data.type))
            throw new Error("Unsupported Entity type for create(): " + data.type);

          return itemMappings[data.type].create(data, options);
        };

      case Symbol.hasInstance:
        //Applying the "instanceof" operator on the instance object
        return function (instance) {
          return Object.values(itemMappings).some(i => instance instanceof i);
        };

      default:
        //Just forward any requested properties to the base Actor class
        return CwnItem[prop];
    }
  },
});
