// The div where profile information will appear.
const overview = document.querySelector(".overview");
const username = "jesicachaya";
//The unordered list that displays the list of repos.
const repoList = document.querySelector(".repo-list");
//Section where all repo information appears
const allReposContainer = document.querySelector(".repos");
//Section where individual repo data will appear
const repoData = document.querySelector(".repo-data");

//An async function to retrieve user's GitHub profile information
const gitUserInfo = async function () {
    const userInfo = await fetch(`https://api.github.com/users/${username}`);
    const data = await userInfo.json();
    displayUserInfo(data);
};

gitUserInfo();

//A function that displays user's profile information and calls another function to get and display repos as well
const displayUserInfo = function(data) {
    const div = document.createElement("div");
    div.classList.add("user-info");
    div.innerHTML = `<figure>
    <img alt="user avatar" src=${data.avatar_url} />
  </figure>
  <div>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Bio:</strong> ${data.bio}</p>
    <p><strong>Location:</strong> ${data.location}</p>
    <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
  </div>`
    overview.append(div);
    gitRepos();
};

//An async function retrieving repository information
const gitRepos = async function() {
    const fetchRepos = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`)
    const repoData = await fetchRepos.json();
    displayRepos(repoData);
};

//A function that displays repository information
const displayRepos = function(repos) {
    for (const repo of repos) {
        const li = document.createElement("li");
        li.classList.add("repo");
        li.innerHTML = `<h3> ${repo.name} </h3>`;
        repoList.append(li);
    }
};

//An event that responses to clicking on repo name
repoList.addEventListener("click", function(e) {
    if (e.target.matches("h3")) {
        const repoName = e.target.innerText;
        getRepoInfo(repoName);
    }
});

//An async functon that retrieves specific repo information
const getRepoInfo = async function(repoName) {
    const fetchInfo = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await fetchInfo.json();
    console.log(repoInfo);

    // Grab languages
    const fetchLanguages = await fetch(repoInfo.languages_url);
    const languageData = await fetchLanguages.json();
    
    // Make a list of languages
    const languages = [];
    for (let language in languageData) {
        languages.push(language);
    }
    displayRepoInfo(repoInfo, languages);
}

//A function that displays specific repo's information
const displayRepoInfo = function(repoInfo, languages) {
    repoData.innerHTML = "";
    const div = document.createElement("div");
    div.innerHTML = `<h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>`;
    repoData.append(div);
    repoData.classList.remove("hide");
    allReposContainer.classList.add("hide");
}
