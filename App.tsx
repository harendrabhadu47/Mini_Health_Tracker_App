import { Platform, StyleSheet, Text, View } from 'react-native'
import StackNavigation from './src/navigation/StackNavigation'
import { NavigationContainer } from '@react-navigation/native'
import Home from './src/screens/Home'


const App = () => {
  return (
  <NavigationContainer>
        <StackNavigation/>
        {/* <Home/> */}
  </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})