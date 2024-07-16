import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Fab from '../components/layout/Fab';
import { getUser, getUserId } from '../user/user';
import { useDispatch } from 'react-redux';
import Drawer from '../components/layout/Drawer';
import Snackbar from 'react-native-snackbar';
import Icon from 'react-native-vector-icons/AntDesign';

const Home = () => {
  const [userId, setUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [needUpdate, setNeedUpdate] = useState(false);
  const [user, setUser] = useState<any>();
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      setUserId(id as string);
      const {user,success} = await getUser(id as string);
      if(!success){
        setUser(null);
        Snackbar.show({
          text: 'Error in  fetching your data',
          duration: Snackbar.LENGTH_SHORT
        })
      }else{
        setUser(user);
        dispatch({
          type: 'SET_USER',
          payload: user
        })
      }
      console.log(user);
      const needUpdate:boolean = !user?.name;
      if(needUpdate){
        setNeedUpdate(true);
      }
      setIsLoading(false);
    };

    fetchUserId();

  }, []);

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
    // Your press handler logic
  };

  return (
    <View style={styles.container}>
      {
        !user ? (
          <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Icon name={'user'} size={43} />
            <Text>Profile not found</Text>
          </View>
        ) : (
          <Text>Welcome {user.name}</Text>
        )
      }
      {/* open update drawer */}
    {/* <Drawer/> */}
      <Fab icon={'plus'} onPress={handlePress} />
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
});
