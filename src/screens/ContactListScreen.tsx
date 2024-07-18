import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, Text, View, PermissionsAndroid, Platform, ActivityIndicator, FlatList, TextInput, Dimensions, Image } from 'react-native';
import Contacts from 'react-native-contacts';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getBulkUser } from '../user/user';
import Snackbar from 'react-native-snackbar';
import getMedia from '../utilities/getMedia';
import DisplayImage from '../components/layout/DisplayImage';
import { useDispatch, useSelector } from 'react-redux';
import { SET_CONTACTS } from '../redux/actions/contactAction';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
interface Contact {
    displayName: string;
    phoneNumbers: { number: string }[];
}
interface ContactsFromServer {
    id: string;
    name: string;
    phone: string;
    image: string;
    bio: string;
}

const ContactListScreen = () => {
    const [contacts, setContacts] = useState<ContactsFromServer[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const dispatch = useDispatch();
    const contactRedux = useSelector((state: any) => state.contacts)?.contacts;
    const navigation = useNavigation<StackNavigationProp<any>>();
    useEffect(() => {
        const requestPermission = async () => {
            if (Platform.OS === 'android') {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                        {
                            title: 'Contacts Permission',
                            message: 'This app needs access to your contacts.',
                            buttonNegative: 'Cancel',
                            buttonPositive: 'OK',
                        }
                    );

                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        if (contactRedux.length === 0) {
                            fetchContacts();
                        } else {
                            setContacts(contactRedux)
                        }
                    } else {
                        setError('Permission denied');
                        Snackbar.show({
                            text: 'Permission denied',
                            duration: Snackbar.LENGTH_SHORT,
                        })
                    }
                } catch (err) {
                    setError('Error in requesting permission');
                }
            } else {
                if (contactRedux.length === 0) {
                    fetchContacts();
                } else {
                    setContacts(contactRedux)
                }
            }
        };

        const fetchContacts = async () => {
            setLoading(true);
            try {
                const allContacts = await Contacts.getAll();
                const uniquePhoneNumbers = new Map<string, Contact>();

                allContacts.forEach(contact => {
                    contact.phoneNumbers.forEach(phone => {
                        const phoneNumber = phone.number.trim();
                        const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber);

                        if (parsedPhoneNumber) {
                            const normalizedNumber = parsedPhoneNumber.formatNational();
                            if (normalizedNumber && !uniquePhoneNumbers.has(normalizedNumber)) {
                                uniquePhoneNumbers.set(normalizedNumber, {
                                    displayName: contact.displayName || 'Unknown',
                                    phoneNumbers: [{ number: (normalizedNumber[0] === "0" ? normalizedNumber.slice(1) : normalizedNumber) }]
                                });
                            }
                        }
                    });
                });

                const uniqueContactsArray = Array.from(uniquePhoneNumbers.values());

                // Fetch user data
                const userRequests = await getBulkUser(uniqueContactsArray);

                let updatedContacts: ContactsFromServer[] = [];
                if (userRequests.success) {
                    updatedContacts = userRequests.users;
                }
                //    update image 
                for (let i = 0; i < updatedContacts.length; i++) {
                    const media = await getMedia(updatedContacts[i].image, updatedContacts[i].id);
                    updatedContacts[i].image = media || '';
                }
                dispatch({
                    type: SET_CONTACTS,
                    payload: updatedContacts
                })

                setContacts(updatedContacts);


            } catch (err) {
                setError('Error in fetching contacts details');
            } finally {
                setLoading(false);
            }
        };

        requestPermission();
    }, []);

    const filteredContacts = useMemo(() => {
        return contacts.filter((contact) => {
            const lowercasedSearch = search.toLowerCase();
            return (
                contact.name.toLowerCase().includes(lowercasedSearch) ||
                contact.phone.toLowerCase().includes(lowercasedSearch)
            );
        });
    }, [contacts, search]);

    if (loading) {
        Snackbar.show({
            text: 'You will only see the contacts of those who are in Pivo',
            duration: Snackbar.LENGTH_SHORT
        })
    }
    return (
        <View style={styles.container}>
            <View style={styles.filter}>
                <Text style={styles.filterText}>All Contacts({contacts.length})</Text>
                <View style={styles.inputFieldContainer}>
                    <Icon name='search' size={20} color="black" />
                    <TextInput
                        style={styles.input}
                        placeholder="Search"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="grey" />
            ) : error ? (
                <Text style={styles.errorText}>Error: {error}</Text>
            ) : (
                <FlatList
                    keyExtractor={(item) => item.id}
                    data={filteredContacts}
                    renderItem={({ item }) => (
                        <TouchableOpacity activeOpacity={0.3} onPress={() => {
                            const userProps = {
                                id: item.id,
                                name: item.name,
                                phone: item.phone,
                                image: item.image,
                                bio: item.bio
                            }
                            navigation.navigate('Chat' ,userProps)
                        }} style={styles.contactContainer}>
                            <View>
                                {
                                    item.image ? (
                                        <Image src={`file:///${item.image}`} style={styles.contactImage} />
                                    ) : (
                                        <Image style={styles.contactImage} source={require('../../assets/user.png')} />
                                    )
                                }

                            </View>
                            <View>
                                <Text style={styles.contactName}>{item.name}</Text>
                                <Text style={styles.contactPhone}>
                                    {
                                        item.bio ? item.bio : "Hey's there! I am using Pivo"
                                    }
                                </Text>

                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: 'white',
        height: Dimensions.get('window').height,
    },
    filter: {
        flexDirection: 'column',
        marginBottom: 5,
        gap: 15,
    },
    filterText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    inputFieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 5,
        height: 50,
        borderColor: '#d0d0d0',
        borderWidth: 1,
        paddingHorizontal: 10,
    },
    input: {
        height: 50,
        flex: 1,
        fontSize: 18,
        paddingLeft: 10,
    },
    contactContainer: {
        flexDirection: 'row',
        paddingVertical: 16,
        width: '100%',

    },
    contactName: {
        fontSize: 18,
        // fontWeight: 'bold',
        marginBottom: 4,
    },
    contactPhone: {
        fontSize: 12,
        color: '#555',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    contactImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
});


export default ContactListScreen;
