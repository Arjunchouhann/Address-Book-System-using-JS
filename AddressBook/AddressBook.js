const fs = require('fs');

class AddressBookApp {
    constructor() {
        this.filePath = 'Contacts/AddressBooks.json';
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

    deleteAddressBook(bookName) {
        if (!this.addressBooks[bookName]) {
            console.log(`Address Book '${bookName}' does not exist.`);
            return;
        }
        delete this.addressBooks[bookName];
        this.saveAddressBooks();
        console.log(`Address Book '${bookName}' deleted successfully.`);
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
}

// Example Usage
const app = new AddressBookApp();
app.createAddressBook("Personal");
app.addContact("Personal", "Arjun", "Chouhan", "123 Main St", "New York", "NY", "10001", "9876543210", "arjun.chouhan@example.com");
app.viewContacts("Personal");
app.createAddressBook("Office");
app.addContact("Office", "Alice", "Smith", "456 Market St", "Berkhera pathani", "California", "90001", "9123456789", "alice.smith@example.com");
app.viewContacts("Office");
app.editContact("Office", "Alice", "Smith", { phone: "9800543211", email: "john.new@example.com" });