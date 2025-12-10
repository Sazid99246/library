const myLibrary = [];

class Book {
    constructor(title, author, pages, read) {
        if (!new.target) {
            throw Error("You must use the 'new' operator to call the constructor");
        }
        this.id = crypto.randomUUID();
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }
    toggleReadStatus() {
        this.read = !this.read;
    }
}

function addBookToLibrary(title, author, pages, read) {
    const book = new Book(title, author, pages, read);
    myLibrary.push(book);
}


addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 310, true);
addBookToLibrary("1984", "George Orwell", 328, false);
addBookToLibrary("To Kill a Mockingbird", "Harper Lee", 281, true);

function removeBook(bookId) {
    // Find the index of the book object in the array using its unique id
    const bookIndex = myLibrary.findIndex(book => book.id === bookId);
    
    if (bookIndex > -1) {
        // Remove the book from the array
        myLibrary.splice(bookIndex, 1);
        // Refresh the display to show the updated library
        displayBook(); 
    }
}

function toggleReadStatus(bookId) {
    // Find the book object in the array
    const book = myLibrary.find(b => b.id === bookId);
    
    if (book) {
        // Use the prototype method to change the status
        book.toggleReadStatus();
        // Refresh the display to show the updated status
        displayBook(); 
    }
}

function displayBook() {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = ''; 
    
    myLibrary.forEach(book => {
        const tr = document.createElement("tr");
        
        // CRITICAL STEP: Associate the row with the book's unique ID
        tr.dataset.bookId = book.id; 

        // Data Cells (Unchanged)
        const id = document.createElement("td");
        id.innerText = book.id;
        tr.appendChild(id);
        
        const title = document.createElement("td");
        title.innerText = book.title;
        tr.appendChild(title);

        const author = document.createElement("td");
        author.innerText = book.author;
        tr.appendChild(author);

        const pages = document.createElement("td");
        pages.innerText = book.pages;
        tr.appendChild(pages);

        const read = document.createElement("td");
        // Display "Yes" or "No" and add a class for potential styling
        read.innerText = book.read ? "Yes" : "No"; 
        read.classList.add(book.read ? 'read-status-yes' : 'read-status-no');
        tr.appendChild(read);
        
        // --- NEW: Actions Cell and Buttons ---
        const actionsCell = document.createElement("td");

        // 1. Toggle Read Button
        const readToggleBtn = document.createElement('button');
        readToggleBtn.textContent = book.read ? 'Mark Unread' : 'Mark Read';
        readToggleBtn.classList.add('read-toggle-btn');
        // Attach the toggleReadStatus function, passing the book's ID
        readToggleBtn.addEventListener('click', () => {
            toggleReadStatus(book.id);
        });

        // 2. Remove Button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.classList.add('remove-btn');
        // Attach the removeBook function, passing the book's ID
        removeBtn.addEventListener('click', () => {
            removeBook(book.id);
        });
        
        // Append both buttons to the actions cell
        actionsCell.append(readToggleBtn, removeBtn);
        tr.appendChild(actionsCell);

        tbody.appendChild(tr);
    });
}

displayBook();

const newBookBtn = document.getElementById('new-book-btn');
const dialog = document.getElementById('book-form-dialog');
const addBookForm = document.getElementById('add-book-form');

// 1. Event listener to open the dialog
newBookBtn.addEventListener('click', () => {
    // showModal() displays the dialog and makes the rest of the page inert
    dialog.showModal(); 
});

// 2. Event listener to close the dialog with the 'Cancel' button
document.getElementById('close-dialog-btn').addEventListener('click', () => {
    dialog.close();
});


// 3. Event listener for form submission
addBookForm.addEventListener('submit', (event) => {
    // Crucial step: Stops the form from trying to submit data to a server, 
    // which would cause a page refresh by default.
    event.preventDefault(); 
    
    // Get values from the form inputs
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = parseInt(document.getElementById('pages').value); // Convert pages to a number
    const read = document.getElementById('read').checked; // Checkbox returns a boolean
    
    // Add the new book to the library array
    addBookToLibrary(title, author, pages, read);
    
    // Refresh the table to show the new book
    displayBook(); 
    
    // Reset the form fields and close the dialog
    addBookForm.reset(); 
    dialog.close();
});