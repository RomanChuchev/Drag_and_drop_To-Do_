let todoArray = []
let key = 'To-Do-1'

const input = document.getElementById('input')
const button = document.getElementById('button')
const startPlaceholder = document.getElementById('placeholder-start')
const progressPlaceholder = document.getElementById('placeholder-progress')
const donePlaceholder = document.getElementById('placeholder-done')

function disabledButton() {
    button.disabled = !input.value.length
    input.addEventListener('input', () => {
        button.disabled = !input.value.length
    })
}

function createTodoApp() {
    dragAndDrop()

    disabledButton()
        // Чтобы дела не исчезали при обновлении. Сделать проверку, если в Local storage уже есть объекты, то нужно их отрисовывать.
    if (localStorage.getItem(key)) {
        todoArray = JSON.parse(localStorage.getItem(key))

        for (const obj of todoArray) {
            const todoItem = createTodoItem(input.value)

            todoItem.textContent = obj.name;
            todoItem.id = obj.id
            dragAndDrop()

            if (obj.placeholder === 'start') {
                addedStartPlaceholder(todoItem)
            } else if (obj.placeholder === 'progress') {
                addedProgressPlaceholder(todoItem)
            } else if (obj.placeholder === 'done') {
                addedDonePlaceholder(todoItem)
            }
        }
    }

    function addedStartPlaceholder(todoItemForm) {
        startPlaceholder.append(todoItemForm)
    }

    function addedProgressPlaceholder(todoItemForm) {
        progressPlaceholder.append(todoItemForm)
    }

    function addedDonePlaceholder(todoItemForm) {
        donePlaceholder.append(todoItemForm)
    }

    button.addEventListener('click', (e) => {
        e.preventDefault()

        const todoItem = createTodoItem(input.value)

        if (!input.value) {
            return
        }
        createLocalStorage(todoItem)
        addedStartPlaceholder(todoItem)
        dragAndDrop()

    })
    dragAndDrop()
}




function createLocalStorage(form) {
    let localStorageData = localStorage.getItem(key)
    if (localStorageData == null) {
        todoArray = []
    } else {
        todoArray = JSON.parse(localStorageData)
    }

    const createItemObj = arr => {
        const itemObj = {
            name: form.textContent,
            id: form.id,
            placeholder: 'start'
        }


        arr.push(itemObj)
    }
    createItemObj(todoArray)
    input.value = ''
    disabledButton()

    localStorage.setItem(key, JSON.stringify(todoArray))
}

function createTodoItem(value) {
    const todoItemForm = document.createElement('div')
    todoItemForm.classList.add('item')
    todoItemForm.draggable = "true"

    todoItemForm.textContent = value

    const ranfomId = Math.round(Math.random() * (999 - 100) + 100)
    todoItemForm.id = ranfomId

    return todoItemForm
}



function dragAndDrop() {
    const items = document.querySelectorAll('.item')
    const placeholders = document.querySelectorAll('.placeholder')

    for (const item of items) {
        item.addEventListener('dragstart', dragstart)
        item.addEventListener('dragend', dragend)

        function dragstart(event) {
            event.target.classList.add('hold')
            event.target.classList.add('active')
            setTimeout(() => event.target.classList.add('hide'), 0)

            for (const placeholder of placeholders) {
                placeholder.addEventListener('dragover', dragover)
                placeholder.addEventListener('dragenter', dragenter)
                placeholder.addEventListener('dragleave', dragleave)
                placeholder.addEventListener('drop', dragdrop)
            }

            function dragover(event) {
                event.preventDefault()
            }

            function dragenter(event) {
                event.target.classList.add('hovered')
            }

            function dragleave(event) {
                event.target.classList.remove('hovered')
            }

            function dragdrop(event) {

                activeItem = Array.from(document.getElementsByClassName('active'))
                if (activeItem[0] === item) {
                    if (event.target.classList.contains('item')) {
                        event.target.parentNode.append(item)
                        event.target.classList.remove('hovered')
                        activeItem[0].classList.remove('active')
                    } else {
                        event.target.append(item)
                        event.target.classList.remove('hovered')
                        activeItem[0].classList.remove('active')
                    }
                }
                changePlaseholder(item)
            }
        }

        function dragend(event) {
            event.target.classList.remove('hold', 'hide')
        }


    }
}


function changePlaseholder(item) {
    todoArray = JSON.parse(localStorage.getItem(key))
    let newArray = []
    let activeItem = item
    let itemPlaceholder

    if (activeItem.parentNode.id === 'placeholder-start') {
        itemPlaceholder = 'start'
    } else if (activeItem.parentNode.id === 'placeholder-progress') {
        itemPlaceholder = 'progress'
    } else if (activeItem.parentNode.id === 'placeholder-done') {
        itemPlaceholder = 'done'
    }

    for (const obj of todoArray) {
        if (obj.id === activeItem.id) {
            const itemObj = {
                name: obj.name,
                id: obj.id,
                placeholder: itemPlaceholder
            }
            newArray.push(itemObj)
        } else {
            const itemObj = {
                name: obj.name,
                id: obj.id,
                placeholder: obj.placeholder
            }
            newArray.push(itemObj)
        }

    }






    localStorage.setItem(key, JSON.stringify(newArray))
}