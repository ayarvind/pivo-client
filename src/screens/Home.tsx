import { StyleSheet, Text, View, ActivityIndicator, AppState, AppStateStatus } from 'react-native';
import React, { useEffect, useState } from 'react';
import Fab from '../components/layout/Fab';
import { getUser, getUserId } from '../user/user';
import { useDispatch, useSelector } from 'react-redux';
import Snackbar from 'react-native-snackbar';
import Icon from 'react-native-vector-icons/AntDesign';
import Updateprofile from '../components/user/Updateprofile';
import getMedia from '../utilities/getMedia';
import { useNavigation } from '@react-navigation/native';
import requestExternalStoragePermission from '../utilities/FilePermission';


const Home = () => {
  const [userId, setUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [needUpdate, setNeedUpdate] = useState(false);
  const [user, setUser] = useState<any>(null);

  const dispatch = useDispatch();
  const user_ = useSelector((state: any) => state?.user)?.user;
  const navigation = useNavigation();

  useEffect(() => {
    requestExternalStoragePermission();
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getUserId();
        setUserId(id as string);

        if (user_?.id) {
          setUser(user_);
          setIsLoading(false);
        } else {
          let data = await getUser(id as string);
          if (!data.success) {
            setUser(null);
            Snackbar.show({
              text: 'Error in fetching your data',
              duration: Snackbar.LENGTH_SHORT,
            });
          } else {
            let dp = null;
            if (data.user.image) {
              dp = await getMedia(data.user.image, data.user.id);
            }
            data.user = { ...data.user, image: dp ? dp : "" };
            setUser(data.user);
            dispatch({
              type: 'SET_USER',
              payload: data.user,
            });
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setUser(null);
        setIsLoading(false);
      }
    };

    fetchUserId();
  }, [user_, dispatch]);


  useEffect(() => {
    if (user && !user.name) {
      console.log('User needs to update profile:', user);
      setNeedUpdate(true);
    }
  }, [user]);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="grey" />
      </View>
    );
  }

  if (!userId) {
    return <Text>User not found</Text>;
  }

  const handlePress = () => {
    navigation.navigate('Contact' as never);
  };

  return (
    <View style={styles.container}>
      {!user ? (
        <View style={styles.profileNotFound}>
          <Icon name="user" size={43} />
          <Text>Profile not found</Text>
        </View>
      ) : (
        <Text>Welcome {user.name}</Text>
      )}
      <Fab icon="plus" onPress={handlePress} />

      {needUpdate && (
        <Updateprofile
          visible={needUpdate}
          onClose={() => {
            setNeedUpdate(false);
            // reopen the home screen
            navigation.navigate('Home' as never);
          }}
        />
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileNotFound: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
