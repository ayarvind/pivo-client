import { SafeAreaView, StatusBar, View } from 'react-native';
import React from 'react';
import Main from './src/Main';
import Splash from './src/screens/Splash';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import { NavigationContainer } from '@react-navigation/native';
import { MenuProvider } from 'react-native-popup-menu';

const App = () => {
  const [splash, setSplash] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <MenuProvider>
        <NavigationContainer>
          <StatusBar backgroundColor="white" barStyle="dark-content" />

          <Provider store={store}>
            <SafeAreaView style={{
              flex: 1,
              backgroundColor: 'white',


            }}>
              {splash ? <Splash /> : <Main />}
            </SafeAreaView>
          </Provider>
        </NavigationContainer>
      </MenuProvider>
    </>
  );
};

export default App;
