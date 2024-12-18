import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import WeeklyOverview from '../screens/WeeklyOverview';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from '../assests/colors';
import assests from '../assests';
import AddDailyLogs from '../screens/AddDailyLogs';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const StackNavigation = () => {
    return (
        // <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name='TabNavigator' component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name='AddDailyLogs' component={AddDailyLogs} options={{ headerShown: false }} />
        </Stack.Navigator>
        // </NavigationContainer>
    )
}

const TabNavigator = () => {
    return (
        <Tab.Navigator initialRouteName='Home'>
            <Tab.Screen name='Home' component={Home}
                options={{
                    headerShown: false, tabBarIcon: ({ focused }) =>
                    (<Image source={assests.home}
                        style={[
                            styles.icon,
                            {  tintColor: focused ? COLORS.blue200 : COLORS.gray300},
                        ]} />)
                }} />
            <Tab.Screen name='WeeklyOverview' component={WeeklyOverview}
                options={{
                    headerShown: false, tabBarIcon: ({ focused }) =>
                    (<Image source={assests.statistic}
                        style={[
                            styles.icon,
                            {  tintColor: focused ? COLORS.blue200 : COLORS.gray300},
                        ]} />)
                }} />

        </Tab.Navigator>
    )
}

export default StackNavigation

const styles = StyleSheet.create({
    icon: {
        height: 20,
        width: 20,
    },

})