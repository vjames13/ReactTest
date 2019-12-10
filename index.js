import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import bgMessager from './components/bgMessager'

AppRegistry.registerComponent(appName, () => App);

AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessager);
