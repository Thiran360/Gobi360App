/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Ignore known warnings from @react-native-voice/voice
LogBox.ignoreLogs([
  '`new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method.',
  '`new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners` method.'
]);

// Global fetch interceptor to log network requests in the Console tab
if (__DEV__) {
  const originalFetch = global.fetch;
  global.fetch = async (...args) => {
    console.log('🔵 [NETWORK REQUEST]', args[0], JSON.stringify(args[1], null, 2));
    try {
      const response = await originalFetch(...args);
      const clonedResponse = response.clone();
      clonedResponse.text().then(text => {
        console.log('🟢 [NETWORK RESPONSE]', args[0], text);
      }).catch(err => {
        console.log('🟠 [NETWORK RESPONSE UNPARSABLE]', args[0]);
      });
      return response;
    } catch (error) {
      console.error('🔴 [NETWORK ERROR]', args[0], error);
      throw error;
    }
  };
}

AppRegistry.registerComponent(appName, () => App);
