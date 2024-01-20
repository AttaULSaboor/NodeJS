const axios = require('axios');
const baseURL = 'http://localhost:3000/api/';

async function postMovie(movie) {
    console.log("Posting movie data:", movie); // Log request data before sending
    return axios.post(baseURL, movie);
}

async function putCollection(movies) {
    console.log("Putting collection data:", movies); // Log request data before sending
    return axios.put(baseURL, movies);
}

async function getCollection() {
    return axios.get(baseURL);
}

async function deleteCollection() {
    return axios.delete(baseURL);
}

async function getItem(id) {
    return axios.get(`${baseURL}${id}`);
}

async function putItem(id, movie) {
    console.log(`Putting movie data for ID ${id}:`, movie); // Log request data before sending
    return axios.put(`${baseURL}${id}`, movie);
}

async function deleteItem(id) {
    return axios.delete(`${baseURL}${id}`);
}

async function runTests() {
    try {
        // Test #1
        console.log("Test #1");
        console.log("Execute two POST requests to insert two items into the collection.");

        let postResponse1 = await postMovie({title: "Movie 1", release_year: "2000", time_viewed: "2017-09-29T12:34:56.200"});
        if(!postResponse1.data.rowid) {
            throw new Error("Failed to create Movie 1. No ID returned.");
        }

        let postResponse2 = await postMovie({title: "Movie 2", release_year: "2001", time_viewed: "2022-09-29T13:34:56.200"});
        if(!postResponse2.data.rowid) {
            throw new Error("Failed to create Movie 2. No ID returned.");
        }
        
        console.log("Execute a single item PUT request to modify a single item in the collection.");
        let updateResponse = await putItem(postResponse1.data.rowid, {title: "Updated Movie 1", release_year: "2000", time_viewed: "2022-09-29T12:34:56.200"});
        
        let getItemResponse1 = await getItem(postResponse1.data.rowid);
        let getItemResponse2 = await getItem(postResponse2.data.rowid);
        
        if (getItemResponse1.data.title !== "Updated Movie 1" || getItemResponse2.data.title !== "Movie 2") {
            console.log("getItemResponse1 data:", getItemResponse1.data);
            console.log("getItemResponse2 data:", getItemResponse2.data);
            throw new Error("Test #1 Failed: Data mismatch in GET requests after POST and PUT");
        }

        // Test #2
        console.log("Test #2");
        console.log("Execute a single collection PUT request that replaces the collection with 4 new items.");

        let movies = [
            {title: "Gladiator", release_year: "2000", time_viewed: "2017-10-03T11:45:56.200"},
            {title: "Avengers: Infinity War", release_year: "2019", time_viewed: "2019-12-03T15:20:20.200"},
            {title: "Wonder Woman", release_year: "2017", time_viewed: "2017-06-04T08:45:56.200"},
            {title: "Spider-Man", release_year: "2002", time_viewed: "2002-05-04T15:20:20.200"}
        ];
        
        let putResponse = await putCollection(movies);
        console.log("PUT Collection Response:", putResponse.data);
        if (putResponse.data.status !== "REPLACE COLLECTION SUCCESSFUL") {
            throw new Error("Test #2 Failed: PUT collection failed");
        }
        
        let getAllResponse = await getCollection();
        
        if (getAllResponse.data.length !== 4) {
            throw new Error("Test #2 Failed: PUT collection failed");
        }

        await deleteItem(getAllResponse.data[0].rowid);
        
        let getAfterDelete = await getCollection();
        
        if (getAfterDelete.data.length !== 3) {
            throw new Error("Test #2 Failed: DELETE item failed");
        }

        await deleteCollection();

        let getAfterDeleteAll = await getCollection();
        if (getAfterDeleteAll.data.length !== 0) {
            throw new Error("Test #2 Failed: DELETE collection failed");
        }

        console.log("ALL TESTS SUCCESSFUL");
    } catch (error) {
        if (error.response) {
            console.log("Data:", error.response.data);
            console.log("Status:", error.response.status);
            console.log("Headers:", error.response.headers);
        }
        console.error(error.message);
    }
}

runTests();
