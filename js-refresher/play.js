// const name = 'Max';
// let age = 29;
// const hasHobbies = true;

// age = 30;

// const summarizeUser = (userName, userAge, userHasHobbies) => {
// 	return (
// 		'Name is ' +
// 		userName +
// 		', age is ' +
// 		userAge +
// 		', and the user has hobbies ' +
// 		userHasHobbies
// 	);
// };

const add = (a, b) => a + b;

// function summarizeUser(userName, userAge, userHasHobbies) {
// 	return (
// 		'Name is ' +
// 		userName +
// 		', age is ' +
// 		userAge +
// 		', and the user has hobbies ' +
// 		userHasHobbies
// 	);
// }

// console.log(summarizeUser(name, age, hasHobbies));

console.log(add(56, 34));

//Objects

const person = {
	name: 'Max',
	age: 29,
	greet: function () {
		console.log('Hi, I am ' + this.name);
	},
};

console.log(person);
person.greet();

const copiedPerson = {...person}
console.log('Copied person: ', copiedPerson)

//Arrays

const hobbies = ['Sports', 'Cooking'];

for (let hobby of hobbies) console.log(hobby);

console.log(hobbies.map((hobby) => 'Hobby ' + hobby));
console.log(hobbies);

hobbies.push('Programming')
console.log(hobbies)

const copiedArray = [...hobbies];
console.log("Copied array: ", copiedArray);

const toArray = (...args) => {
	return args;
}

console.log('To array: ', toArray(1, 2, 3, 4));

//Object destructuring

const printName = ({ name }) => {
	console.log("Name: ", name);
}

printName(person)

const { name, age } = person;
console.log(name, age)

const [hobby1, hobby2] = hobbies;
console.log(hobby1, hobby2);

//Async and await

const fetchData = () => {
	const promise = new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve('Done')
		}, 1500)
	});

	return promise;
}

setTimeout(() => {
	console.log('Timer is done');
	fetchData().then(text => {
		console.log(text)
		return fetchData();
	})
	.then(text2 => {
		console.log(text2);
	});
}, 2000)

console.log('Hello');
console.log('Hi');
