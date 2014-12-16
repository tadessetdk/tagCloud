//Written by Tadesse D. Feyissa. June 21, 2013.

//Extends Object, String, Array... with commonly used methods 

var ExtensionHelpers = {
   /*
    extend:       extends Array.prototype 
    @extendAll    [optional: default = false] override existing extensions
   */
   extend: function (target, extensions, extendAll){
  
    for(var name in extensions) { 
        (extendAll && (target.prototype[name] = extensions[name])) || 
        ((target.prototype[name]) || (target.prototype[name] = extensions[name]));
    }
    
  },
  
  isNativeFunction: function(fn){
  
      if(!fn || (typeof fn).toLowerCase() != 'function'){
          throw new TypeError('fn is not function');
      }
      
      return /\{(\s)*\[native code\](\s)*\}(\s)*$/.test(fn.toString());
      
  },
  
  fnCall: function(fn, that){
  
      var isNative = this.isNativeFunction(fn);
      
      return isNative ? fn : (function(){
         return fn.apply(that, arguments);
      });
  }
};

//Array helper methods
var ArrayHelpers = {
  
  /*
  extend:       extends Array.prototype 
  @extendAll    [optional: default = false] override existing extensions
   */
  extend: function (extendAll){
  
    ExtensionHelpers.extend(Array, ArrayExtensions, extendAll);    
    
  },
  
  /*
  containsItem: checks if a value is in an array
  @list:        array to search
  @val:         value to check if exists in list
  returns:      -1 if not found, or the index
  */
  containsItem: function(list, val){
      return list.indexOf(val); 
  },

  /*
  containsList: checks if a list is in an array
  @list:        array to search
  @vals:        values to check if exists in list
  returns:      boolean
  */
  containsList: function(list, vals){
      
      for(var i = 0 , len = vals.length ; i < len ; i++){
          if(ArrayHelpers.containsItem(list, vals[i]) === -1){
              return false;
          }
      }
      
      return true;
      
  },

  /*
  singlePropertyPluck:    extracts the value of the given property in the object
  @prop:                  property to extract
  @obj:                   the input object containing the property and value
  returns:                the value extracted
  */
  singlePropertyPluck: function(prop, obj){ 

      if(obj.hasOwnProperty(prop) && obj[prop]){
          return obj[prop];
      }
      
      return null;
      
  },

  /*
  multiplePropertiesPluck:  extracts the values of the given properties in the object
  @props:                 properties to extract
  @obj:                   the input object containing the properties and values
  returns:                the property-value pairs extracted
  */ 
  multiplePropertiesPluck: function(props, obj){ 
    
      var val = {};
     
      for(var i = 0, len = props.length ; i < len ; i++){
        
          var prop = props[i]; 
          
          if(obj.hasOwnProperty(prop) && obj[prop]){
                       
              val[prop] = obj[prop];

          }
        
      }
    
      return val;
    
  }
};
    
//  Array extended methods including
// (reduce, reduceRight, some, every, where, groupBy, contains, each, map, pluck, 
//  first, last, firstN, lastN, distinct, min, max, merge, intersect, union,  randomize)
//  Callback can be JavaScript or Native Browser functions 
var ArrayExtensions = { 

  /*
  reduce:   apply the operation provided and returns a single value
  @fn:      operation to apply
  returns:  single value, original array is not affected
  */
  reduce: function(fn, initial){
   
      var result = initial;
      var src = Object(this);
      var fnc = ExtensionHelpers.fnCall(fn, src);
      
      for(var i = 0 , len = src.length ; i < len ; i++){
          result =  fnc(result, src[i], i);
      }
      
      return result;
    
  }, 
  
  /*
  reduceRight:  apply the operation provided and returns a single value
                iterates over the array from right to left
  @fn:          operation to apply
  returns:      single value, original array is not affected
  */
  reduceRight: function(fn, initial){
   
      var result = initial;
      var src = Object(this);
      var fnc = ExtensionHelpers.fnCall(fn, src);
      
      for(var i = src.length - 1 ; i >= 0 ; i--){
          result =  fnc(result, src[i], i);
      }
      
      return result;
    
  }, 
  
  /*
  where:    filter the array based on the logic provided
  @fn:      filter logic to apply
  returns:  new list; the orginal array is not affected
  */
  where: function(fn){
   
      var result = [];
      var src = Object(this);
      var fnc = ExtensionHelpers.fnCall(fn, src);
      
      for(var i = 0 , len = src.length ; i < len ; i++){
          if(fnc(src[i], i)){
              result.push(src[i]);
          }
      }
      
      return result;
      
  },

  /*
  some:     checks if the array contains an element satisfying the criteria
  @fn:      criteria to apply
  returns:  returns boolean
  */
  some: function(fn){
   
    var result = [];
    var src = Object(this);
    var fnc = ExtensionHelpers.fnCall(fn, src);
    
    for(var i = 0 , len = src.length ; i < len ; i++){
        if(fnc(src[i], i)){
            return true;
        }
    }
    
    return false;
    
  },

  /*
  every:    checks if all elements in the array satisfying the criteria
  @fn:      criteria to apply
  returns:  returns boolean
  */
  every: function(fn){
   
    var result = [];
    var src = Object(this);
    var fnc = ExtensionHelpers.fnCall(fn, src);
    
    for(var i = 0 , len = src.length ; i < len ; i++){
        if(!fnc(src[i], i)){
            return false;
        }
    }
    
    return true;
    
  },

  /*
  groupBy:  group by the key returned by fn
  @fn:      the function to get the group key
  returns:  new list of key value pairs, he orginal array is not affected
  */
  groupBy: function(fn){
   
    var result = {};
    var src = Object(this);
    var fnc = ExtensionHelpers.fnCall(fn, src);
    
    for(var i = 0 , len = src.length ; i < len ; i++){
        var val = src[i];
        var key = fnc(val, i);
        (result[key]) ? (result[key].push(val)) : (result[key] = [val]);
    }
    
    return result;
    
  },

  /*
  contains: checks if one or more items is in an array
  @item:    single item or list to search in the array
  returns:  boolean
  */
  contains: function(item){
      return (item instanceof Array) ? 
              ArrayHelpers.containsList(this, item) : 
              ArrayHelpers.containsItem(this, item); 
  },

  /*
  each:     executes the provided operation for each item in the array
  @fn:      operation to execute
  returns:  none
  */
  each: function(fn){
    
      var src = Object(this);
      if(src.length === 0 ) return;
      
      var fnc = ExtensionHelpers.fnCall(fn, src);
      
      for(var i = 0, len = src.length ; i < len ; i++){
          fnc(src[i], i);
      }
    
  },
  
  /*
  map:      projecting each element using the operation provided
  @fn:      operation to apply
  returns:  mapped list, original array is not affected
  */
  map: function(fn){
   
      var result = [];
      var src = Object(this);
      var fnc = ExtensionHelpers.fnCall(fn, src);
     
      for(var i = 0 , len = src.length ; i < len ; i++){
          result.push(fnc(src[i], i));
      }
      
      return result;
    
  }, 

  /*
  pluck:              extracts the values of the given properties of each object in the list
  @props:             properties to extract
  @includeEmptyValue: [optional: default = false] determine if to include empty values 
  returns:            new array of values or property-value pairs extracted, original array is not affected
  */
  pluck: function(props, includeEmptyValue){ 
     
      var result = [];
      var src = Object(this);
      var proc = ((props instanceof Array) && (props.length > 1)) ? 
                      ArrayHelpers.multiplePropertiesPluck : 
                      ArrayHelpers.singlePropertyPluck;
      
      for(var i = 0 , len = src.length ; i < len ; i++){
      
        var val = proc(props, src[i]);
        
        if(includeEmptyValue || (!includeEmptyValue && val)){
            result.push(val); 
        }
        
      }
      
      return result;
    
  },

  /*
  elementAt:    get an element at the index specified, or return 'undefined'
  @index:       the position of the element
  returns:      the element at the index specified
  */
  elementAt: function(index){ 
      return this[index];   
  },
  
  /*
  elementAtOrNull:   get an element at the index specified, or null if the index is out of bound
  @index:            the position of the element
  returns:           the element at the index specified or null
  */
  elementAtOrNull: function(index){ 
      return this[index] || null;   
  },
 
  /*
  removeAt:    remove an element at the index specified
  @index:      the position of the element
  */
  removeAt: function(index){ 
       this.splice(index, 1);
  },
   
  /*
  first:    get the first item in the array or null
  returns:  the first element
  */
  first: function(){ 
      return this.length > 0 ? this[0] : null;   
  },

  /*
  last:    get the last item in the array or null
  returns: the last element
  */
  last: function(){ 
      return this.length > 0 ? this[this.length - 1] : null;   
  },

  /*
  firstN:   get the first N items in the array
  @n:       the number of fist items to return
  returns:  the first N elements
  */
  firstN: function(n){

      if(n <= 0) throw new Error("N cannot be less than 1");
      
      if(n > this.length) throw new Error("N cannot be larger than the array size");
     
      return this.slice(0, n); 
    
  },

  /*
  lastN:   get the last N items in the array
  @n:      the number of last items to return 
  returns: the last N elements
  */
  lastN: function(n){

      if(n <= 0) throw new Error("N cannot be less than 1");
      
      if(n > this.length) throw new Error("N cannot be larger than the array size");
     
      return this.slice(-n); 
    
  },

  /*
  distinct:   get the last N items in the array
  returns:    distinct elements; the original array is not modified
  */
  distinct: function(){
   
      var temp = {};
      
      for(var i = 0 , len = this.length ; i < len ; i++){
          var key =  '_' + ((typeof(this[i]).toLowerCase() === 'number') ? '_' : '' ) + this[i];
          temp[key] = this[i];
      }
     
      var result = [];
      
      for(var i in temp){
          if(temp.hasOwnProperty(i)){
             result.push(temp[i]);
          }
      }
      
      return result;
    
  },

  /*
  min:      get the item with the minimum value
  returns:  the minimum element
  */
  min: function(){ 

      if(this.length === 0 ) return null;
      
      var len = this.length;
      var min = this[len - 1];
      
      for(var i = len - 2 ; i >= 0 ; i--){
          min = min > this[i] ? this[i] : min;
      }
      
      return min;
      
  },

  /*
  max:      get the item with the maximum value
  returns:  the maximum element
  */
  max: function(){ 

      if(this.length === 0 ) return null;
      
      var len = this.length;
      var max = this[len - 1];
      
      for(var i = len - 2 ; i >= 0 ; i--){
          max = max < this[i] ? this[i] : max;
      }
      
      return max;
      
  },

  /*
  merge:    merge this array with another array following the logic provided
  @list:    the second array to merge 
  @fn:      the merge logic to apply 
  returns:  new array with merged elements
  */
  merge: function(list, fn){ 

      var src = Object(this);
      if(src.length === 0 || !list || list.length === 0) return null;
      
      var fnc = ExtensionHelpers.fnCall(fn, src);
      var minLength = src.length < list.length ? src.length : list.length;
      var result = [];
      
      for(var i = 0; i < minLength ; i++){
          result.push(fnc(src[i], list[i]));
      }
      
      return result;
      
  },
  
  /*
  intesect: get the intersection of this array with another array
  @list:    the second array to merge  
  returns:  new array with common elements
  */
  intersect: function(list, fn){ 

      var src = Object(this);
      if(src.length === 0 || !list || list.length === 0) return null;
      
      var l1 = src.distinct();
      var l2 = list.distinct();
    
      var shortList = l1.length < l2.length ? l1 : l2;
      var longList = l1.length < l2.length ? l2 : l1;
      
      var temp = {};
      
      for(var i = 0, len = shortList.length ; i < len ; i++){
         temp[shortList[i]] = 1;
      }
      
      var result = [];
      for(var i = 0, len = longList.length; i < len ; i++){
          if(temp[longList[i]]){
               result.push(longList[i]);
          }
      }
      
      return result;
      
  },
  
  /*
  union:    union this array with another array
            returns distinct values
  @list:    the second array to merge 
  returns:  new array with combined elements
  */
  union: function(list){ 
  
      var src = Object(this);
      if(src.length === 0 && (!list || list.length === 0)) return null;
      
      var l1 = src.distinct();
      var l2 = (list || []).distinct();
      
      for(var i = 0, len = l2.length ; i < len ; i++){
          if(l1.indexOf(l2[i]) === -1 ){
             l1.push(l2[i]);
          }
      }
      
      return l1;
     
  },

 /*
  randomize:    randomize the items
  returns:      the array with random order; original array is not affected
  */
  randomize: function(fn){ 
  
      var src = Object(this);
      if(src.length === 0) return src;
     
      var i = src.length;
      
      while(i){
        
          var indx = parseInt(Math.random() * i);
          var t = src[i-1];
          src[i-1] = src[indx];
          src[indx] = t;
          
          i--;
      }
     
     return src;
     
  }
  
};

//Extends Array.prototype
ArrayHelpers.extend();

//Object extensions
var objectExtensions = {
    keys : function () {

        var _keys = [];
        for (k in this) {
            if (this.hasOwnProperty(k)) {
                _keys.push(k);
            }
        }

        return _keys;
    }
};

//Extends Object.prototype
ExtensionHelpers.extend(Object, objectExtensions);

//String extensions
var stringExtensions = (function(){

    var formatRegExps = /(?:\{\d\})+/g;
         
    return {
        trimLeft : function (ch) {

            ch = ch || ' ';
            var pattern = new RegExp('^(' + ch + ')+');
            var src = Object(this);
            var match = pattern.exec(src);
            
            return !!match ? src.substr(match[0].length) : src;

        },

        trimRight : function (ch) {

            ch = ch || ' ';
            var pattern = new RegExp('(' + ch + ')+$');
            var src = Object(this);
            var match = pattern.exec(src);

            return !!match ? src.substr(0, src.length - match[0].length) : src;

        },

        trim : function (ch) {
            return this.trimLeft(ch).trimRight(ch);
        },
    
        format : function () {

            var result = Object(this);
            var args = arguments;
            
            return result.replace(formatRegExps, function(s){ 
                      return args[parseInt(s.substr(1, s.length - 2))] 
                   });

        }
    }

}());

//Extends String.prototype
ExtensionHelpers.extend(String, stringExtensions);
