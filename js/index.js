document.addEventListener("DOMContentLoaded", function (){
    //selector to capture form 
    let form = document.getElementById('github-form')

    form.addEventListener('submit', function (e){
        e.preventDefault();
        //search input selector 
        let search = document.getElementById("search").value
        // clean the input 
        let searchClean = search.split(' ').join('')
        
        fetch("https://api.github.com/users/"+searchClean)
            .then((result) => result.json())
            .then((data) => {
    
                   document.getElementById("results").innerHTML =
                    `<div>` +
                    `<a target="_blank" href="https://www.github.com/${searchClean}"> <img src="${data.avatar_url}" /></a>`+
                    `</div>` +
                    `<div>
                     <a target="_blank" href="https://www.github.com/${searchClean}"> <p style="padding: 10px">${data.login}</p> </a>
                     </div>`

                    

            })
    
    })

})