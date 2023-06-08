function saveToDB(array, path) {
	fetch('http://localhost:81/api/' + path, {
		method: 'POST',
		mode: 'cors',
		headers: {
			 'Content-Type': 'application/json'
			},
		body: JSON.stringify(array)
	})
}

function DeleteFromDB(path) {
    fetch('http//localhost:81/api' + path, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
    })
}

/* GET request fetch function
We use useEffect to re-render the data immediately.
fetch uses GET / application/json as standard so we don't need to define that.
We get a response object  from the API that we convert to json and then we put that data in setPosts
(This is assuming you have a const [posts, setPosts] = useState([]) defined )
P.S I am not sure if this is even functional!*/
async function GetDB(path) {
	const result = await fetch('http://localhost:81/api/' + path);
	const data = await result.json();
	console.log(data);
}

function UserLogin(user){
	fetch('http://localhost:81/handle_login', {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(user)
	});
	console.log(user);
}

export { saveToDB, GetDB, UserLogin, DeleteFromDB }

// useEffect(() => {
//     GetDB('test_question')
// }
// )
