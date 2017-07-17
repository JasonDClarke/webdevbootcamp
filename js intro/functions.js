var numbers = [1, 2, 3];
var uniform = [1, 1, 1];

function printReverse(arr) {
	for(var i=arr.length-1; i>=0; i--)
		console.log(arr[i])
}

function isUniform(arr) {
	var current = arr[0];
	var changes = 0
	arr.forEach(function testsame(arrItem){
		if (arrItem != current) {
			changes= changes +1
		}
	})
	return changes
}

function max(arr) {
	var currentMax=arr[0]
	arr.forEach(function testmax(arrItem){
		if (arrItem >= currentMax) {
			currentMax = arrItem;	
		} 
	})
	return currentMax;
}

printReverse(numbers);
isUniform(numbers);
max(numbers);
