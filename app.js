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
    disabledButton()
        // Чтобы дела не исчезали при обновлении. Сделать проверку, если в Local storage уже есть объекты, то нужно из отрисовывать.
    if (localStorage.getItem(key)) {
        todoArray = JSON.parse(localStorage.getItem(key))

        // Проходимся по массиву с объектами
        for (const obj of todoArray) {
            const todoItem = createTodoItem(input.value)

            todoItem.textContent = obj.name;
            todoItem.id = obj.id
            added(todoItem)
        }
    }

    button.addEventListener('click', (e) => {
        e.preventDefault()

        const todoItem = createTodoItem(input.value)
        added(todoItem)
        if (!input.value) {
            return
        }
        createLocalStorage(todoItem)
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
        const itemObj = {}

        itemObj.name = form.textContent
        itemObj.id = form.id

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

    todoItemForm.id = changePlaseholder()

    return todoItemForm
}

function added(todoItemForm) {
    if (todoItemForm.id === 'start' || todoItemForm.id === 'undefined') {
        startPlaceholder.append(todoItemForm)
    } else if (todoItemForm.id === 'progress') {
        progressPlaceholder.append(todoItemForm)
    } else if (todoItemForm.id === 'start') {
        donePlaceholder.append(todoItemForm)
    } else startPlaceholder.append(todoItemForm)

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
                changePlaseholder()
            }
        }

        function dragend(event) {
            event.target.classList.remove('hold', 'hide')
        }
    }
}

function changePlaseholder() {

    const items = document.querySelectorAll('.item')
    let itemId = 'start'
    for (const item of items) {
        if (item.parentNode.id === 'placeholder-start') {
            item.id = 'start'
            itemId = 'start'
        } else if (item.parentNode.id === 'placeholder-progress') {
            item.id = 'progress'
            itemId = 'progress'

        } else if (item.parentNode.id === 'placeholder-done') {
            item.id = 'done'
            itemId = 'done'
        }
    }
    return itemId
}