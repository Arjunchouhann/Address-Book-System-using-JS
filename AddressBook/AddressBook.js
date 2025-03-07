const fs = require('fs');

class AddressBook {
    constructor() {
        this.filePath = 'Contacts/Contacts.json';
        this.contacts = this.loadContacts();
    }

    // Load contacts from a file (instead of localStorage)
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

    // Save contacts to a file
    saveContacts() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.contacts, null, 2), 'utf8');
    }

    addContact(firstName, lastName, address, city, state, zip, phone, email) {
        const contact = { firstName, lastName, address, city, state, zip, phone, email };
        this.contacts.push(contact);
        this.saveContacts();
    }

    getContacts() {
        return this.contacts;
    }

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
addressBook.addContact('Arjun', 'Chouhan', '123 Street', 'Bhopal', 'MP', '462022', '325012378', 'arjun@example.com');

console.log("Contacts:", addressBook.getContacts());