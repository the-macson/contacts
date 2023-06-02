import React, {useState, useEffect, memo} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  SafeAreaView,
  Image,
  useColorScheme,
} from 'react-native';
import Contacts from 'react-native-contacts';
import {PermissionsAndroid} from 'react-native';

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

const styles = StyleSheet.create({
  darkMode: {
    backgroundColor: '#1d1e1f',
  },
  lightMode: {
    backgroundColor: 'white',
  },
  darkSearchInput: {
    backgroundColor: '#45515e',
    color: 'white',
  },
  mainContainer: {
    backgroundColor: 'white',
    flex: 1,
  },
  container: {
    padding: 10,
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  searchInput: {
    height: 50,
    backgroundColor: '#ededed',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 10,
    color: 'black',
  },
  contactItem: {
    paddingVertical: 10,
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 17,
    fontWeight: 400,
    color: '#000',
  },
  message: {
    fontSize: 20,
    fontWeight: 400,
    textAlign: 'center',
    marginTop: 40,
  },
  number: {
    fontSize: 15,
    fontWeight: 400,
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    paddingVertical: 50,
    borderRadius: 10,
    alignItems: 'center',
    width: 350,
  },
  modelDark: {
    backgroundColor: '#1d1e1f',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#0000FF',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
  },
  whiteText: {
    color: '#fff',
  },
  darkText: {
    color: '#000',
  },
});

export default App;
