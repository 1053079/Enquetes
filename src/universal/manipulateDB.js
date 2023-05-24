import { useEffect, useState } from 'react'

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

/* GET request fetch function
We use useEffect to re-render the data immediately.
fetch uses GET / application/json as standard so we don't need to define that.
We get a response object  from the API that we convert to json and then we put that data in setPosts
(This is assuming you have a const [posts, setPosts] = useState([]) defined )
P.S I am not sure if this is even functional!*/
export async function GetDB(path) {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        fetch('/localhost:81/api/' + path)
            .then((res => res.json))
            .then((data) => {
                console.log(data)
                setPosts(data)
            })
            .catch((err) => {
                console.log(err.message);
            })
    }, []);
    return posts;
}


export { saveToDB }

