This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm react-native run-android

# OR using Yarn
yarn android
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

# Google drive link of app preview
https://drive.google.com/file/d/1OnCVYVqqRq1CM8FEnbeA106JqMFlLuON/view?usp=sharing

<!-- Feature Details. -->

<!-- Mainly, bottom tab navigation has been used in the app, first tab is Home or second WeeklyOverview, -->

<!-- Home Screen -->
The landing page of this app is the Home screen where data of today's logs is shown. There is an Add button on the home page which navigates us to the AddDailyLos screen.

<!-- AddDailyLogs Screen -->
In AddDailyLogs logs data is updated/added or click on save to navigate back to the home page.

<!-- WeeklyOverview Screen -->
A dropdown has been used in the Week Clearview screen in which the week has to be selected.
The data of the week that the user selects is shown in bar chart.