
# Contacts App

### Description
Created a complete Contacts application that show all the contact details with thier name and Phone number

features of the application

- When the app is launched, show the contacts of the phone (name and number)
- Show a Search box at the top, where we can search contacts. For example if we type Arjun, all Arjuns must get listed
- If a contact is clicked on, show their name and number in a dismissable popup
- Added Dark mode and Light mode

## Screenshots Both in Dark and light mode
<image src="https://github.com/the-macson/contacts/assets/71259159/790a1388-62a7-492f-aa13-d5a440152bcb" width="200"/>
<image src="https://github.com/the-macson/contacts/assets/71259159/29b93fee-d14a-4de0-b393-2b7184c3bccd" width="200"/>
<image src="https://github.com/the-macson/contacts/assets/71259159/67b52e88-1875-474d-bd9d-f9b5b539737f" width="200"/>
<image src="https://github.com/the-macson/contacts/assets/71259159/301a9aba-d3d0-4695-9c19-6bb8ea2c6fcf" width="200"/>


## Package used
- react-native-contacts (https://www.npmjs.com/package/react-native-contacts)


## Run Locally
### Pre Requisite 

- Node js with updated version 

- JDK must be installed

- Java version is 17

- You will need to install Android Studio in order to set up the necessary tooling to build your React Native app for Android

Clone the project

```bash
  git clone https://github.com/the-macson/contacts
```

Go to the project directory

```bash
  cd contacts
```

Install dependencies 

```bash
  npm install
```
Connect any virtual devices to debug the application 

Run this command to run in android
```bash
  npx react-native run-android
```

## Approach 

### Explanation of the components of the code:

1. Import Statements:
- The code begins by importing necessary modules from React Native and other libraries.
```javascript
import React, {useState, useEffect, memo} from 'react';
import { View,Text,FlatList,TextInput,TouchableOpacity,Modal,StyleSheet,SafeAreaView,Image,useColorScheme} from 'react-native';
import Contacts from 'react-native-contacts';
import {PermissionsAndroid} from 'react-native';
```
2. ContactItem Component:
- This component represents a single contact item displayed in the list.
- It receives the contact item, a function to open contact details, and a boolean indicating if the app is in dark mode as props.
- It renders the contact item's display name and phone number along with an image.
- The `memo` function is used to memoize the component, optimizing its rendering performance.
```javascript
const ContactItem = memo(({item, openContactDetails, isDarkMode}) => (
  <TouchableOpacity onPress={() => openContactDetails(item)}>
    <View style={styles.contactItem}>
      <Image
        style={styles.image}
        source={require('./images/icons8-male-user-120(-xxxhdpi).png')}
      />
      <View style={{flexDirection: 'column'}}>
        <Text style={[styles.text, isDarkMode ? styles.whiteText : styles.darkText]}>{item.displayName}</Text>
        <Text style={isDarkMode ? styles.whiteText : styles.darkText} >{item?.phoneNumbers[0]?.number}</Text>
      </View>
    </View>
  </TouchableOpacity>
));
```

3. App Component:
- This is the main component of the app.
- It initializes the state variables using the `useState` hook.
- The `isDarkMode` variable is set based on the device's color scheme using the `useColorScheme` hook.
- The `contacts` state variable holds the list of contacts, and filteredContacts holds the filtered contacts based on the search text.
- The `searchText` state variable holds the value of the search input, and `selectedContact` holds the currently selected contact.
- The `useEffect` hook is used to load the contacts when the component mounts.
- The Part of App component Explanation is below.

```javascript
const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [contacts, setContacts] = useState();
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      message: 'This app would like to view your contacts.',
      buttonPositive: 'Please accept bare mortal',
    })
      .then(res => {
        console.log('Permission: ', res);
        Contacts.getAll()
          .then(contacts => {
            const sortedContacts = contacts.sort((a, b) => {
              if (a.displayName < b.displayName) {
                return -1;
              }
              if (a.displayName > b.displayName) {
                return 1;
              }
              return 0;
            });
            setContacts(sortedContacts);
          })
          .catch(e => {
            console.log(e);
          });
      })
      .catch(error => {
        console.error('Permission error: ', error);
      });
  };

  const handleSearch = text => {
    setSearchText(text);
    const filtered = contacts.filter(contact =>
      contact.displayName.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredContacts(filtered);
  };

  const openContactDetails = contact => {
    setSelectedContact(contact);
  };

  const closeContactDetails = () => {
    setSelectedContact(null);
  };

  const renderContactItem = ({item}) => (
    <ContactItem item={item} openContactDetails={openContactDetails} isDarkMode={isDarkMode} />
  );

  const renderModal = () => (
    <Modal
      visible={selectedContact !== null}
      animationType="slide"
      transparent={true}>
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, isDarkMode ? styles.modelDark : null]}>
          <Text style={[styles.text, isDarkMode ? styles.whiteText : styles.darkText]}>{selectedContact?.displayName}</Text>
          <Text style={[styles.number, isDarkMode ? styles.whiteText : styles.darkText]}>
            {selectedContact?.phoneNumbers[0]?.number}
          </Text>
          <TouchableOpacity
            onPress={closeContactDetails}
            style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.mainContainer, isDarkMode ? styles.darkMode : styles.lightMode]}>
      <View style={styles.container}>
        <TextInput
          style={[styles.searchInput, isDarkMode ? styles.darkSearchInput : null]}
          placeholder="Search Contacts"
          value={searchText}
          onChangeText={handleSearch}
        />
        {searchText.length > 0 && filteredContacts.length === 0 && (
          <Text style={styles.message}>No Contacts Found</Text>
        )}
        <View style={styles.flatList}>
          <FlatList
            data={searchText.length > 0 ? filteredContacts : contacts}
            renderItem={renderContactItem}
            keyExtractor={item => item.recordID}
            initialNumToRender={10}
          />
        </View>
        {renderModal()}
      </View>
    </SafeAreaView>
  );
};
```
4. loadContacts Function:
- This function requests permission to access the device's contacts using the `PermissionsAndroid` module.
- Upon receiving permission, it calls the `Contacts.getAll()` method to fetch all the contacts.
- The contacts are then sorted alphabetically based on the display name and stored in the `contacts` state variable.
```javascript
  const loadContacts = () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      message: 'This app would like to view your contacts.',
      buttonPositive: 'Please accept bare mortal',
    })
      .then(res => {
        console.log('Permission: ', res);
        Contacts.getAll()
          .then(contacts => {
            const sortedContacts = contacts.sort((a, b) => {
              if (a.displayName < b.displayName) {
                return -1;
              }
              if (a.displayName > b.displayName) {
                return 1;
              }
              return 0;
            });
            setContacts(sortedContacts);
          })
          .catch(e => {
            console.log(e);
          });
      })
      .catch(error => {
        console.error('Permission error: ', error);
      });
  };
```
5. handleSearch Function:
- This function is called when the text in the search input changes.
- It updates the `searchText` state variable and filters the contacts based on the entered text.
- The filtered contacts are stored in the `filteredContacts` state variable.
```javascript
const handleSearch = text => {
    setSearchText(text);
    const filtered = contacts.filter(contact =>
        contact.displayName.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredContacts(filtered);
};
```
6. openContactDetails and closeContactDetails Functions:
- These functions handle opening and closing the modal to display contact details.
- They update the `selectedContact` state variable accordingly.
```javascript
const openContactDetails = contact => {
    setSelectedContact(contact);
};

const closeContactDetails = () => {
    setSelectedContact(null);
};
```
7. renderContactItem Function:
- This function is used by the `FlatList` component to render each contact item.
- It renders the `ContactItem` component, passing the item, `openContactDetails` function, and `isDarkMode` value as props.
```javascript 
const renderContactItem = ({item}) => (
    <ContactItem item={item} openContactDetails={openContactDetails} isDarkMode={isDarkMode} />
);
```
8. renderModal Function:
- This function renders the modal component that displays the contact details.
- It is conditionally rendered based on whether a contact is selected (`selectedContact` is not null).
- The contact's display name and phone number are displayed inside the modal.
```javascript 
const renderModal = () => (
    <Modal
      visible={selectedContact !== null}
      animationType="slide"
      transparent={true}>
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, isDarkMode ? styles.modelDark : null]}>
          <Text style={[styles.text, isDarkMode ? styles.whiteText : styles.darkText]}>{selectedContact?.displayName}</Text>
          <Text style={[styles.number, isDarkMode ? styles.whiteText : styles.darkText]}>
            {selectedContact?.phoneNumbers[0]?.number}
          </Text>
          <TouchableOpacity
            onPress={closeContactDetails}
            style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
);
```
9. Main Render:
- The main render function returns the layout of the app.
- It includes a `SafeAreaView` and a container `View`.
- The search input field is rendered along with a message for empty search results.
- The `FlatList` component renders the list of contacts or filtered contacts.
- The `renderModal` function is called to render the contact details modal.
```javascript
<SafeAreaView style={[styles.mainContainer, isDarkMode ? styles.darkMode : styles.lightMode]}>
    <View style={styles.container}>
        <TextInput
          style={[styles.searchInput, isDarkMode ? styles.darkSearchInput : null]}
          placeholder="Search Contacts"
          value={searchText}
          onChangeText={handleSearch}
        />
        {searchText.length > 0 && filteredContacts.length === 0 && (
          <Text style={styles.message}>No Contacts Found</Text>
        )}
        <View style={styles.flatList}>
          <FlatList
            data={searchText.length > 0 ? filteredContacts : contacts}
            renderItem={renderContactItem}
            keyExtractor={item => item.recordID}
            initialNumToRender={10}
          />
        </View>
        {renderModal()}
    </View>
</SafeAreaView>
```
10. Styles:
- The code includes a set of styles using the `StyleSheet.create` method.
- Styles are defined for different components, such as the main container, search input, contact items, modal, etc.
- The styles also handle dark mode-specific styling by conditionally applying certain styles based on the `isDarkMode` value.
11. Export:
- The `App` component is exported as the default export of the module.
```javascript
export default App;
```
