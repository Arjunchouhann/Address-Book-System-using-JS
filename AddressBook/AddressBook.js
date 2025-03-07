const fs = require('fs');

class AddressBookApp {
    constructor() {
        this.filePath = 'Contacts/Contacts.json';
        this.addressBooks = this.loadAddressBooks(); // Load existing data
    }

    loadAddressBooks() {
        try {
            if (fs.existsSync(this.filePath)) {
                return JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
            }
        } catch (error) {
            console.error("Error loading data:", error);
        }
        return {}; // Return empty if file doesn't exist
    }

    saveAddressBooks() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.addressBooks, null, 2), 'utf8');
    }

    createAddressBook(name) {
        if (this.addressBooks[name]) {
            console.log(`'${name}' already exists.`);
            return;
        }
        this.addressBooks[name] = [];
        this.saveAddressBooks();
        console.log(`'${name}' created.`);
    }

    validateContact(firstName, lastName, address, city, state, zip, phone, email) {
        const nameRegex = /^[A-Z][a-zA-Z]{2,}$/;
        const addressRegex = /^.{4,}$/;
        const zipRegex = /^[0-9]{5,6}$/;
        const phoneRegex = /^[6-9][0-9]{9}$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!nameRegex.test(firstName)) throw new Error("Invalid First Name");
        if (!nameRegex.test(lastName)) throw new Error("Invalid Last Name");
        if (!addressRegex.test(address)) throw new Error("Invalid Address");
        if (!addressRegex.test(city)) throw new Error("Invalid City");
        if (!addressRegex.test(state)) throw new Error("Invalid State");
        if (!zipRegex.test(zip)) throw new Error("Invalid Zip Code");
        if (!phoneRegex.test(phone)) throw new Error("Invalid Phone");
        if (!emailRegex.test(email)) throw new Error("Invalid Email");
    }

    addContact(bookName, firstName, lastName, address, city, state, zip, phone, email) {
        if (!this.addressBooks[bookName]) {
            console.log(`'${bookName}' not found.`);
            return;
        }
        try {
            this.validateContact(firstName, lastName, address, city, state, zip, phone, email);
            const contact = { firstName, lastName, address, city, state, zip, phone, email };

            // Check for duplicates
            if (this.addressBooks[bookName].some(c => c.firstName === firstName && c.lastName === lastName)) {
                console.log("Duplicate contact.");
                return;
            }

            this.addressBooks[bookName].push(contact);
            this.saveAddressBooks();
            console.log("Contact added.");
        } catch (error) {
            console.error("Error:", error.message);
        }
    }

    viewContacts(bookName) {
        console.log(this.addressBooks[bookName] || `'${bookName}' not found.`);
    }

    deleteContact(bookName, firstName, lastName) {
        if (!this.addressBooks[bookName]) return console.log(`'${bookName}' not found.`);

        let contacts = this.addressBooks[bookName];
        const initialLength = contacts.length;

        this.addressBooks[bookName] = contacts.filter(c => c.firstName !== firstName || c.lastName !== lastName);

        if (this.addressBooks[bookName].length === initialLength) {
            console.log("Contact not found.");
        } else {
            this.saveAddressBooks();
            console.log("Contact deleted.");
        }
    }

    editContact(bookName, firstName, lastName, newDetails) {
        if (!this.addressBooks[bookName]) return console.log(`'${bookName}' not found.`);

        let contact = this.addressBooks[bookName].find(c => c.firstName === firstName && c.lastName === lastName);
        if (!contact) return console.log("Contact not found.");

        Object.keys(newDetails).forEach(key => {
            if (contact[key] !== undefined && newDetails[key] !== undefined) {
                contact[key] = newDetails[key];
            }
        });

        this.saveAddressBooks();
        console.log("Contact updated.");
    }

    countContacts(bookName) {
        console.log(`Total: ${this.addressBooks[bookName]?.length || 0}`);
    }

    searchByCityOrState(cityOrState) {
        let results = [];
        Object.keys(this.addressBooks).forEach(bookName => {
            results.push(...this.addressBooks[bookName].filter(contact =>
                contact.city?.toLowerCase() === cityOrState.toLowerCase() ||
                contact.state?.toLowerCase() === cityOrState.toLowerCase()
            ));
        });

        console.log(results.length ? results : "No matches found.");
    }

    sortContacts(bookName, field = "firstName") {
        if (!this.addressBooks[bookName]) return console.log(`'${bookName}' not found.`);

        if (!['firstName', 'lastName', 'city', 'state', 'zip', 'phone', 'email'].includes(field)) {
            return console.log("Invalid sort field.");
        }

        this.addressBooks[bookName].sort((a, b) => a[field]?.localeCompare(b[field]) || 0);
        this.saveAddressBooks();
        console.log("Contacts sorted.");
    }
}

// Example Usage
const app = new AddressBookApp();
app.createAddressBook("Personal");
app.addContact("Personal", "John", "Doe", "123 Main St", "New York", "NY", "10001", "9876543210", "john.doe@example.com");
app.viewContacts("Personal");
app.createAddressBook("Work");
app.addContact("Work", "Alice", "Smith", "456 Market St", "Los Angeles", "California", "90001", "9123456789", "alice.smith@example.com");
app.viewContacts("Work");
app.editContact("Work", "Alice", "Smith", { phone: "9876543211", email: "alice.new@example.com" });
app.deleteContact("Work", "Alice", "Smith");
app.countContacts("Personal");
app.searchByCityOrState("New York");
app.sortContacts("Personal", "city");
