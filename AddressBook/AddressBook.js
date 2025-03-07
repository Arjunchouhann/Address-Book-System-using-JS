const fs = require('fs');

//Constructor
class AddressBook {
    constructor() {
        this.filePath = 'Contacts/Contacts.json';
        this.contacts = this.loadContacts();
    }

    //Loading Contacts
    loadContacts() {
        try {
            if (fs.existsSync(this.filePath)) {
                const data = fs.readFileSync(this.filePath, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.error("Error loading contacts:", error);
        }
        return [];
    }

    //Saving Contacts
    saveContacts() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.contacts, null, 2), 'utf8');
    }

    //Validation
    validateContact(firstName, lastName, address, city, state, zip, phone, email) {
        const nameRegex = /^[A-Z][a-zA-Z]{2,}$/; // Starts with a capital, min 3 chars
        const addressRegex = /^.{4,}$/; // At least 4 characters
        const zipRegex = /^[0-9]{5,6}$/; // Zip should be 5 or 6 digits
        const phoneRegex = /^[6-9][0-9]{9}$/; // Valid Indian mobile number
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Standard email pattern

        if (!nameRegex.test(firstName)) throw new Error("First Name must start with a capital letter and have at least 3 characters.");
        if (!nameRegex.test(lastName)) throw new Error("Last Name must start with a capital letter and have at least 3 characters.");
        if (!addressRegex.test(address)) throw new Error("Address must have at least 4 characters.");
        if (!addressRegex.test(city)) throw new Error("City must have at least 4 characters.");
        if (!addressRegex.test(state)) throw new Error("State must have at least 4 characters.");
        if (!zipRegex.test(zip)) throw new Error("Invalid Zip Code.");
        if (!phoneRegex.test(phone)) throw new Error("Invalid Phone Number.");
        if (!emailRegex.test(email)) throw new Error("Invalid Email Address.");
    }

    //Adding Contacts
    addContact(firstName, lastName, address, city, state, zip, phone, email) {
        try {
            this.validateContact(firstName, lastName, address, city, state, zip, phone, email);
            const contact = { firstName, lastName, address, city, state, zip, phone, email };
            this.contacts.push(contact);
            this.saveContacts();
            console.log("Contact added successfully!");
        } catch (error) {
            console.error("Error adding contact:", error.message);
        }
    }

    //Getting all contacts
    getContacts() {
        return this.contacts;
    }

    //Deleting Contacts
    deleteContact(index) {
        if (index < 0 || index >= this.contacts.length) {
            throw new Error("Invalid index.");
        }
        this.contacts.splice(index, 1);
        this.saveContacts();
    }
}

// Example Usage
const addressBook = new AddressBook();
addressBook.addContact('Marry', 'jain', '123 Main St', 'New York', 'NY', '10001', '9876543210', 'marry.Jain@example.com');
addressBook.addContact('Marry', 'Jain', '123 Main St', 'New York', 'NEW YORK', '10001', '9876542340', 'marry.jain@example.com');
console.log("Contacts:", addressBook.getContacts());