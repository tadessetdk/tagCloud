//Extends Array with commonly used methods 

//Array helper methods
var ArrayHelpers = {
  
  /*
  extend:       extends Array.prototype 
  @extendAll    [optional: default = false] override existing extensions
   */
  extend: function (extendAll){
  
    for(var name in ArrayExtensions) { 
        (extendAll && (Array.prototype[name] = ArrayExtensions[name])) || 
        ((Array.prototype[name]) || (Array.prototype[name] = ArrayExtensions[name]));
    }
    
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
          if(ArrayHelpers.containsItem(list, vals[i]) == -1){
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
    
      var val;
     
      for(var i = 0, len = props.length ; i < len ; i++){
        
          var prop = props[i]; 
          
          if(obj.hasOwnProperty(prop) && obj[prop]){
             
             (val || (val = {}));
              val[prop] = obj[prop];

          }
        
      }
    
      return val;
    
  },
  
  isNativeFunction: function(fn){
      return !!fn && (typeof fn).toLowerCase() === 'function' && /\{(\s)*\[native code\](\s)*\}(\s)*$/.test(fn.toString());
  },
  
  fnCall: function(fn, that){
  
      var isNative = ArrayHelpers.isNativeFunction(fn);
      
      return isNative ? fn : (function(){
         return fn.apply(that, arguments);
      });
  }
};
    
//  Array extended methods including
// (reduce, reduceRight, any, all, where, groupBy, contains, each, map, pluck, 
//  first, last, firstN, lastN, distinct, min, max, merge, intersect, union, clone, randomize)
//  Callback can be JavaScript or Native Browser functions 
var ArrayExtensions = { 

  /*
  reduce:   apply the operation provided and returns a single value
  @fn:      operation to apply
  returns:  single value, original array is not affected
  */
  reduce: function(fn, initial){
   
      var result = initial;
      var fnc = ArrayHelpers.fnCall(fn, this);
      
      for(var i = 0 , len = this.length ; i < len ; i++){
          result =  fnc(result, this[i], i);
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
      var fnc = ArrayHelpers.fnCall(fn, this);
      
      for(var i = this.length - 1 ; i >= 0 ; i--){
          result =  fnc(result, this[i], i);
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
      var fnc = ArrayHelpers.fnCall(fn, this);
      
      for(var i = 0 , len = this.length ; i < len ; i++){
          if(fnc(this[i], i)){
              result.push(this[i]);
          }
      }
      
      return result;
      
  },

  /*
  any:      checks if the array contains an element satisfying the criteria
  @fn:      criteria to apply
  returns:  returns boolean
  */
  any: function(fn){
   
    var result = [];
    var fnc = ArrayHelpers.fnCall(fn, this);
    
    for(var i = 0 , len = this.length ; i < len ; i++){
        if(fnc(this[i], i)){
            return true;
        }
    }
    
    return false;
    
  },

  /*
  all:      checks if all elements in the array satisfying the criteria
  @fn:      criteria to apply
  returns:  returns boolean
  */
  all: function(fn){
   
    var result = [];
    var fnc = ArrayHelpers.fnCall(fn, this);
    
    for(var i = 0 , len = this.length ; i < len ; i++){
        if(!fnc(this[i], i)){
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
    var fnc = ArrayHelpers.fnCall(fn, this);
    
    for(var i = 0 , len = this.length ; i < len ; i++){
        var val = this[i];
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
    
      if(this.length == 0 ) return;
      
      var fnc = ArrayHelpers.fnCall(fn, this);
      
      for(var i = 0, len = this.length ; i < len ; i++){
          fnc(this[i], i);
      }
    
  },
  
  /*
  map:      projecting each element using the operation provided
  @fn:      operation to apply
  returns:  mapped list, original array is not affected
  */
  map: function(fn){
   
      var result = [];
      var fnc = ArrayHelpers.fnCall(fn, this);
     
      for(var i = 0 , len = this.length ; i < len ; i++){
          result.push(fnc(this[i], i));
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
      
      var proc = ((props instanceof Array) && (props.length > 1)) ? 
                      ArrayHelpers.multiplePropertiesPluck : 
                      ArrayHelpers.singlePropertyPluck;
      
      for(var i = 0 , len = this.length ; i < len ; i++){
      
        var val = proc(props, this[i]);
        
        if(includeEmptyValue || (!includeEmptyValue && val)){
            result.push(val); 
        }
        
      }
      
      return result;
    
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
          var key =  '_' + ((typeof(this[i]) == 'number') ? '_' : '' ) + this[i];
          temp[key] = this[i];
      }
     
      var result = [];
      
      for(var i in temp){
          result.push(temp[i]);
      }
      
      return result;
    
  },

  /*
  min:      get the item with the minimum value
  returns:  the minimum element
  */
  min: function(){ 

      if(this.length == 0 ) return null;
      
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

      if(this.length == 0 ) return null;
      
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

      if(this.length == 0 || !list || list.length == 0) return null;
      
      var fnc = ArrayHelpers.fnCall(fn, this);
      var minLength = this.length < list.length ? this.length : list.length;
      var result = [];
      
      for(var i = 0; i < minLength ; i++){
          result.push(fnc(this[i], list[i]));
      }
      
      return result;
      
  },
  
  /*
  intesect: get the intersection of this array with another array
  @list:    the second array to merge  
  returns:  new array with common elements
  */
  intersect: function(list, fn){ 

      if(this.length == 0 || !list || list.length == 0) return null;
      
      var l1 = this.distinct();
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
  
      if(this.length == 0 && (!list || list.length == 0)) return null;
      
      var l1 = this.distinct();
      var l2 = (list || []).distinct();
      
      for(var i = 0, len = l2.length ; i < len ; i++){
          if(l1.indexOf(l2[i]) == -1 ){
             l1.push(l2[i]);
          }
      }
      
      return l1;
     
  },

/*
  clone:    clone the list,
            original array is not affected.
  returns:  copy of the list; 
  */
  clone: function(){ 
  
      var result = [];
      
      for(var i = this.length - 1 ;i >= 0 ; i--){   
          result.unshift(this[i]);
      }
      
      return result;
     
  },

 /*
  randomize:    randomize the items
  returns:      new array with random order; original array is not affected
  */
  randomize: function(fn){ 
  
      if(this.length == 0) return [];
     
      var result = this.clone();
      var i = result.length;
      
      while(i){
        
          var indx = parseInt(Math.random() * i);
          var t = result[i-1];
          result[i-1] = result[indx];
          result[indx] = t;
          
          i--;
      }
     
     return result;
     
  }
  
};

//Extends Array.prototype
ArrayHelpers.extend();