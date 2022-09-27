// a function to calculate the convolution of two vectors
// or to multiply the two algebraic expressions.

/*
**

idea :
------
vec1 = [2,3,4]
vec2 = [1,2,3]

multiply vec2 by vec1[0] = 2    4   6
multiply vec2 by vec1[1] = -    3   6   9
multiply vec2 by vec1[2] = -    -   4   8   12
-----------------------------------------------
add the above three      = 2    7   14  17  12

the - above shows the displacement after each vector multiplication by element of another vector

**
*/
export function convolution(vec1: number[], vec2: number[]) {
	let disp = 0; // displacement given after each vector multiplication by element of another vector
	const convVec = [];
	// for first multiplication
	for (let n = 0; n < vec2.length; n++) {
		convVec.push(vec1[0] * vec2[n]);
	}

	disp = disp + 1;

	for (let i = 1; i < vec1.length; i++) {
		for (let j = 0; j < vec2.length; j++) {
			if (disp + j !== convVec.length) {
				convVec[disp + j] = convVec[disp + j] + vec1[i] * vec2[j];
			} else {
				convVec.push(vec1[i] * vec2[j]);
			}
		}
		disp = disp + 1;
	}

	// Trim to original size

	return convVec;

	// const span = Math.floor(vec1.length / 2);
	// return convVec.slice(Math.floor(convVec.length / 2) - span, Math.ceil(convVec.length / 2 + span));
}

/*
**

Usage:
------
vecA = [2,3,2,1]
vecB = [4,1,2,3]
ans = conv(vecA, vecB);

**
*/

export function convolve(vectors: number[][]): number[] {
	if (vectors.length === 0) return [];
	if (vectors.length === 1) return vectors[0];

	let convolved: number[] = vectors[1];

	for (let i = 1; i <= vectors.length - 1; i++) {
		convolved = convolution(convolved, vectors[i]);
	}

	return convolved;
}
