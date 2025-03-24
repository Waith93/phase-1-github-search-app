// index.js code
document.addEventListener('DOMContentLoaded', () => {
    let form = document.getElementById('github-form');
    let resultsDiv = document.getElementById('results');
    let toggleBtn = document.getElementById('toggle-search'); // Use the existing button
    let searchType = 'users';

    if (!form || !resultsDiv || !toggleBtn) {
        console.error('Form, results container, or toggle button not found');
        return;
    }

    toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        searchType = searchType === 'users' ? 'repositories' : 'users';
        toggleBtn.textContent = searchType === 'users' ? 'Search Repos' : 'Search Users';
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let search = document.getElementById('search').value.trim(); 

        if (!search) return; 
        resultsDiv.innerHTML = '<p>Loading...</p>'; 

        let apiUrl = searchType === 'users'
            ? `https://api.github.com/search/users?q=${search}`
            : `https://api.github.com/search/repositories?q=${search}`;

        fetch(apiUrl, { 
            headers: { 'Accept': 'application/vnd.github.v3+json' }
        })
        .then(response => response.json())
        .then(data => {
            resultsDiv.innerHTML = ''; 
            
            if (data.items && data.items.length > 0) {
                if (searchType === 'users') {
                    data.items.forEach(user => {
                        let userDiv = document.createElement('div');
                        userDiv.innerHTML = `
                            <div>
                                <a href="${user.html_url}" target="_blank">
                                    <img src="${user.avatar_url}" width="50" />
                                    <p>${user.login}</p>
                                </a>
                                <button class="view-repos-btn" data-username="${user.login}">View Repos</button>
                            </div>`;
                        resultsDiv.appendChild(userDiv);
                    });

                    document.querySelectorAll('.view-repos-btn').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            fetchUserRepos(e.target.dataset.username);
                        });
                    });
                } else {
                    data.items.forEach(repo => {
                        let repoDiv = document.createElement('div');
                        repoDiv.innerHTML = `
                            <div>
                                <a href="${repo.html_url}" target="_blank">
                                    <p>${repo.full_name}</p>
                                </a>
                            </div>`;
                        resultsDiv.appendChild(repoDiv);
                    });
                }
            } else {
                resultsDiv.innerHTML = '<p>No results found.</p>';
            }
        })
        .catch(error => console.error('Error:', error));
    });

    function fetchUserRepos(username) {
        fetch(`https://api.github.com/users/${username}/repos`)
            .then(response => response.json())
            .then(repos => {
                if (repos.length === 0) {
                    resultsDiv.innerHTML += '<p>No repositories found.</p>';
                    return;
                }

                let repoList = document.createElement('div');
                repoList.innerHTML = `<h3>Repositories of ${username}:</h3>`;
                
                repos.forEach(repo => {
                    let repoItem = document.createElement('p');
                    repoItem.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
                    repoList.appendChild(repoItem);
                });

                resultsDiv.appendChild(repoList);
            })
            .catch(error => console.error('Error fetching repos:', error));
    }
});
