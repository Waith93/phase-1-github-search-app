// index.js code
document.addEventListener('DOMContentLoaded', () => {
    let form = document.getElementById('dog-form');
    let resultsDiv = document.getElementById('results');
    let toggleBtn = document.getElementById('toggle-search');
    let searchType = 'breeds';

    if (!form || !resultsDiv || !toggleBtn) {
        console.error('Form, results container, or toggle button not found');
        return;
    }

    toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        searchType = searchType === 'breeds' ? 'images' : 'breeds';
        toggleBtn.textContent = searchType === 'breeds' ? 'Search Dog Images' : 'Search Dog Breeds';
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let search = document.getElementById('search').value.trim().toLowerCase();

        if (!search) return;
        resultsDiv.innerHTML = '<p>Loading...</p>';

        let apiUrl = searchType === 'breeds'
            ? `https://dog.ceo/api/breeds/list/all`
            : `https://dog.ceo/api/breed/${search}/images/random`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                resultsDiv.innerHTML = '';

                if (searchType === 'breeds') {
                    let breeds = Object.keys(data.message);
                    let filteredBreeds = breeds.filter(breed => breed.includes(search));

                    if (filteredBreeds.length === 0) {
                        resultsDiv.innerHTML = '<p>No breeds found.</p>';
                        return;
                    }

                    filteredBreeds.forEach(breed => {
                        let breedDiv = document.createElement('div');
                        breedDiv.innerHTML = `
                            <p>${breed.charAt(0).toUpperCase() + breed.slice(1)}</p>
                            <button class="view-images-btn" data-breed="${breed}">View Images</button>
                        `;
                        resultsDiv.appendChild(breedDiv);
                    });

                    document.querySelectorAll('.view-images-btn').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            fetchDogImages(e.target.dataset.breed);
                        });
                    });

                } else {
                    if (data.status === 'error') {
                        resultsDiv.innerHTML = '<p>Breed not found. Try another name.</p>';
                    } else {
                        resultsDiv.innerHTML = `<img src="${data.message}" width="300" alt="Dog Image">`;
                    }
                }
            })
            .catch(error => console.error('Error:', error));
    });

    function fetchDogImages(breed) {
        fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
            .then(response => response.json())
            .then(data => {
                resultsDiv.innerHTML += `<img src="${data.message}" width="300" alt="${breed} Image">`;
            })
            .catch(error => console.error('Error fetching images:', error));
    }
});