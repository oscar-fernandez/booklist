const bookTitle = document.querySelector('#title');
const bookAuthor = document.querySelector('#author');
const bookISBN = document.querySelector('#isbn');

class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    addBookToList(book) {
            const list = document.querySelector('.table__list');
            const row = document.createElement('tr');
            row.classList.add("table__row");
            row.innerHTML= `
            <td class="table__row--cell">${book.title}</td>
            <td class="table__row--cell">${book.author}</td>
            <td class="table__row--cell">${book.isbn}</td>
            <td class="table__row--cell"><a href="#" class="delete">X</a></td>
            `
            list.appendChild(row);
    }

    showAlert(message, className) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert ${className}`;
        alertDiv.appendChild(document.createTextNode(message));
        const form = document.querySelector('.form');
        const formStart = document.querySelector('.form__start');
        form.insertBefore(alertDiv, formStart);
        // Timeout after 3 seconds
        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 3000);
    }

    deleteBook(target) {
        if (target.className === 'delete'){
            target.parentElement.parentElement.remove();
        }
    }

    clearFields() {
        bookTitle.value = '';
        bookAuthor.value = '';
        bookISBN.value = '';
    }
}

class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static displayBooks() {
        const books = Store.getBooks();
        books.forEach(book => {
            const ui = new UI;
            ui.addBookToList(book);
        });
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }

}

const ui = new UI();

// Event Listeners
function setUpListeners() {
    document.addEventListener('DOMContentLoaded', Store.displayBooks());

    document.querySelector('.form').addEventListener('submit', e => {
        const book = new Book(bookTitle.value, bookAuthor.value, bookISBN.value);
        if (bookTitle.value === '' || bookAuthor.value === '' || bookISBN.value === '') {
            ui.showAlert('Please fill in all fields', 'error');
        } else {
            ui.addBookToList(book);
            Store.addBook(book);
            ui.clearFields();
            ui.showAlert('Book has been submitted!', 'success');
        }
        e.preventDefault();
    });

    document.querySelector('.table').addEventListener('click', (e) => {
        ui.deleteBook(e.target);
        Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
        ui.showAlert('Book has been removed!', 'success');
        e.preventDefault();
    });
}

setUpListeners();