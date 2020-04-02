const API_KEY = "AIzaSyAZQsataVAXFkbz0ZAfd6RBnNCJUxCkmg0";
let search_term = "";
let next_token = "";
let prev_token = "";
let page_num = 0;

function fetchVideos(searchTerm, page){

	let url = "";

	if(page === "next") {
		url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&type=video&part=snippet&maxResults=10&q=${searchTerm}&pageToken=${next_token}`;
	} else if (page === "prev") {
		url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&type=video&part=snippet&maxResults=10&q=${searchTerm}&pageToken=${prev_token}`;
	} else {
		url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&type=video&part=snippet&maxResults=10&q=${searchTerm}`;
	}

	let settings = {
		method : 'GET'
	};

	fetch(url, settings)
		.then(response => {
			if(response.ok){
				return response.json();
			}

		throw new Error(response.statusText);

	})
	.then(responseJSON => {
		if(page !== "prev"){
			page_num += 1;
		} else if (page_num > 1){
			page_num -= 1;
		}
		displayResults(responseJSON);
	})
	.catch(err => {
		console.log(err);
	})
}

function displayResults(data){
	let results = document.querySelector('.results');
	let getMore = document.querySelector('.get-more');

	results.innerHTML = "";
	getMore.innerHTML = "";

	for(let i = 0; i < data.items.length; i++){
		results.innerHTML += `
			<div>
                <a href = "https://www.youtube.com/watch?v=${data.items[i].id.videoId}" target="_blank">
                    ${data.items[i].snippet.title}
                </a>
                <div>
                	<a href = "https://www.youtube.com/watch?v=${data.items[i].id.videoId}" target="_blank">
                    	<img src="${data.items[i].snippet.thumbnails.default.url}" />
                    </a>
                </div>
            </div>
        `;
	}
	getMore.innerHTML += `
		<div>
			<a id = "prev">Previous</a>
			<a id = "next">Next</a>
		</div>
	`;

	next_token = data.nextPageToken;

	if(page_num !== 1) {
		prev_token = data.prevPageToken;
	}

	let nextbtn = document.getElementById('next');
	let prevbtn = document.getElementById('prev');

	nextbtn.addEventListener('click', (event) => {
		event.preventDefault();

		fetchVideos( search_term, "next" );
	});

	prevbtn.addEventListener('click', (event) => {
		event.preventDefault();

		fetchVideos( search_term, "prev" );
	});
}

function search(){
	let submitButton = document.getElementById( 'search-btn' );

    submitButton.addEventListener( 'click', ( event ) => {
        event.preventDefault();

        search_term = document.getElementById( 'search-bar' ).value;

        fetchVideos( search_term, "" );
    });
}

function init(){
	search();
}

init();