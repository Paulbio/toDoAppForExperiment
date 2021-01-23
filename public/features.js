// Object template
let objectTemplate = (items) => {
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
        <span class="item-text">${items.text}</span>
        <div>
            <button data-id="${items._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
            <button data-id="${items._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
        </div>
      </li>`
}

// initial render db items
let mainHTML = objects.map((item)=>{
    return objectTemplate(item)
}).join('')
document.getElementById('item-list').insertAdjacentHTML('beforeend', mainHTML)

// create feature
let itemInput = document.getElementById('input-field')
document.getElementById('item-form').addEventListener("submit", (e)=>{
    e.preventDefault()
    if(itemInput.value){
        axios.post('/create-object', {text: itemInput.value}).then((response)=>{
            document.getElementById('item-list').insertAdjacentHTML("beforeend", objectTemplate(response.data))
            itemInput.value = ''
            itemInput.focus()
        }).catch(()=>{
            console.log('something went wrong --create')
        })
    }
})

document.addEventListener("click", (e)=>{
    // edit feature
    if(e.target.classList.contains("edit-me")){
        let input = prompt("Enter new text", e.target.parentElement.parentElement.querySelector('.item-text').innerHTML)
        if (input) {
            axios.post('/update-object', {text: input, id: e.target.getAttribute("data-id")}).then(()=>{
                e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = input
            }).catch(()=>{
                console.log('something went wrong --edit')
            })
        }
    }

    // delete feature
    if(e.target.classList.contains("delete-me")){
        if(confirm("Do you really want to delete this item permanently")){
            axios.post('/delete-object', {id: e.target.getAttribute("data-id")}).then(()=>{
                e.target.parentElement.parentElement.remove()
            }).catch(()=>{
                console.log('something went wrong --delete')
            })
        }
    }
})