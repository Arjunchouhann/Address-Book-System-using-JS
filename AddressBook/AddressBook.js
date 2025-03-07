const fs = require('fs');

class AddressBookApp {
    constructor() {
        this.filePath = 'Contacts/Contacts.json';
        this.addressBooks = this.loadAddressBooks();
    }

    loadAddressBooks() {
        try {
            if (fs.existsSync(this.filePath)) {
                const data = fs.readFileSync(this.filePath, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.error("Error loading address books:", error);
        }
        return {};
    }

    saveAddressBooks() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.addressBooks, null, 2), 'utf8');
    }

    createAddressBook(name) {
        if (this.addressBooks[name]) {
            console.log(`Address Book '${name}' already exists.`);
            return;
        }
        this.addressBooks[name] = [];
        this.saveAddressBooks();
        console.log(`New Address Book '${name}' created successfully.`);
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
        if (!phoneRegex.test(phone)) throw new Error("Invalid Phone Number");
        if (!emailRegex.test(email)) throw new Error("Invalid Email Address");
    }

    addContact(bookName, firstName, lastName, address, city, state, zip, phone, email) {
        if (!this.addressBooks[bookName]) {
            console.log(`Address Book '${bookName}' does not exist.`);
            return;
        }
        try {
            this.validateContact(firstName, lastName, address, city, state, zip, phone, email);

            const contact = { firstName, lastName, address, city, state, zip, phone, email };



            this.addressBooks[bookName].push(contact);
            const isDuplicate = this.addressBooks[bookName].some(c => c.name === contact.name);
            if (isDuplicate) {
                console.log(`Duplicate entry! Contact '${contact.name}' already exists in '${bookName}'.`);
                return;
            }
            this.saveAddressBooks();
            console.log("Contact added successfully!");
        } catch (error) {
            console.error("Error adding contact:", error.message);
        }
    }


    viewContacts(bookName) {
        if (!this.addressBooks[bookName]) {
            console.log(`Address Book '${bookName}' does not exist.`);
            return;
        }
        console.log(`Contacts in '${bookName}':`, this.addressBooks[bookName]);
    }


    deleteContact(bookName, firstName, lastName) {
        if (!this.addressBooks[bookName]) {
            console.log(`Address Book '${bookName}' does not exist.`);
            return;
        }

        let contacts = this.addressBooks[bookName];
        const initialLength = contacts.length;

        // Filter out the contact to be deleted
        this.addressBooks[bookName] = contacts.filter(
            c => !(c.firstName === firstName && c.lastName === lastName)
        );

        if (this.addressBooks[bookName].length === initialLength) {
            console.log(`Contact '${firstName} ${lastName}' not found in '${bookName}'.`);
        } else {
            this.saveAddressBooks();
            console.log(`Contact '${firstName} ${lastName}' deleted successfully!`);
        }
    }
    editContact(bookName, firstName, lastName, newDetails) {
        if (!this.addressBooks[bookName]) {
            console.log(`Address Book '${bookName}' does not exist.`);
            return;
        }

        let contacts = this.addressBooks[bookName];
        let contact = contacts.find(c => c.firstName === firstName && c.lastName === lastName);

        if (!contact) {
            console.log(`Contact '${firstName} ${lastName}' not found in '${bookName}'.`);
            return;
        }

        Object.keys(newDetails).forEach(key => {
            if (contact[key] !== undefined && newDetails[key] !== undefined) {
                contact[key] = newDetails[key];
            }
        });

        this.saveAddressBooks();
        console.log(`Contact '${firstName} ${lastName}' updated successfully!`);
    }

    countContacts(bookName) {
        if (!this.addressBooks[bookName]) {
            console.log(`Address Book '${bookName}' does not exist.`);
            return 0;
        }

        // Use reduce function to count the contacts
        const contactCount = this.addressBooks[bookName].reduce((count) => count + 1, 0);
        console.log(`Total contacts in '${bookName}': ${contactCount}`);
        return contactCount;
    }


    searchByCityOrState(cityOrState) {
        let results = [];

        Object.keys(this.addressBooks).forEach(bookName => {
            const contacts = this.addressBooks[bookName].filter(contact =>
                contact.city === cityOrState ||
                contact.state === cityOrState
            );
            results = results.concat(contacts);
        });

        if (results.length === 0) {
            console.log(`No contacts found in '${cityOrState}'.`);
        } else {
            console.log(`Contacts in '${cityOrState}':`, results);
        }
    }
    countByCityOrState(cityOrState) {
        let count = 0;
        Object.keys(this.addressBooks).forEach(bookName => {
            count += this.addressBooks[bookName].filter(contact =>
                contact.city === cityOrState ||
                contact.state=== cityOrState
            ).length;
        });
        console.log(`Total contacts in '${cityOrState}': ${count}`);
        return count;
    }
    sortContactsLexicographically(bookName) {
        if (!this.addressBooks[bookName]) {
            console.log(`Address Book '${bookName}' does not exist.`);
            return;
        }
        this.addressBooks[bookName].sort((a, b) => a.firstName.localeCompare(b.firstName));
        this.saveAddressBooks();
        console.log(`Contacts in '${bookName}' sorted lexicographically by first name.`);
    }
}



// Example Usage
const app = new AddressBookApp();
app.createAddressBook("Personal");
app.addContact("Personal", "John", "Doe", "123 Main St", "New York", "NY", "10001", "9876543210", "john.doe@example.com");
app.viewContacts("Personal");
app.createAddressBook("Work");
app.addContact("Work", "Alice", "Smith", "456 Market St", "Berkhera pathani", "California", "90001", "9123456789", "alice.smith@example.com");
app.viewContacts("Work");
app.editContact("Work", "Alice", "Smith", { phone: "9876543211", email: "john.new@example.com" });
app.deleteContact("Work", "Alice", "Smith");
app.countContacts("Personal");
app.addContact("Personal", "John", "Doe", "123 Main St", "New York", "Nwq idhhd", "10001", "9876543210", "john.doe@example.com");
// app.searchByCityOrState("California");
app.addContact("Work", "Vivek", "Sahu", "456 Market St", "New Jersery", "New jersey", "90001", "9123456789", "alice.smith@example.com");
app.searchByCityOrState("New York");
app.countByCityOrState("New York");
app.sortContactsLexicographically("Personal");