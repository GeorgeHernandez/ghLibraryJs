/***********************************************************
SUMMARY:
	ghLibraryJs is a common library that focuses on language level items and should not change from site-to-site.
		Direct prototypes to the JavaScript language.
		ghj object has extensions for the JavaScript language.
		gho object has extensions for just a few things like the DOM, cookies, etc.
	Common comment tags: NOTES, IMPLEMENTED, DEPENDENCIES, VARIANTS, AKA, EG, ATTRIBUTION,
	The methods of the gh Library are independent of each other except for the following:
		Array.prototype.remove which is dependent upon Array.prototype.indexesOf
		gho.cookieAllowed which is dependent on gho.cookieSet, gho.cookieGet, and gho.cookieDelete
		gho.cookieDelete which is dependent on gho.cookieGet
		gho.dateFormat which is dependent on Number.pad
COPYRIGHT:
	Creative Commons
	http://www.georgehernandez.com/h/About/#Copyright
DEV ONLY:
	http://www.georgehernandez.com/h/xComputers/JavaScript/Tests/includes/ghLibrary.js
MOD LOG:
	20081007 1324 Released version 20081007 1324. -gh@georgehernandez.com
	20081008 1212 Added Number.formatDecimal(). -gh@georgehernandez.com
	20081008 1312 Still thinking about escApos, escQuot, escBack, escAposBack, prepMSSQL, prepMySQL. -gh@georgehernandez.com
	20081017 1722 Tweaked using JSLint with these options: {bitwise: true, browser: true, eqeqeq: true, evil: true, nomen: true, onevar: true, plusplus: false, regexp: true, undef: true, white: true}. Two "errors" which I allowed: String.stripCommentsC has a . in its regexp and String.stripTagsX uses eval. There are a bunch of ++ and -- "errors", but I added parentheses as needed. -gh@georgehernandez.com
	20090106 1323 Added Date utility stuff. -gh@georgehernandez.com
	20090113 1055 Added more in dateFormat. -gh@georgehernandez.com
	20090211 1447 Added Date statics: msSecond, msMinute, msHour, msDay, msWeek. -gh@georgehernandez.com
	20090408 1430 Added ghj.dateNow = new Date(); -gh@georgehernandez.com
	20100609 1021 Switched indentation from spaces to tabs. Added arr.intersect(). -gh@georgehernandez.com
	20101215 1357 Precalculated times in milliseconds. -gh@georgehernandez.com
	20101215 1403 Got rid of eval in stripTagsX. -gh@georgehernandez.com
	20101215 1425 Added format() for Date. -gh@georgehernandez.com
	20101215 Still testing: intersectSorted, mergeSort, merge.
	20101217 1316 String's striptags() renamed to strip_tag() to match PHP's funtion.
	20101217 1316 String's stripTagsX() renamed to stripTag() in order to emphasize no more eval.
	20101220 1634 String's stripTags() tweaked to not mix up tags.
	20110102 1828 Dumped Date.parseISODate for a more elegant upgrade of Date.parse().
	20110427 1019 Added String's toTitleCase(). Added ghj's clone().
	20110628 0932 Tweaked Date.parse for potentially missing milliseconds.
    20111110 1617 Ran JSLint.
CONTENTS:
	ARRAY: clear, clone, compareArrays, diff, every, filter, first, foldl, foldr, forEach, indexesOf, indexOf, intArrayToString, last, lastIndexOf, map, max, mean, min, none, random, reduce, reduceRight, reject, remove, removeDuplicated, shuffle, size, some, sortNum, sum
	DATE Static: dayNames[], daysInMonth[], monthNames[], monthNumbers[], now(), parse()
	DATE Utils: format(), getElapsed(), getGMTOffset(), getDayOfYear(), getDSTOffset(), getDSTOffsetLocale(), getWeek(), getFirstDayOfMonth(), getLastDayOfMonth(), getDaysInMonth(), isLeapYear()
	NUMBER: constrain, formatDecimal, getSuffix, isInt, pad
	STRING: encML, endsWith, [escAll], format, pad, padr, repeat, reverse, strip_tags, stripCommentsC, stripCommentsSGML, stripTags, toggle, toIntArray, toTitleCase, trim, triml, trimr, unformatNumber
	ghj: clone, dateFormat, dateNow, equals, typeOf, wait
	gho: $, cookieAllowed, cookieDelete, cookieGet, cookieSet, getElementsByClass, insertAfter, toggle
***********************************************************/
/*jslint bitwise: true, browser: true, eqeqeq: true, evil: true, nomen: true, onevar: true, plusplus: true, regexp: true, undef: true, white: true */

// Array XXXXXXXXXX
if (!Array.prototype.clear) {
	Array.prototype.clear = function () {
		// NOTES: Empties the array. Mainly for legibility of code because you could just do this: myArray.length = 0
		// EG: [1,2].clear() // returns []
		// ATTRIBUTION: Thanks to http://www.prototypejs.org/assets/2007/11/6/prototype.js
		this.length = 0;
		return this;
	};
}
if (!Array.prototype.clone) {
	Array.prototype.clone = function () {
		// NOTES: Copies the array and leaves the original intact. Mainly for legibility of code because you could just do: myArray2 = myArray.slice()
		// EG: [1,2].clone() // returns [1,2]
		// ATTRIBUTION: Thanks to http://www.prototypejs.org/assets/2007/11/6/prototype.js
		return [].concat(this);
	};
}
if (!Array.prototype.compareArrays) {
	Array.prototype.compareArrays = function (arr) {
		// NOTES: Returns true if the arrays are equivalent as opposed to the same instance.
		// EG: [1,2].compareArrays([1,2]) // returns true
		// ATTRIBUTION: Thanks to http://www.svendtofte.com/code/usefull_prototypes/
		var i;
		if (this.length !== arr.length) {
			return false;
		}
		for (i = 0; i < arr.length; i++) {
			if (this[i].compareArrays) { // likely nested array
				if (!this[i].compareArrays(arr[i])) {
					return false;
				} else {
					continue;
				}
			}
			if (this[i] !== arr[i]) {
				return false;
			}
		}
		return true;
	};
}
if (!Array.prototype.diff) {
	Array.prototype.diff = function (c, m) {
		// NOTES: Returns array of values in array c not in this array. If optional m is true, then returns the index of items in c not in the array. In Set Theory, this is like a complement. See also .instersect and JS native .concat.
		// EG: [1,2,3].diff([1,2,4,5]) // returns [4,5]
		// ATTRIBUTION: Thanks to http://jsfromhell.com/array/diff
		var d = [], e = -1, h, i, j, k, x;
		for (i = c.length, k = this.length; i--;) {
			for (j = k; j && (h = c[i] !== this[--j]);) {
			}
			x = h && (d[++e] = m ? i : c[i]);
		}
		return d;
	};
}
if (!Array.prototype.every) {
	Array.prototype.every = function (fun) {
		// NOTES: Returns true if all elements in the array return true for the testing function. The testing function has 3 parameters: the current element, the index of the current element, and the array object being traversed. The testing function works with the array as it was before the first iteration, i.e. filter does not care or see if the testing function modifies the original array. If the 2nd parameter thisp is provided, then it will be used as the this in the testing function. Opposite of Array.prototype.none.
		// IMPLEMENTED: JS 1.6; ECMA-262 not.
		// EG: [1,2,3].every(function (n) {return n>0}) // returns true
		// ATTRIBUTION: Thanks to http://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/every
		// ATTRIBUTION: Derived by georgehernandez.com from http://snippets.dzone.com/posts/show/575
		var len = this.length, thisp = arguments[1], i;
		if (typeof fun !== "function") {
			throw new TypeError();
		}
		for (i = 0; i < len; i++) {
			if (i in this && !fun.call(thisp, this[i], i, this)) {
				return false;
			}
		}
		return true;
	};
}
if (!Array.prototype.filter) {
	Array.prototype.filter = function (fun) {
		// NOTES: Creates a new array composed of the elements that return true for the testing function fun. The testing function has 3 parameters: the current element, the index of the current element, and the array object being traversed. The testing function works with the array as it was before the first iteration, i.e. filter does not care or see if the testing function modifies the original array. If the 2nd parameter is provided, then it will be used as the this in the testing function. Opposite of Array.prototype.reject.
		// IMPLEMENTED: JS 1.6; ECMA-262 not.
		// AKA: select; find_all.
		// EG: [1,2,3].filter(function (e,i,a) {return (e>2)}) // returns [3]
		// ATTRIBUTION: Thanks to http://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/filter
		// ATTRIBUTION: Derived by georgehernandez.com from http://snippets.dzone.com/posts/show/575
		var len = this.length, res = [], thisp = arguments[1], i, val;
		if (typeof fun !== "function") {
			throw new TypeError();
		}
		for (i = 0; i < len; i++) {
			if (i in this) {
				val = this[i]; // in case fun mutates this
				if (fun.call(thisp, val, i, this)) {
					res.push(val);
				}
			}
		}
		return res;
	};
}
if (!Array.prototype.first) {
	Array.prototype.first = function () {
		// NOTES: Returns the 1st item of an array, or undefined if the array is empty. Mainly for legibility of code because you could just do: myArray[0]
		// EG: [1,2].first() // returns 1
		// ATTRIBUTION: Thanks to http://www.prototypejs.org/assets/2007/11/6/prototype.js
		return this[0];
	};
}
if (!Array.prototype.foldl) {
	Array.prototype.foldl = function (fnc, start) {
		// NOTES: The first pass applies a given function using the start parameter and the LEFT-most item of the array. The seond pass applies the given function using the result of the first pass and the parameter next from the LEFT-most in the arry. And so on. Assmumes that the given function takes 2 parameters and returns 1 value.
		// AKA: inject.
		// VARIANTS: reduce
		// EG: ['x','y'].foldl(function (m,n) {return m+n;},'z') // is like y+(x+z) or 'yxz'
		// ATTRIBUTION: Thanks to http://www.svendtofte.com/code/usefull_prototypes/
		var a = start, i;
		for (i = 0; i < this.length; i++) {
			a = fnc(this[i], a);
		}
		return a;
	};
}
if (!Array.prototype.foldr) {
	Array.prototype.foldr = function (fnc, start) {
		// NOTES: The first pass applies a given function using the start parameter and the RIGHT-most item of the array. The seond pass applies the given function using the result of the first pass and the parameter next from the RIGHT-most in the arry. And so on. Assmumes that the given function takes 2 parameters and returns 1 value.
		// AKA: inject.
		// VARIANTS: reduceRight
		// EG: ['x','y'].foldr(function (m,n) {return m+n;},'z') // is like x+(y+z) or 'xyz'
		// ATTRIBUTION: Thanks to http://www.svendtofte.com/code/usefull_prototypes/
		var a = start, i;
		for (i = this.length - 1; i > -1; i--) {
			a = fnc(this[i], a);
		}
		return a;
	};
}
if (!Array.prototype.forEach) {
	Array.prototype.forEach = function (fnc) {
		// NOTES: Returns an array where a given function has been applied to the original array. The given function has 3 parameters: the current element, the index of the current element, and the array object being traversed. The given function works with the array as it was before the first iteration, i.e. filter does not care or see if the given function modifies the original array. If the 2nd parameter is provided, then it will be used as the this in the given function.
		// AKA: collect.
		// IMPLEMENTED: JS 1.6; ECMA-262 not.
		// EG: [1,2,3].forEach(function (e,i,a) {alert(i+' is '+e)}) // alerts 1,2,3
		// EG: function boo(element, index, array) { alert(element) }; [1,2,3].forEach(boo); // alerts 1,2,3
		// ATTRIBUTION: Thanks to http://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/forEach
		var len = this.length, thisp = arguments[1], i;
		if (typeof fnc !== "function") {
			throw new TypeError();
		}
		for (i = 0; i < len; i++) {
			if (i in this) {
				fnc.call(thisp, this[i], i, this);
			}
		}
	};
}
if (!Array.prototype.indexesOf) {
	Array.prototype.indexesOf = function (elt) {
		// NOTES: Returns an empty array if the parameter is not found, otherwise return an array of the indexes where the parameter was found. Note finding a string is different from finding a number. EG: '1' is not the same as 1.
		// VARIANTS: Some return true or false. Some return 1st index found or false. Some return true or indexes or false. Some return 1st index found or map.
		// EG: [0,1,3,1,'1','foo'].indexesOf(1) // returns [1,3]
		// EG: [0,1,3,1,'1','foo'].indexesOf(/^f/) // returns [5]
		// ATTRIBUTION: Derived by georgehernandez.com from http://www.hunlock.com/blogs/Ten_Javascript_Tools_Everyone_Should_Have
		var a = [], from, i;
		from = Number(arguments[1]) || 0;
		from = (from < 0) ? Math.ceil(from) : Math.floor(from);
		if (from < 0) {
			from += this.length;
		}
		for (i = from; i < this.length; i++) {
			if (typeof (elt) === 'object' && elt.constructor === RegExp) {
				if (elt.test(this[i])) {
					a.push(i);
				}
			} else if (this[i] === elt) {
				a.push(i);
			}
		}
		return a;
	};
}
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (elt) {
		// NOTES: Returns the index of the first occurrence of the given value, or -1 if not present. The optional 2nd parameter from is the index from which to start looking and defaults to 0 if not provided.
		// IMPLEMENTED: JS 1.6; ECMA-262 not.
		// EG: [1,2,3].indexOf(3) // Returns 2
		// ATTRIBUTION: Thanks to http://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/indexOf
		var len = this.length, from = Number(arguments[1]) || 0;
		from = (from < 0) ? Math.ceil(from) : Math.floor(from);
		if (from < 0) {
			from += len;
		}
		for (; from < len; from++) {
			if (from in this && this[from] === elt) {
				return from;
			}
		}
		return -1;
	};
}
if (!Array.prototype.intArrayToString) {
	Array.prototype.intArrayToString = function () {
		// NOTES: Can use in conjunction with String.toIntArray()
		// EG: [98,97,114].intArrayToString() // returns 'bar'
		// ATTRIBUTION: Thanks to http://www.svendtofte.com/code/usefull_prototypes/
		var a = '', i;
		for (i = 0; i < this.length; i++) {
			if (typeof this[i] !== "number") {
				throw new Error("Array must be all numbers");
			} else if (this[i] < 0) {
				throw new Error("Numbers must be 0 and up");
			}
			a += String.fromCharCode(this[i]);
		}
		return a;
	};
}
if (!Array.prototype.intersect) {
	Array.prototype.intersect = function () {
		// NOTES: Returns the intersection between the calling array and any number of arrays passed as arguments. See also .diff and JS native .concat.
		// EG: [1,2,3].intersect([2,3,4]) // returns [2,3]
		// ATTRIBUTION: Thanks to http://www.jslab.dk/library/Array.intersect
		var a, a1, a2, n, l, l2, i, j;
		if (!arguments.length) {
			return [];
		}
		a1 = this;
		a = a2 = null;
		n = 0;
		while (n < arguments.length) {
			a = [];
			a2 = arguments[n];
			l = a1.length;
			l2 = a2.length;
			for (i = 0; i < l; i++) {
				for (j = 0; j < l2; j++) {
					if (a1[i] === a2[j]) {
						a.push(a1[i]);
					}
				}
			}
			a1 = a;
			n++;
		}
		return a;
	};
}
if (!Array.prototype.intersectSorted) { // Not thoroughly tested
	Array.prototype.intersectSorted = function () {
		// NOTES: This breaks once a match has been found, thus reducing run time
        function merge(left, right) {
			var llength = left.length;
			var rlength = right.length;
			var result = [];
			var i = 0;
			var k = 0;
			var j = 0;
			var m = 0;
            var q;
			while (llength > 0 || rlength > 0) {
				if (llength > 0 && rlength > 0) {
					if (left[j] <= right[m]) {
						result[k] = left[j];
						k++; // result
						j++; // left
						llength--;
					} else {
						result[k] = right[m];
						k++;
						m++;
						rlength--;
					}
				} else if (llength > 0) {
					q = result.length;
					for (i = j; i < left.length; i++) {
						result[q] = left[i];
						q++;
					}
					break;
				} else if (rlength > 0) {
					q = result.length;
					for (i = m; i < right.length; i++) {
						result[q] = right[i];
						q++;
					}
					break;
				}
			}
			
			return result;
		}
		function mergeSort(array) {
			var length = array.length;
			if (length <= 1) {
				return array;
			}
            var left = [];
            var right = [];
            
            var mi = (array.length) % 2;
            if (mi === 0) {
                mi = (array.length) / 2;
            } else {
                mi = (array.length - 1) / 2;
            }
            var i;
            for (i = 0; i < mi; i++) {
                left[i] = array[i];
            }
            var j = 0;
            for (i = mi; i < array.length; i++) {
                right[j] = array[i];
                j++;
            }
            j = 0;
            left = mergeSort(left);
            right = mergeSort(right);
            var result = [];
            result = merge(left, right);
            return result;
		}
        if (!arguments.length) {
			return [];
		}
		var a1 = this;
		var a2 = null;
		// a = [];
		var k = a1.length;
		// var d = new Date();
		var n = 0;
        var l2;
        var i;
		// Concentate the strings together
		while (n < arguments.length) {
			a2 = arguments[n];
			l2 = a2.length;
			for (i = 0; i < l2; i++) {
				a1[k] = a2[i];
				k++;
			}
			n++;
		}
		// Sort the strings
		a1 = mergeSort(a1);
		var a = [];
		// Keep the duplicate neighbors. (Curr. Only one array can be intersected)
		var l = a1.length;
		for (i = 0; i < l; i++) {
			if (a1[i] === a1[i + 1]) {
				a.push(a1[i]);
			}
		}
		// a = mergeSort(a);
		return a;
	};
}
if (!Array.prototype.last) {
	Array.prototype.last = function () {
		// NOTES: Returns the lasst item of an array, or undefined if the array is empty
		// EG: [1,2].last() // returns 2
		// ATTRIBUTION: Thanks to http://www.prototypejs.org/assets/2007/11/6/prototype.js
		return this[this.length - 1];
	};
}
if (!Array.prototype.lastIndexOf) {
	Array.prototype.lastIndexOf = function (elt) {
		// NOTES: Returns the index of the first occurrence of the given value, or -1 if not present. The optional 2nd parameter is the index from which to start looking and defaults to 0 if not provided.
		// IMPLEMENTED: JS 1.6; ECMA-262 not.
		// EG: [1,3,3].lastIndexOf(3) // returns 2
		// ATTRIBUTION: Thanks to http://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/lastIndexOf
		var len = this.length, from = Number(arguments[1]);
		if (isNaN(from)) {
			from = len - 1;
		} else {
			from = (from < 0) ? Math.ceil(from) : Math.floor(from);
			if (from < 0) {
				from += len;
			} else if (from >= len) {
				from = len - 1;
			}
		}
		for (; from > -1; from--) {
			if (from in this && this[from] === elt) {
				return from;
			}
		}
		return -1;
	};
}
if (!Array.prototype.map) {
	Array.prototype.map = function (fnc) {
		// NOTES: Returns an array where a given function has been applied to the original array. The given function has 3 parameters: the current element, the index of the current element, and the array object being traversed. The given function works with the array as it was before the first iteration, i.e. filter does not care or see if the given function modifies the original array. If the 2nd parameter is provided, then it will be used as the this in the given function.
		// AKA: collect.
		// EG: [1,2,3].map(function (n) {return n+n}) // returns [2,4,6]
		// EG: function dbl(n) {return n+n}; [1,2,3].map(dbl); // returns [2,4,6]
		// ATTRIBUTION: Thanks to http://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/map
		// ATTRIBUTION: Thanks to http://www.svendtofte.com/code/usefull_prototypes/
		var len = this.length, res = [], thisp = arguments[1], i;
		if (typeof fnc !== "function") {
			throw new TypeError();
		}
		for (i = 0; i < len; i++) {
			if (i in this) {
				res[i] = fnc.call(thisp, this[i], i, this);
			}
		}
		return res;
	};
}
if (!Array.prototype.max) {
	Array.prototype.max = function () {
		// NOTES: Returns the item with the highest value. Will return NaN if any items are NaN
		// EG: [1,2,3].max() // returns 3
		// ATTRIBUTION: Thanks to http://snippets.dzone.com/posts/show/5753
		return Math.max.apply({}, this);
	};
}
if (!Array.prototype.mean) {
	Array.prototype.mean = function () {
		// NOTES: Returns the arithmetic mean or average. Will return NaN if any items are NaN
		// EG: [1,2,3].mean() // returns 2
		// ATTRIBUTION: By georgehernandez.com for the public domain.
		var i = 0;
        for (i = 0, sum = 0; i < this.length; sum += this[i++]) {
		
		}
		return sum / this.length;
	};
}
if (!Array.prototype.min) {
	Array.prototype.min = function () {
		// NOTES: Returns the item with the lowest value. Will return NaN if any items are NaN
		// EG: [1,2,3].min() // returns 1
		// ATTRIBUTION: Thanks to http://snippets.dzone.com/posts/show/5753
		return Math.min.apply({}, this);
	};
}
if (!Array.prototype.none) {
	Array.prototype.none = function (fun) {
		// NOTES: Returns true if all elements in the array return false for the testing function. The testing function has 3 parameters: the current element, the index of the current element, and the array object being traversed. The testing function works with the array as it was before the first iteration, i.e. filter does not care or see if the testing function modifies the original array. If the 2nd parameter thisp is provided, then it will be used as the this in the testing function. Opposite of Array.prototype.every.
		// EG: [1,2,3].none(function (n) {return n>0}) // returns false
		// ATTRIBUTION: Thanks to http://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/every
		// ATTRIBUTION: Derived by georgehernandez.com from http://snippets.dzone.com/posts/show/575
		var len = this.length, thisp = arguments[1], i;
		if (typeof fun !== "function") {
			throw new TypeError();
		}
		for (i = 0; i < len; i++) {
			if (i in this && fun.call(thisp, this[i], i, this)) {
				return false;
			}
		}
		return true;
	};
}
if (!Array.prototype.random) {
	Array.prototype.random = function () {
		// NOTES: Returns random item from an array
		// EG: ["rock", "sissors", "paper"].random()
		// ATTRIBUTION: Thanks to http://www.svendtofte.com/code/usefull_prototypes/
		return this[Math.floor((Math.random() * this.length))];
	};
}
if (!Array.prototype.reduce) {
	Array.prototype.reduce = function (fun) {
		// NOTES: Applies a given function against two elements of an array (left-to-right). The given function has 3 parameters: the previous value, the current element, the index of the current element, and the array object being traversed. If the optional initial value parameter is provided, then the first iteration of the callback function uses the initial value and the 1st value of the array as previous and current values respectively.
		// VARIANTS: mapl: The difference between mapl and reduce is that the former requires the initial value parameter; inject
		// EG: ['a','b','c'].reduce(function (m,n) {return m+n;}) // is like y+(x+z) or 'yxz'
		// ATTRIBUTION: Thanks to http://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
		var len = this.length, i = 0, rv;
		if (typeof fun !== "function") {
			throw new TypeError();
		}
		// no value to return if no initial value and an empty array
		if (len === 0 && arguments.length === 1) {
			throw new TypeError();
		}
		if (arguments.length >= 2) {
			rv = arguments[1];
		} else {
			do {
				if (i in this) {
					rv = this[i++];
					break;
				}
				// if array contains no values, no initial value to return
				if (++i >= len) {
					throw new TypeError();
				}
			} while (true);
		}
		for (; i < len; i++) {
			if (i in this) {
				rv = fun.call(null, rv, this[i], i, this);
			}
		}
		return rv;
	};
}
if (!Array.prototype.reduceRight) {
	Array.prototype.reduceRight = function (fun) {
		// NOTES: Applies a given function against two elements of an array (right-to-left). The given function has 3 parameters: the previous value, the current element, the index of the current element, and the array object being traversed. If the optional initial value parameter is provided, then the first iteration of the callback function uses the initial value and the 1st value of the array as previous and current values respectively.
		// VARIANTS: foldr: The difference between foldr and reduceRight is that the former requires the initial value parameter; inject
		// EG: ['a','b','c'].reduceRight(function (m,n) {return m+n;}) // is like y+(x+z) or 'yxz'
		// ATTRIBUTION: Thanks to http://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
		var len = this.length, i, rv;
		if (typeof fun !== "function") {
			throw new TypeError();
		}
		// no value to return if no initial value, empty array
		if (len === 0 && arguments.length === 1) {
			throw new TypeError();
		}
		i = len - 1;
		if (arguments.length >= 2) {
			rv = arguments[1];
		} else {
			do {
				if (i in this) {
					rv = this[i--];
					break;
				}
				// if array contains no values, no initial value to return
				if (--i < 0) {
					throw new TypeError();
				}
			} while (true);
		}
		for (; i >= 0; i--) {
			if (i in this) {
				rv = fun.call(null, rv, this[i], i, this);
			}
		}
		return rv;
	};
}
if (!Array.prototype.reject) {
	Array.prototype.reject = function (fun) {
		// NOTES: Creates a new array composed of the elements that return false for the testing function fun. The testing function has 3 parameters: the current element, the index of the current element, and the array object being traversed. The testing function works with the array as it was before the first iteration, i.e. filter does not care or see if the testing function modifies the original array. If the 2nd parameter is provided, then it will be used as the <code>this</code> in the testing function. Opposite of Array.prototype.filter.
		// EG: [1,2,3].reject(function (e,i,a) {return (e>2)}) // returns [1,2]
		// ATTRIBUTION: Derived by georgehernandez.com from http://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/filter
		// ATTRIBUTION: Derived by georgehernandez.com from http://snippets.dzone.com/posts/show/575
		var len = this.length, res = [], thisp = arguments[1], i, val;
		if (typeof fun !== "function") {
			throw new TypeError();
		}
		for (i = 0; i < len; i++) {
			if (i in this) {
				val = this[i]; // in case fun mutates this
				if (!fun.call(thisp, val, i, this)) {
					res.push(val);
				}
			}
		}
		return res;
	};
}
if (!Array.prototype.remove) {
	Array.prototype.remove = function (elt) {
		// NOTES: Removes a given item from the array.
		// DEPENDENCIES: This function is dependent on Array.prototype.indexesOf
		// EG: [0,1,3,1,'1','foo'].remove(1) // returns [0,3,'1','foo']
		// ATTRIBUTION: By georgehernandez.com for the public domain.
		var a = this.indexesOf(elt), i;
		for (i = 0; i < a.length; i++) {
			this.splice(a[i], 1);
		}
		return this;
	};
}
if (!Array.prototype.removeDuplicated) {
	Array.prototype.removeDuplicated = function (s) {
		// NOTES: Returns an array without duplicates. Pass optional s as true if the array is already sorted.
		// AKA: uniq
		// VARIANTS: Functions the same as http://www.prototypejs.org/assets/2007/11/6/prototype.js
		// EG: [1,2,3,3].removeDuplicated() // returns [1,2,3]
		// ATTRIBUTION: By georgehernandez.com for the public domain.
		var a = this.slice(), p, i, j;
		if (s) {
			for (i = a.length; i > 1;) {
				if (a[--i] === a[i - 1]) {
					for (p = i - 1; (p--) && a[i] === a[p];) {
					}
					i -= a.splice(p + 1, i - p - 1).length;
				}
			}
		} else {
			for (i = a.length; i;) {
				for (p = (--i); p > 0;) {
					if (a[i] === a[--p]) {
						for (j = p; --p && a[i] === a[p];) {
						}
						i -= a.splice(p + 1, j - p).length;
					}
				}
			}
		}
		return a;
	};
}
if (!Array.prototype.shuffle) {
	Array.prototype.shuffle = function () {
		// NOTES: Returns the array in a random new order.
		// EG: [0,1,2,3].shuffle() // returns something like [3,1,0,2]
		// ATTRIBUTION: Derived by georgehernandez.com from http://jsfromhell.com/array/shuffle
		var copy = this.slice(), v = [], i, j;
		for (i = 0; i < this.length; i++) {
			j = Math.floor((Math.random() * copy.length));
			v[i] = copy[j];
			copy.splice(j, 1);
		}
		return v;
	};
}
if (!Array.prototype.size) {
	Array.prototype.size = function () {
		// NOTES: Returns the size of the array. Mainly for legibility of code because you could just do: myArray.length
		// EG: [1,2].size() // returns 2
		// ATTRIBUTION: Thanks to http://www.prototypejs.org/assets/2007/11/6/prototype.js
		return this.length;
	};
}
if (!Array.prototype.some) {
	Array.prototype.some = function (fun) {
		// NOTES: Returns true if any elements in the array return true for the testing function. The testing function has 3 parameters: the current element, the index of the current element, and the array object being traversed. The testing function works with the array as it was before the first iteration, i.e. filter does not care or see if the testing function modifies the original array. If the 2nd parameter pthis is provided, then it will be used as the this in the testingFunction.
		// IMPLEMENTED: JS 1.6; ECMA-262 not.
		// AKA: any.
		// EG: [1,2,3].some(function (n) {return n>0}) // returns true
		// ATTRIBUTION: Thanks to http://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/some
		// ATTRIBUTION: Derived by georgehernandez.com from http://snippets.dzone.com/posts/show/575
		var len = this.length, thisp = arguments[1], i;
		if (typeof fun !== "function") {
			throw new TypeError();
		}
		for (i = 0; i < len; i++) {
			if (i in this && fun.call(thisp, this[i], i, this)) {
				return true;
			}
		}
		return false;
	};
}
if (!Array.prototype.sortNum) {
	Array.prototype.sortNum = function () {
		// NOTES: Needed because Array.sort() sorts alphabetically. Not return a-b in order to avoid overflows
		// EG: [2,1,10].sortNum() // returns [1,2,10]
		// ATTRIBUTION: Derived by georgehernandez.com from http://www.hunlock.com/blogs/Ten_Javascript_Tools_Everyone_Should_Have
		return this.sort(function (a, b) {
			if (a > b) {
				return 1;
			}
			if (a < b) {
				return -1;
			}
			return 0;
		});
	};
}

if (!Array.prototype.sum) {
	Array.prototype.sum = function () {
		// NOTES: Sums the items of an array
		// EG: [1,2,3].sum() // returns 6
		// ATTRIBUTION: Thanks to http://snippets.dzone.com/posts/show/5753
		var i, sum;
		for (i = 0, sum = 0; i < this.length; sum += this[i++]) {
		}
		return sum;
	};
}

// Date Static XXXXXXXXXX
Date.dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
Date.daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // Adjusted for leap years when used in getDaysOfYear, getLastDayOfMonth, getDays I
Date.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
Date.monthNumbers = {Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11};
Date.msSecond = 1000;
Date.msMinute = 60000; // 1000 * 60
Date.msHour = 3600000; // 1000 * 60 * 60
Date.msDay = 86400000; // 1000 * 60 * 60 * 24
Date.msWeek = 604800000; // 1000 * 60 * 60 * 24 * 7
if (!Date.now) {
	// NOTE: Returns milliseconds since midnight 01 January, 1970 UTC for the system date and time
	// NOTE: Built into some versions of JavaScript but not others.
	Date.now = function () {
		var d = new Date();
		return d.getTime();
	};
}

// ATTRIBUTION: http://zetafleet.com/blog/javascript-dateparse-for-iso-8601
// NOTES: Takes strings like '2011-01-02T13:12:13:123','2011-01-02T13:12:13', '2011-01-02 13:12 +03:00', '2011-01-02 13:12:13', and '2011-01-02'.
// NOTES: Compare to the parse() built into Date. JS 1.8.5 may have this built in.
/**
 * Date.parse with progressive enhancement for ISO-8601, version 2
 * © 2010 Colin Snover <http://zetafleet.com>
 * Released under MIT license.
 */
(function () {
    var origParse = Date.parse;
    Date.parse = function (date) {
        var timestamp = origParse(date), minutesOffset = 0, struct;
        if (isNaN(timestamp) && (struct = /^(\d{4}|[+\-]\d{6})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3,}))?)?(?:(Z)|([+\-])(\d{2})(?::?(\d{2}))?))?/.exec(date))) {
            if (struct[8] !== 'Z') {
                minutesOffset = +struct[10] * 60 + (+struct[11]);
                
                if (struct[9] === '+') {
                    minutesOffset = 0 - minutesOffset;
                }
            }

            if (!struct[7]) {
                struct[7] = '000';
            }
            
            timestamp = Date.UTC(+struct[1], +struct[2] - 1, +struct[3], +struct[4], +struct[5] + minutesOffset, +struct[6], +struct[7].substr(0, 3));
        }
        
        return timestamp;
    };
}());

// Date Utils XXXXXXXXXX
if (!Date.prototype.format) {
	Date.prototype.format = function(format) {
		// NOTES: Simulates PHP's date function (http://us2.php.net/manual/en/function.date.php)
		// EG: var d = new Date(2010, 0, 7); alert(d.format('\\M\\: M')); // Alerts "Jan M"
		// ATTRIBUTION: Thanks to http://jacwright.com/projects/javascript/date_format
		var returnStr = '';
		var replace = Date.replaceChars;
        var i = 0;
        var curChar;
		for (i = 0; i < format.length; i++) {
			curChar = format.charAt(i);
			if (i - 1 >= 0 && format.charAt(i - 1) === "\\") { 
				returnStr += curChar;
			}
			else if (replace[curChar]) {
				returnStr += replace[curChar].call(this);
			} else if (curChar !== "\\"){
				returnStr += curChar;
			}
		}
		return returnStr;
	};
	Date.replaceChars = {
		shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		longMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		longDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		
		// Day
		d: function() { return (this.getDate() < 10 ? '0' : '') + this.getDate(); }, // 01-31
		D: function() { return Date.replaceChars.shortDays[this.getDay()]; }, // Mon-Sun
		j: function() { return this.getDate(); }, // 1-31
		l: function() { return Date.replaceChars.longDays[this.getDay()]; }, // Sunday-Saturday
		N: function() { return this.getDay() + 1; }, // 1-7 (Mon-Sun)
		S: function() { return (this.getDate() % 10 === 1 && this.getDate() !== 11 ? 'st' : (this.getDate() % 10 === 2 && this.getDate() !== 12 ? 'nd' : (this.getDate() % 10 === 3 && this.getDate() !== 13 ? 'rd' : 'th'))); }, // st, nd, rd, th
		w: function() { return this.getDay(); }, // 0-6 (Sun-Sat)
		z: function() { var d = new Date(this.getFullYear(),0,1); return Math.ceil((this - d) / 86400000); }, // Fixed now // 0-365
		// Week
		W: function() { var d = new Date(this.getFullYear(), 0, 1); return Math.ceil((((this - d) / 86400000) + d.getDay() + 1) / 7); }, // Fixed now // ca 1-52
		// Month
		F: function() { return Date.replaceChars.longMonths[this.getMonth()]; }, // January-December
		m: function() { return (this.getMonth() < 9 ? '0' : '') + (this.getMonth() + 1); }, // 01-12
		M: function() { return Date.replaceChars.shortMonths[this.getMonth()]; }, // Jan-Dec
		n: function() { return this.getMonth() + 1; }, // 1-12
		t: function() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 0).getDate(); }, // Fixed now, gets #days of date // 28-31
		// Year
		L: function() { var year = this.getFullYear(); return (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)); },	// Fixed now // 1 if leap year
		o: function() { var d  = new Date(this.valueOf());  d.setDate(d.getDate() - ((this.getDay() + 6) % 7) + 3); return d.getFullYear();}, // Fixed now // ISO year
		Y: function() { return this.getFullYear(); }, // EG: 2010
		y: function() { return (this.getFullYear()).substr(2); }, // EG: 10 (2010)
		// Time
		a: function() { return this.getHours() < 12 ? 'am' : 'pm'; }, // am-pm
		A: function() { return this.getHours() < 12 ? 'AM' : 'PM'; }, // AM-PM
		B: function() { return Math.floor((((this.getUTCHours() + 1) % 24) + this.getUTCMinutes() / 60 + this.getUTCSeconds() / 3600) * 1000 / 24); }, // Fixed now // 000-999
		g: function() { return this.getHours() % 12 || 12; }, // 1-12
		G: function() { return this.getHours(); }, // 0-23
		h: function() { return ((this.getHours() % 12 || 12) < 10 ? '0' : '') + (this.getHours() % 12 || 12); }, // 01-12
		H: function() { return (this.getHours() < 10 ? '0' : '') + this.getHours(); }, // 00-23
		i: function() { return (this.getMinutes() < 10 ? '0' : '') + this.getMinutes(); }, // 00-59 (min)
		s: function() { return (this.getSeconds() < 10 ? '0' : '') + this.getSeconds(); }, // 00-59 (sec)
		u: function() { var m = this.getMilliseconds(); return (m < 10 ? '00' : (m < 100 ?	'0' : '')) + m; }, // 000-999
		// Timezone
		e: function() { return "Not Yet Supported"; }, // UTC, GMT, etc
		I: function() { return "Not Yet Supported"; }, // 1 if DST
		O: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + '00'; }, // -1200 to +1200
		P: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + ':00'; }, // Fixed now // -12:00 to +12:00
		T: function() { var m = this.getMonth(); this.setMonth(0); var result = this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1'); this.setMonth(m); return result;}, // EST, MDT, etc
		Z: function() { return -this.getTimezoneOffset() * 60; }, // -43200-50400 (sec)
		// Full Date/Time
		c: function() { return this.format("Y-m-d\\TH:i:sP"); }, // Fixed now // EG: 2010-01-07T13:14:15-06:00
		r: function() { return this.toString(); }, // EG: Thu Jan 07 2010 13:14:15 GMT-0600 (Central Standard Time)
		U: function() { return this.getTime() / 1000; } // Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT) // EG: 1262891655
	};
}
if (!Date.prototype.getElapsed) {
	Date.prototype.getElapsed = function (A) {
		// NOTES: Return the difference between the date instance and the current time (default) or a provided date.
		return Math.abs((A || new Date()).getTime() - this.getTime());
	};
}
if (!Date.prototype.getGMTOffset) {
	Date.prototype.getGMTOffset = function () {
		// NOTES: Returns timezone, GMT diff, in hhmm
		// EG: For CDT (UTC-05:00), returns '-0500'
		// ATTRIBUTION: Derived by georgehernandez.com from http://www.xaprb.com/blog/2005/12/12/javascript-closures-for-runtime-efficiency/
		return (this.getTimezoneOffset() > 0 ? "-" : "+") + Math.floor(this.getTimezoneOffset() / 60).pad(2) + (this.getTimezoneOffset() % 60).pad(2);
	};
}
if (!Date.prototype.getDayOfYear) {
	Date.prototype.getDayOfYear = function () {
		// ATTRIBUTION: Thanks to http://www.xaprb.com/blog/2005/12/12/javascript-closures-for-runtime-efficiency/
		var num = 0, i;
		Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28;
		for (i = 0; i < this.getMonth(); ++i) {
			num += Date.daysInMonth[i];
		}
		return num + this.getDate() - 1;
	};
}
if (!Date.prototype.getDSTOffset) {
	Date.prototype.getDSTOffset = function () {
		// NOTES: Returns difference with standard time in seconds for the date instance.
		// EG: For CDT (UTC-05:00), returns 60. For CST (UTC-06:00), returns 0.
		// ATTRIBUTION: Derived by georgehernandez.com from http://www.breakingpar.com/bkp/home.nsf/0/87256B280015193F87256CFB006C45F7

		var dGiven, sGivenU, dGivenU, dJan, sJanU, dJanU, diffStandardTimeMin, diffGivenTimeMin;
		dGiven = this;
		sGivenU = dGiven.toUTCString();
		dGivenU = new Date(sGivenU.substring(0, sGivenU.lastIndexOf(" ") - 1));

		dJan = new Date(dGiven.getFullYear(), 0, 1, 0, 0, 0, 0);
		sJanU = dJan.toUTCString();
		dJanU = new Date(sJanU.substring(0, sJanU.lastIndexOf(" ") - 1));

		diffStandardTimeMin = (dJan - dJanU) / (1000 * 60);
		diffGivenTimeMin = (dGiven - dGivenU) / (1000 * 60);
		
		return Math.abs(diffStandardTimeMin - diffGivenTimeMin);
	};
}
if (!Date.prototype.getDSTOffsetLocale) {
	Date.prototype.getDSTOffsetLocale = function () {
		// NOTES: Returns difference with standard time in seconds for the locale. Will return DST diff even if date object is not in summer.
		// EG: For CDT (UTC-05:00), returns 60. For CST (UTC-06:00), returns 60.
		// ATTRIBUTION: Derived by georgehernandez.com from http://www.breakingpar.com/bkp/home.nsf/0/87256B280015193F87256CFB006C45F7
		
		var dNow = new Date(), dJul, sJulU, dJulU, dJan, sJanU, dJanU, diffStandardTimeMin, diffDaylightTimeMin;
		dJul = new Date(dNow.getFullYear(), 6, 1, 0, 0, 0, 0);
		sJulU = dJul.toUTCString();
		dJulU = new Date(sJulU.substring(0, sJulU.lastIndexOf(" ") - 1));

		dJan = new Date(dNow.getFullYear(), 0, 1, 0, 0, 0, 0);
		sJanU = dJan.toUTCString();
		dJanU = new Date(sJanU.substring(0, sJanU.lastIndexOf(" ") - 1));

		diffStandardTimeMin = (dJan - dJanU) / (1000 * 60);
		diffDaylightTimeMin = (dJul - dJulU) / (1000 * 60);
		
		return Math.abs(diffStandardTimeMin - diffDaylightTimeMin);
	};
}
if (!Date.prototype.getWeek) {
	Date.prototype.getWeek = function (flag) {
		var jan1 = new Date(this.getFullYear(), 0, 1), d_dow, jan1_dow, d1w1, daysDiff, wk, dPrev, dPrev_dow, jan1Prev, jan1Prev_dow, d1w1Prev, daysDiffPrev;
		switch (flag) {
		case 'mon_iso':
			d_dow = this.getDay() || 7;
			jan1_dow = jan1.getDay() || 7;
			d1w1 = new Date(jan1.getTime() + (jan1_dow > 4 ? 8 - jan1_dow : -(jan1_dow - 1)) * 1000 * 60 * 60 * 24);
			break;
		case 'mon_jan':
			d_dow = this.getDay() || 7;
			jan1_dow = jan1.getDay() || 7;
			d1w1 = new Date(jan1.getTime() - (jan1_dow - 1) * 1000 * 60 * 60 * 24);
			break;
		case 'mon_mon':
			d_dow = this.getDay() || 7;
			jan1_dow = jan1.getDay() || 7;
			d1w1 = new Date(jan1.getTime() + (jan1_dow === 1 ? 0 : 8 - jan1_dow) * 1000 * 60 * 60 * 24);
			break;
		case 'sun_sun':
			d_dow = this.getDay();
			jan1_dow = jan1.getDay();
			d1w1 = new Date(jan1.getTime() + (jan1_dow === 0 ? 0 : 7 - jan1_dow) * 1000 * 60 * 60 * 24);
			break;
		default:
			// including case 'sun_jan':
			d_dow = this.getDay();
			jan1_dow = jan1.getDay();
			d1w1 = new Date(jan1.getTime() - (jan1_dow) * 1000 * 60 * 60 * 24);
		}
		daysDiff = Math.floor((this.getTime() - d1w1.getTime()) / 1000 / 60 / 60 / 24);
		wk = Math.floor((daysDiff / 7) + 1);
		if (flag === 'mon_iso' && wk === 0) {
			dPrev = new Date(this.getFullYear() - 1, 11, 31);
			dPrev_dow = dPrev.getDay() || 7;
			jan1Prev = new Date(dPrev.getFullYear(), 0, 1);
			jan1Prev_dow = jan1Prev.getDay() || 7;
			d1w1Prev = new Date(jan1Prev.getTime() + (jan1Prev_dow > 4 ? 8 - jan1Prev_dow : -(jan1Prev_dow - 1)) * 1000 * 60 * 60 * 24);
			daysDiffPrev = Math.floor((dPrev.getTime() - d1w1Prev.getTime()) / 1000 / 60 / 60 / 24);
			wk =  Math.floor((daysDiffPrev / 7) + 1);
			// document.write('<br>&nbsp;'+flag+':: '+' dPrev:'+dPrev.toDateString()+' dPrev_dow:'+dPrev_dow+' jan1Prev:'+jan1Prev.toDateString()+' jan1Prev_dow:'+jan1Prev_dow+' d1w1Prev:'+d1w1Prev.toDateString()+' daysDiffPrev:'+daysDiffPrev+' wk:'+wk); // DEV ONLY
		}
		// document.write('<br>&nbsp;'+flag+':: '+' d:'+this.toDateString()+' d_dow:'+d_dow+' jan1:'+jan1.toDateString()+' jan1_dow:'+jan1_dow+' d1w1:'+d1w1.toDateString()+' daysDiff:'+daysDiff+' wk:'+wk); // DEV ONLY
		return wk.pad(2);
	};
}
if (!Date.prototype.getFirstDayOfMonth) {
	Date.prototype.getFirstDayOfMonth = function () {
		// ATTRIBUTION: Thanks to http://www.xaprb.com/blog/2005/12/12/javascript-closures-for-runtime-efficiency/
		var day = (this.getDay() - (this.getDate() - 1)) % 7;
		return (day < 0) ? (day + 7) : day;
	};
}
if (!Date.prototype.getLastDayOfMonth) {
	Date.prototype.getLastDayOfMonth = function () {
		// ATTRIBUTION: Thanks to http://www.xaprb.com/blog/2005/12/12/javascript-closures-for-runtime-efficiency/
		var day = (this.getDay() + (Date.daysInMonth[this.getMonth()] - this.getDate())) % 7;
		return (day < 0) ? (day + 7) : day;
	};
}
if (!Date.prototype.getDaysInMonth) {
	Date.prototype.getDaysInMonth = function () {
		// ATTRIBUTION: Thanks to http://www.xaprb.com/blog/2005/12/12/javascript-closures-for-runtime-efficiency/
		Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28;
		return Date.daysInMonth[this.getMonth()];
	};
}
if (!Date.prototype.isLeapYear) {
	Date.prototype.isLeapYear = function () {
		var year = this.getFullYear();
		// return ((year & 3) == 0 && (year % 100 || (year % 400 == 0 && year))); // non-standard from xaprb
		return ((year % 400 === 0) || ((year % 4 === 0) && (year % 100 !== 0)));
	};
}


// Number XXXXXXXXXX
if (!Number.prototype.constrain) {
	Number.prototype.constrain = function (Min, Max) {
		// NOTES: Returns the number if between Min and Max, otherwise returns Min or Max as appropriate.
		// EG: Number(3).constrain(4,6)+"."+Number(5).constrain(4,6)+"."+Number(7).constrain(4,6) // returns "4.5.6"
		// ATTRIBUTION: By georgehernandez.com for the public domain.
		return Math.min(Math.max(this, Min), Max);
	};
}
if (!Number.prototype.formatDecimal) {
	Number.prototype.formatDecimal = function (places, nixCommas) {
		// NOTES: Assumes the number is a simple decimal number (base 10 and not scientific notation), and return a string formatted with commas and truncated by the number of places as specified. Defaults to showing all decimal places and with commas. http://www.xaprb.com/blog/2006/01/05/javascript-number-formatting/ has more than I want.
		// EG: (123456.78).formatDecimal()+" "+(123456.78).formatDecimal(4)+" "+(123456.78).formatDecimal(1)+" "+(123456.78).formatDecimal(0,true) // returns 123,456.78 123,456.7800 123,456.7 123456
		// ATTRIBUTION: Derived by georgehernandez.com from http://www.hunlock.com/blogs/Ten_Javascript_Tools_Everyone_Should_Have
		var num = this.toString(), splitStr = num.split('.'), splitLeft = splitStr[0], splitRight = '', regx;
		if (!nixCommas) {
			regx = /(\d+)(\d{3})/;
			while (regx.test(splitLeft)) {
				splitLeft = splitLeft.replace(regx, '$1' + ',' + '$2');
			}
		}
		if (places === 0) {
			splitRight = '';
		} else if (places > 0 && places !== true) {
			if (splitStr.length > 1) {
				splitStr[1] = splitStr[1].substr(0, places).padr(places, '0');
			} else {
				splitStr[1] = ''.padr(places, '0');
			}
			splitRight = '.' + splitStr[1];
		} else {
			splitRight = (splitStr.length > 1) ? '.' + splitStr[1] : '';
		}
		return splitLeft + splitRight;
	};
}
if (!Number.prototype.getSuffix) {
	Number.prototype.getSuffix = function () {
		// Returns the English ordinal suffix if this is a positive or negative integer
		// EG: Number(3).getSuffix(); // return 'rd'
		// ATTRIBUTION: By georgehernandez.com for the public domain.
		if (isNaN(this)) {
			return '';
		}
		if (String(this).search(/^-?\d+$/) === -1) {
			return '';
		}
		var suf = 'th';
		if (this !== 11 && this !== 12 && this !== 13) {
			switch (this % 10) {
			case 1:
				suf = 'st';
				break;
			case 2:
				suf = 'nd';
				break;
			case 3:
				suf = 'rd';
				break;
			}
		}
		return suf;
	};
}
if (!Number.prototype.isInt) {
	Number.prototype.isInt = function () {
		// Returns true if this is a positive or negative integer
		// EG: Number(3).isInt(); // returns true
		// ATTRIBUTION: By georgehernandez.com for the public domain.
		if (isNaN(this)) {
			return false;
		}
		if (String(this).search(/^-?\d+$/) === -1) {
			return false;
		}
		else {
			return true;
		}
	};
}
if (!Number.prototype.pad) {
	Number.prototype.pad = function (n, PadChar) {
		// NOTES: Returns a new string with the number padded n times by 0 or the given character
		// EG: String("78").pad(4, "0") // returns '0078'
		// ATTRIBUTION: By georgehernandez.com for the public domain.
		var strNew = this.toString();
		if (!PadChar) {
			PadChar = "0";
		}
		while (strNew.length < n) {
			strNew = PadChar + strNew;
		}
		return strNew;
	};
}

// String XXXXXXXXXX
if (!String.prototype.encML) {
	String.prototype.encML = function () {
		// NOTES: Replaces &, <, and > (special characters in markup languages like XML and HTML), with Character Entity References (CERs). Note that the amp must be replaced first.
		// EG: String("<&>").encML() // returns '&lt;&amp;&gt;'
		// ATTRIBUTION: By georgehernandez.com for the public domain.
		return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	};
}
if (!String.prototype.endsWith) {
	String.prototype.endsWith = function (str) {
		// NOTES: Return true if the source string ends with the parameter.
		// EG: "foo".endsWith('ar'); // returns false
		// ATTRIBUTION: Thanks to http://www.svendtofte.com/code/usefull_prototypes/
		return (this.length - str.length) === this.lastIndexOf(str);
	};
}
if (!String.prototype.escAll) {
	String.prototype.escAll = function () {
		// NOTES: Takes a string, makes it all like backslash-escaped source code enclosed with "s and then encloses it with "s.
		// EG: 'don\'t "\tbite'.escAll(); // returns "don't \"\tbite"
		// ATTRIBUTION: Derived by georgehernandez.com from http://javascript.crockford.com/remedial.html
		var c, i, l = this.length, o = '"';
		for (i = 0; i < l; i += 1) {
			c = this.charAt(i);
			if (c >= ' ') {
				if (c === '\\' || c === '"') {
					o += '\\';
				}
				o += c;
			} else {
				switch (c) {
				case '\b':
					o += '\\b';
					break;
				case '\f':
					o += '\\f';
					break;
				case '\n':
					o += '\\n';
					break;
				case '\r':
					o += '\\r';
					break;
				case '\t':
					o += '\\t';
					break;
				default:
					c = c.charCodeAt();
					o += '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
				}
			}
		}
		return o + '"';
	};
}
if (!String.prototype.format) {
	String.prototype.format = function (o) {
		// NOTES: Given a object with objectName:stringValue pairs, replace all instances of each objectName that occurs in this string as enclosed in curly brackets.
		// EG: String("The {Adj} {Noun}").format({Adj:'red', Noun:'cup'}) // returns The red cup.
		// ATTRIBUTION: Thanks to http://javascript.crockford.com/remedial.html
		return this.replace(/\{([^\{\}]*)\}/g,
			function (a, b) {
				var r = o[b];
				return typeof r === 'string' || typeof r === 'number' ? r : a;
			}
		);
	};
}
if (!String.prototype.pad) {
	String.prototype.pad = function (n, PadChar) {
		// EG: String("78").pad(4, "0") // returns '0078'
		// ATTRIBUTION: By georgehernandez.com for the public domain.
		var strNew = this.toString();
		if (!PadChar) {
			PadChar = " ";
		}
		while (strNew.length < n) {
			strNew = PadChar + strNew;
		}
		return strNew;
	};
}
if (!String.prototype.padr) {
	String.prototype.padr = function (n, PadChar) {
		// EG: String("78").padr(4, "0") // returns '7800'
		// ATTRIBUTION: By georgehernandez.com for the public domain.
		var strNew = this.toString();
		if (!PadChar) {
			PadChar = " ";
		}
		while (strNew.length < n) {
			strNew = strNew + PadChar;
		}
		return strNew;
	};
}
if (!String.prototype.repeat) {
	String.prototype.repeat = function (n) {
		// EG: String("x").repeat(3) // returns 'xxx'
		// ATTRIBUTION: By georgehernandez.com for the public domain.
		// return new Array(n+1).join(this.toString());
		var result = '', i;
		for (i = 0; i < n; i++) {
			result += this.toString();
		}
		return result;
	};
}
if (!String.prototype.reverse) {
	String.prototype.reverse = function () {
		// EG: String("foo").reverse() // returns 'oof'
		// ATTRIBUTION: By georgehernandez.com for the public domain.
		return this.split("").reverse().join("");
	};
}
if (!String.prototype.strip_tags) {
	String.prototype.striptags = function () {
		// NOTES: Removes all tags from a string including comments and script tags
		// VARIANTS: stripTags of http://www.prototypejs.org/api/string/stripTags does not remove script tag because they use a seperate function (stripScripts) to remove script tags
		// VARIANTS: This is just like strip_tags() of http://us3.php.net/strip-tags
		// EG: String("<b><i>foo</i><br /><br> bar</b><!-- comment -->").striptags() // For all tags including comments // returns 'foo bar'
		// ATTRIBUTION: By georgehernandez.com for the public domain.
		return this.replace(/<\/?[^>]+>/gi, '');
	};
}
if (!String.prototype.stripCommentsC) {
	String.prototype.stripCommentsC = function () {
		// EG: String("/* comment */ foo bar //comment").stripCommentsC() // returns 'foo bar'
		// ATTRIBUTION: Thanks to http://ostermiller.org/findcomment.html
		var strMod = this.toString();
		strMod = strMod.replace(/\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\//g, '');
		strMod = strMod.replace(/\/\/.*/g, '');
		return strMod;
	};
}
if (!String.prototype.stripCommentsSGML) {
	String.prototype.stripCommentsSGML = function () {
		// EG: String("<p><b><i>foo</i> bar</b></p><!-- comment -->").stripCommentsSGML() // returns '<p><b><i>foo</i> bar</b></p>'
		// ATTRIBUTION: Thanks to http://www.faqts.com/knowledge_base/view.phtml/aid/21761
		return this.replace(/<!(?:-\-[\s\S]*?-\-\s*)?>\s*/g, ''); // double dashes escaped cuz of SGML comment
	};
}
if (!String.prototype.stripTags) {
	String.prototype.stripTags = function (blnExcept, csvTags) {
		// NOTES: This does not affect comments. For that apply stripCommentsSGML().
		// VARIANTS: strip_tags(str) of http://us3.php.net/strip-tags removes tags, comments, and script tags, and takes no parameters besides the string.
		// EG: String("<p><b><i>foo</i><br> bar</b></p><!-- comment -->").stripTags() // just like striptags except does not remove comments // returns 'foo bar<!-- comment -->'
		// EG: String("<p><b><i>foo</i><br> bar</b></p><!-- comment -->").stripTags(true, 'p,i') // strip all tags except for specified tags  // returns '<p><i>foo</i> bar</p><!-- comment -->'
		// EG: String("<p><b><i>foo</i><br> bar</b></p><!-- comment -->").stripTags(false, 'p,i') // strip only the specified tags // returns '<b>foo<br> bar</b><!-- comment -->'
		// ATTRIBUTION: By georgehernandez.com for the public domain.
		var Tags, Specified, i, strRegExp;
		if (arguments.length < 2) {
			return this.replace(/<\/?(?!\!)[^>]*>/gi, '');
		} else {
			Tags = String(csvTags).split(',');
			Specified = [];
			for (i = 0; i < Tags.length; i++) {
				Specified[i] = Tags[i] + '\\b';
			}
			if (blnExcept) {
				strRegExp = '</?(?!(' + Specified.join('|') + '))[^>]*>';
				return this.replace(new RegExp(strRegExp, 'gi'), '');
			} else {
				strRegExp = '</?(' + Specified.join('|') + ')[^>]*>';
				return this.replace(new RegExp(strRegExp, 'gi'), '');
			}
		}
	};
}
if (!String.prototype.toggle) {
	String.prototype.toggle = function (B, A) {
		// NOTES: If the string is A, then return B. If the string is B, then return A. Changes the value of the string instead of returning a new string.
		// EG: "foo".toggle("foo","bar") // returns 'bar'
		// ATTRIBUTION: By georgehernandez.com for the public domain.
		return (this === B) ? A : B;
	};
}
if (!String.prototype.toIntArray) {
	String.prototype.toIntArray = function () {
		// NOTES: Can use in conjunction with Array.intArrayToString()
		// EG: String("bar").toIntArray() // returns [98,97,114]
		// ATTRIBUTION: Thanks to http://www.svendtofte.com/code/usefull_prototypes/
		var a = [], i;
		for (i = 0; i < this.length; i++) {
			a[i] = this.charCodeAt(i);
		}
		return a;
	};
}
if (!String.prototype.toTitleCase) {
	String.prototype.toTitleCase = function() {
		// EG: "the 4 the don't the".toTitleCase(); // returns "The 4 The Don't The"'
		// ATTRIBUTION: By georgehernandez for the public domain.
		return this.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	};
}
if (!String.prototype.trim) {
	String.prototype.trim = function () {
		// EG: '_' + String("  foo  ").trim() + '_' // returns '_foo_'
		// ATTRIBUTION: By georgehernandez.com for the public domain.
		return this.replace(/^\s+|\s+$/g, "");
	};
}
if (!String.prototype.triml) {
	String.prototype.triml = function () {
		// EG: '_' + String("  foo  ").triml() + '_' // returns '_foo  _'
		// ATTRIBUTION: By georgehernandez.com for the public domain.
		return this.replace(/^\s+/g, "");
	};
}
if (!String.prototype.trimr) {
	String.prototype.trimr = function () {
		// EG: '_' + String("  foo  ").trimr() + '_' // returns '_  foo_'
		// ATTRIBUTION: By georgehernandez.com for the public domain.
		return this.replace(/\s+$/g, "");
	};
}
if (!String.prototype.unformatNumber) {
	String.prototype.unformatNumber = function () {
		// NOTES: Not meant for non-decimal or exponential
		// EG: String("-$1,234 567.89").unformatNumber() // returns '-1234567.89'
		// ATTRIBUTION: By georgehernandez.com for the public domain.
		return this.replace(/([^0-9\.\-])/g, '') * 1;
	};
}


// ghj XXXXXXXXXX
var ghj = {};
ghj.cleanString = function(str) {
	// NOTES: For common string cleaning. There are many variants on this sort of thing. The str parameter may not be a string object.
    // EG: ghj.cleanString('null'); // returns ''
    // ATTRIBUTION: Thanks to Greg P.
    if (!str || str === 'null' || str === 'NULL') {
		return '';
	}
	return String(str).replace('\n', '').replace('\t', ' ').trim();
};
ghj.clone = function (o) {
	// NOTES: For cloning simple (multi-nested) object or arrays. Leave the original untouched.
	// EG: var x = {a: 1, b: 2, c: {d: 3, e: 4}}; var y = ghj.clone(x);
	// EG: var x = [1, 2, [3, 4]]; var y = ghj.clone(x);
	// ATTRIBUTION: Thanks to http://www.sencha.com/forum/showthread.php?26644-Ext.ux.clone()-Object-or-Array-cloning-function
    if(!o || 'object' !== typeof o) {
        return o;
    }
    if('function' === typeof o.clone) {
        return o.clone();
    }
    var c = '[object Array]' === Object.prototype.toString.call(o) ? [] : {};
    var p, v;
    for(p in o) {
        if(o.hasOwnProperty(p)) {
            v = o[p];
            if(v && 'object' === typeof v) {
                c[p] = ghj.clone(v);
            }
            else {
                c[p] = v;
            }
        }
    }
    return c;
};
ghj.dateFormat = function (dtm, format) {
	// NOTES: There are many, many ways to do this but this is simple.
	var str;
	switch (format) {
		case 'hh:mm':
			str = dtm.getHours().pad(2) + ':' + dtm.getMinutes().pad(2);
			break;
		case 'hh:mm:ss':
			str = dtm.getHours().pad(2) + ':' + dtm.getMinutes().pad(2) + ':' + dtm.getSeconds().pad(2);
			break;
		case 'MM/DD/YYYY':
			str = (dtm.getMonth() + 1).pad(2) + '/' + dtm.getDate().pad(2) + '/' + dtm.getFullYear();
			break;
		case 'MM/DD hh:mm':
			str = (dtm.getMonth() + 1).pad(2) + '/' + dtm.getDate().pad(2) + ' ' + dtm.getHours().pad(2) + ':' + dtm.getMinutes().pad(2);
			break;
		case 'YYYY-MM-DD':
			str = dtm.getFullYear() + '-' + (dtm.getMonth() + 1).pad(2) + '-' + dtm.getDate().pad(2);
			break;
	}
	return str;
};
ghj.dateNow = new Date();
ghj.equals = function (a, b) {
	// NOTES: Analyzes two or more objects and, returns true if they are equal (contain the same properties with the same values)
	// EG: ghj.equals({a:1, b:true, c:[[1],2,'c']}, {a:1, b:true, c:[[1],2,'c']}) // returns true
	// ATTRIBUTION: Thanks to http://jsfromhell.com/geral/equals
	var j, o, i, c;
	for (o = arguments, i = o.length, c = a instanceof Object; --i;) {
		if (a === (b = o[i])) {
			continue;
		} else if (!c || !(b instanceof Object)) {
			return false;
		} else {
			for (j in b) {
				if (b.hasOwnProperty(j)) {
                    if (!ghj.equals(a[j], b[j])) {
                        return false;
                    }
                }
			}
		}
	}
	return true;
};
ghj.typeOf = function (obj) {
	// VARIANTS: This is a variation of the native JS typeof operator that returns values for the 5 primitive values as well as 8 of the 9 standard objects (Math NA).
	// EG: ghj.typeOf(Array(1,2,3)) // returns 'array'
	// EG: ghj.typeOf(true) // returns 'boolean'
	// EG: ghj.typeOf(new Date()) // returns 'date'
	// EG: ghj.typeOf(function (n) {return n+n}) // returns 'function'
	// EG: ghj.typeOf(null) // returns 'null'
	// EG: ghj.typeOf(3) // returns 'number'
	// EG: ghj.typeOf(new Object()) // returns 'object'
	// EG: ghj.typeOf(/1/gi) // returns 'regexp'
	// EG: ghj.typeOf(String("foo")) // returns 'string'
	// EG: ghj.typeOf("") // returns 'string'
	// EG: ghj.typeOf(undefined) // returns 'undefined'
	// ATTRIBUTION: Derived by georgehernandez.com from http://javascript.crockford.com/remedial.html
	var s = typeof(obj);
	if (s === 'object') {
		if (obj) {
			if (obj.constructor === Array) {
				s = 'array';
			} else if (obj.constructor === Date) {
				s = 'date';
			} else if (obj.constructor === RegExp) {
				s = 'regexp';
			}
		} else {
			s = 'null';
		}
	}
	return s;
};
ghj.wait = function (msecs) {
	// NOTES: Keeps JavaScript busy for the time provided.
	// VARIANTS: A similar way via the DOM: window.setTimeout("alert('foobar')",2000);
	// ATTRIBUTION: Thanks to http://snippets.dzone.com/posts/show/5828
	var start = new Date().getTime(), cur = start;
	while ((cur - start) < msecs) {
		cur = new Date().getTime();
	}
};

// gho XXXXXXXXXX
var gho = {};
gho.$ = function () {
	// NOTES: Get element reference. Returns element or array of elements. So named because that's what the JS library called prototype named it
	// VARIANTS: Same as $ in prototype JS library
	// EG: gho.$("elementid").id // returns reference to the element with an id of elementid
	// ATTRIBUTION: Thanks to http://www.dustindiaz.com/top-ten-javascript/
	var elements = [], i, element;
	for (i = 0; i < arguments.length; i++) {
		element = arguments[i];
		if (typeof element === 'string') {
			element = document.getElementById(element);
		}
		if (arguments.length === 1) {
			return element;
		}
		elements.push(element);
	}
	return elements;
};
gho.cookieAllowed = function () {
	// NOTES: Returns true if the user's browser is set to allow cookies
	// DEPENDENCIES: This function is dependent upon gho.cookieSet(), gho.cookieGet(), and gho.cookieDelete
	// EG: gho.cookieAllowed()
	// ATTRIBUTION: Derived by georgehernandez.com from http://www.hunlock.com/blogs/Ten_Javascript_Tools_Everyone_Should_Have
	gho.cookieSet('checkCookie', 'test', 1);
	if (gho.cookieGet('checkCookie')) {
		gho.cookieDelete('checkCookie');
		return true;
	}
	return false;
};
gho.cookieDelete = function (name, path, domain) {
	// NOTES: Deletes a cookie from the user
	// DEPENDENCIES: This function is dependent upon gho.cookieGet
	// EG: gho.cookieDelete('checkCookie')
	// ATTRIBUTION: Derived by georgehernandez.com from http://www.hunlock.com/blogs/Ten_Javascript_Tools_Everyone_Should_Have
	if (gho.cookieGet(name)) {
		document.cookie = name + '=' + ((path) ? ';path=' + path : '') + ((domain) ? ';domain=' + domain : '') + ';expires=Thu, 01-Jan-1970 00:00:01 GMT';
	}
};
gho.cookieGet = function (name) {
	// NOTES: Gets a cookie from the user
	// EG: gho.cookieGet('checkCookie')
	// ATTRIBUTION: Derived by georgehernandez.com from http://www.hunlock.com/blogs/Ten_Javascript_Tools_Everyone_Should_Have
	var start = document.cookie.indexOf(name + "="), len, end;
	len = start + name.length + 1;
	if ((!start) && (name !== document.cookie.substring(0, name.length))) {
		return null;
	}
	if (start === -1) {
		return null;
	}
	end = document.cookie.indexOf(';', len);
	if (end === -1) {
		end = document.cookie.length;
	}
	return decodeURIComponent(document.cookie.substring(len, end));
};
gho.cookieSet = function (name, value, expires, path, domain, secure) {
	// NOTES: Sets a cookie for the user
	// EG: gho.cookieSet('checkCookie', 'test', 1)
	// ATTRIBUTION: Derived by georgehernandez.com from http://www.hunlock.com/blogs/Ten_Javascript_Tools_Everyone_Should_Have
	var today = new Date(), DateExpires;
	today.setTime(today.getTime());
	if (expires) {
		expires = expires * 1000 * 60 * 60 * 24; // If provided then expires is number of days
	} else {
		expires = 0;
	}
	DateExpires = new Date(today.getTime() + expires);
	// alert(DateExpires.toUTCString()); // DEV ONLY
	document.cookie =
		name + '=' + encodeURIComponent(value) + ((expires) ? ';expires=' + DateExpires.toUTCString() : '') + ((path) ? ';path=' + path : '') + ((domain) ? ';domain=' + domain : '') + ((secure) ? ';secure=' + secure : '');
};
gho.getElementsByClass = function (searchClass, node, tag) {
	// NOTES: Returns array of elements whose have that class attribute. If node is supplied, then it is an element by id, else it defaults to document. If tag is supplied, the it is a tag name like input, else it defaults to any tag.
	// VARIANTS: Some prototype this to Object, but I'm uncomfortable with that
	// EG: gho.getElementsByClass('SomeClass')[0].id
	// ATTRIBUTION: Derived by georgehernandez.com from http://www.dustindiaz.com/top-ten-javascript/
	var classElements = [], els, elsLen, pattern, i, j;
	if (!node) {
		node = document;
	}
	if (!tag) {
		tag = '*';
	}
	els = node.getElementsByTagName(tag);
	elsLen = els.length;
	pattern = new RegExp("(^|\\\\s)" + searchClass + "(\\\\s|$)");
	for (i = 0, j = 0; i < elsLen; i++) {
		if (pattern.test(els[i].className)) {
			classElements[j] = els[i];
			j++;
		}
	}
	return classElements;
};
gho.insertAfter = function (parent, node, referenceNode) {
	// NOTES: Inserts a node as the next sibling of a referenceNode, where node and referenceNode are children of the same parent
	// ATTRIBUTION: Thanks to http://www.dustindiaz.com/top-ten-javascript/
	parent.insertBefore(node, referenceNode.nextSibling);
};
gho.toggle = function (IDName) {
	// NOTES: Given an element by id, toggle whether its CSS display is 'none' or ''.
	// EG: gho.toggle("Show")
	// ATTRIBUTION: Thanks to http://www.dustindiaz.com/top-ten-javascript/
	var el = document.getElementById(IDName);
	if (el.style.display !== 'none') {
		el.style.display = 'none';
	} else {
		el.style.display = '';
	}
};