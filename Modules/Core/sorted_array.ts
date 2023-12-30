


function defaultCompare<T>(lhs: T, rhs: T): number {
	
	if (lhs === rhs)
		return 0;
	else if (lhs < rhs)
		return -1;
	else
		return 1;
	
}

function binarySearch<T>(array: Array<T>, value: T, compare: (lhs: T, rhs: T) => number, insert = false, left = 0, right = array.length - 1): number {
	
	if (left > right)
		return insert ? left : -1;
	
	let mid = Math.floor((left + right)/2);
	let cmp = compare(value, array[mid]);
	
	if (left === right) {
		
		if (insert) {
			
			if (cmp <= 0)
				return mid; // Insert before
			else
				return mid + 1; // Insert after
			
		}
		else {
			
			if (cmp === 0)
				return mid;
			else
				return -1;
			
		}
		
	}
	
	
	
	
	if (cmp === 0)
		return mid;
	else if (cmp < 0)
		return binarySearch(array, value, compare, insert, left, mid - 1);
	else
		return binarySearch(array, value, compare, insert, mid + 1, right);
	
}
/*function binaryFindSearch<T>(array: Array<T>, value: T, compare: (lhs: T, rhs: T) => number = defaultCompare): number {
	return binarySearch(array, value, compare, false);
}*/
function binaryInsertSearch<T>(array: Array<T>, value: T, compare: (lhs: T, rhs: T) => number = defaultCompare): number {
	return binarySearch(array, value, compare, true);
}


export default class SortedArray extends Array {
	
	static insert<T>(array: Array<T>, value: T, compare: (lhs: T, rhs: T) => number = defaultCompare): number {
		
		let index = binaryInsertSearch(array, value, compare);
		array.splice(index, 0, value);
		return index;
		
	}
	static remove<T>(array: Array<T>, value: T, compare: (lhs: T, rhs: T) => number = defaultCompare): number {
		
		let index = binarySearch(array, value, compare);
		
		/*if (index >= array.length)
			return -1; // Value not in array, and greater than the rightmost value
		if (compare(value, array[index]) !== 0)
			return -1; // Value not in array, and would fall somewhere in the middle*/
		
		if (index >= 0)
			array.splice(index, 1);
		
		return index;
		
	}
	
};

/*let test: Array<number> = [];

for (let i = 0; i < 30; i++) {
	SortedArray.insert(test, Math.pow(i, 2) % 11);
}

console.log(test, " ", test.length);

for (let i = 0; i < 10; i++) {
	SortedArray.remove(test, test[0]);
	console.log(test, " ", test.length);
	SortedArray.remove(test, test[test.length - 1]);
	console.log(test, " ", test.length);
}*/


