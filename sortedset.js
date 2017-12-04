(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global.SortedSet = factory();
  }
}(this, function() {
  "use strict";

  // Internal private array which holds actual set elements
  var setArray;
  // Internal hash for quick determination of key existence
  var setHash;

  // Constructor for the SortedSet class
  function SortedSet(initial) {
    if (arguments.length > 0) {
      // TODO: Handle the case when initial array is provided; if array has
      // elements of duplicate value, reduce down to one instance and sort the
      // elements in ascending order.
      setArray = [];
      setHash = {};
      //sort the initial array
      var numberCompare = function (a, b) {
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
        return 0;
      }
      initial.sort(numberCompare);
      var lastValue = null;
      //add non duplicates to setArray
      for (var input = 0; input < initial.length; input++) {
        if (initial[input] !== lastValue) {
          setArray.push(initial[input]);
          setHash[initial[input]] = true;
        }
        lastValue = initial[input];
      }
    } else {
      setArray = [];
      setHash = {}
    }
  }

  /* Accessor; returns element at index
   */
  SortedSet.prototype.at = function(index) {
    return setArray[index];
  };

  /* Converts a set into an Array and returns the result
   */
  SortedSet.prototype.toArray = function() {
    return setArray.slice(0);
  };

  /* Converts a set into a String and returns the result
   */
  SortedSet.prototype.toString = function() {
    return setArray.toString();
  };

  /* Synchronously iterates elements in the set
   */
  SortedSet.prototype.forEach = function(callback, thisArg) {
    if (this === void 0 || this === null ||
        setArray === void 0 || setArray === null) {
      throw new TypeError();
    }

    var t = Object(setArray);
    var len = t.length >>> 0;
    if (typeof callback !== "function") {
      throw new TypeError();
    }

    var context = arguments[1];
    for (var i = 0; i < len; i++) {
      if (i in t) callback.call(context, t[i], i, t);
    }
  };

  /* Read-only property for getting number of elements in sorted set
   */
  Object.defineProperty(SortedSet.prototype, 'length', {
    get: function() {
      return setArray.length;
    }
  });

  /* Returns true if a given element exists in the set
   */
  SortedSet.prototype.contains = function(element) {
    // TODO: Implement contains method
    return (element in setHash);
  };

  /* Gets elements between startIndex and endIndex. If endIndex is omitted, a
   * single element at startIndex is returned.
   */
  SortedSet.prototype.get = function(startIndex, endIndex) {
    if (startIndex > endIndex) {
      return [];
    }
    // TODO: Implement get method
    if (endIndex === undefined) {
      return setArray[startIndex];
    } else if (startIndex !== undefined) {
      return setArray.slice(startIndex, endIndex+1);
    }
  };

  /* Gets all items between specified value range. If exclusive is set, values
   * at lower bound and upper bound are not included.
   */
  SortedSet.prototype.getBetween = function(lbound, ubound, exclusive) {
    if (lbound > ubound) {
      return [];
    }
    // TODO: Implement getBetween method
    //I cant use this logic in case we are storing decimals in the set
    // if (exclusive === true) {
    //   lbound++;
    //   ubound--;
    // }
    var ansArray = [];
    for (var index = 0; index < setArray.length; index++) {
      var currValue = setArray[index];
      if (exclusive === true) {
        if (currValue >= ubound) {
          break;
        }
        if (currValue > lbound) {
          ansArray.push(currValue);
        }
      } else {
        if (currValue > ubound) {
          break;
        }
        if (currValue >= lbound) {
          ansArray.push(currValue);
        }
      }
    }
  return ansArray;
  };

  /* Adds new element to the set if not already in set
   */
  SortedSet.prototype.add = function(element) {
    // TODO: Implement add method
    if (!(element in setHash)) {
      setHash[element] = true;
      //insert element into setArray
      //find the index to insert the element at; search linearly until element < currentItem or reach end of array
      var findInsertion = 0;
      while (findInsertion < setArray.length && element >= setArray[findInsertion]) {
        findInsertion++;
      }
      setArray.splice(findInsertion, 0, element);
    }
  };


  /* BONUS MARKS AWARDED IF IMPLEMENTED
   * Implement an asynchronous forEach function. (See above for synchrnous
   * implementation). This method ASYNCHRONOUSLY iterates through each elements
   * in the array and calls a callback function.
   */

  /* Removes element from set and returns the element
   */
  SortedSet.prototype.remove = function(element) {
    // TODO: Implement remove method
    if (element in setHash) {
      delete setHash[element];
      var deleteIndex = setArray.indexOf(element);
      var deleteElement = setArray.splice(deleteIndex, 1);
      return deleteElement[0];
    }
  };

  /* Removes element at index location and returns the element
   */
  SortedSet.prototype.removeAt = function(index) {
    // TODO: Implement removeAt method
    if (index >= 0 && index < setArray.length) {
      var deleteElement = setArray[index];
      var confirmedDelete = this.remove(deleteElement);
      return confirmedDelete; 
    }
  };

  /* Removes elements that are larger than lower bound and smaller than upper
   * bound and returns removed elements.
   */
  SortedSet.prototype.removeBetween = function(lbound, ubound, exclusive) {
    // TODO: Implement removeBetween method
    //find the index to remove the element at
    var removedStuff = this.getBetween(lbound, ubound, exclusive);
    var lowElementIndex = null;
    if (removedStuff.length >= 1) {
      lowElementIndex = setArray.indexOf(removedStuff[0]);
      setArray.splice(lowElementIndex, removedStuff.length);
    }
    //delete from internal hash too
    for (var hashRemove = 0; hashRemove < removedStuff.length; hashRemove++) {
      delete setHash[removedStuff[hashRemove]];
    }
    return removedStuff;
  };

  /* Removes all elements from the set
   */
  SortedSet.prototype.clear = function() {
    // TODO: Implement clear method
      setArray = [];
      setHash = {};
  };

  SortedSet.prototype.forEachAsync = function(callback, thisArg) {
    // TODO: Implement for bonus marks
  };

  return SortedSet;
}));
