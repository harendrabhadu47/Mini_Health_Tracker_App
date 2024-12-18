import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '../assests/colors';
import assests from '../assests';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

interface TDailyLog {
    waterIntake : string;
    steps : string;
    sleepHours : string;
    date : string
}

interface IProps {
    navigation : any
}
const Home:React.FC<IProps> = ({navigation}) => {
    const [todaysLog, setTodaysLog] = useState<TDailyLog|null>()
    const fetchLogs = async () => {
        try {
            const storedLogs = await AsyncStorage.getItem('dailyLogs');
            const logsArr = storedLogs ? JSON.parse(storedLogs) : [];

            const todayData = logsArr.find((log:TDailyLog) => log.date === moment().format('YYYY-MM-DD'));

            if (todayData) {
                setTodaysLog(todayData);            
            } else {
                setTodaysLog(null);
            }
        } catch (error) {
            console.error('Error fetching today\'s log:', error);
        }
    };

    

    useEffect(() => {
        fetchLogs();
    }, []);


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Health Tracker</Text>
            </View>

            <View style={styles.body}>
                <Text style={styles.title}>Today's Logs</Text>

            <View>
            <View style={styles.logsContainer}>
                    <View style={styles.logBox}>
                        <Image source={assests.water} style={styles.Img} />
                        <Text style={styles.logValue}>{todaysLog?.waterIntake|| 0} Liters</Text>
                    </View>

                    <View style={styles.logBox}>
                        <Image source={assests.footsteps} style={styles.Img} />
                        <Text style={styles.logValue}>{todaysLog?.steps|| 0} Steps</Text>
                    </View>

                </View>
                <View style={styles.logBox}>
                    <Image source={assests.sleeping} style={styles.Img} />
                    <Text style={styles.logValue}>{todaysLog?.sleepHours|| 0} Hours</Text>
                </View>
            </View>
            </View>
            <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => navigation.navigate("AddDailyLogs")}>
                <Text style={styles.addBtn}>Add</Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 10,
        backgroundColor: COLORS.gray200,
        alignItems: 'center',
    },
    headerText: {
        color: COLORS.black,
        fontSize: 17,
        fontWeight: 'bold',
    },
    body: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#000',
    },
    logsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,

    },
    logBox: {
        // flex: 1.5,
        width: "45%",
        marginHorizontal: 5,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        // alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    Img: {
        height: 25,
        width: 25,
        alignSelf: 'center',
        marginVertical: 10
    },
    logValue: {
        fontSize: 14,
        color: '#555',
        fontWeight: '700'
    },
    buttonContainer: {
        padding: 8,
        alignSelf: 'flex-end',
        width: '40%',
        backgroundColor: "#6e79e0",
        borderRadius: 20,
        margin: 20,
        textAlign: 'center',

    },
    addBtn: {
        alignSelf: 'center',
        fontWeight: '600',
        fontSize: 16,
        color:'white'
    },
});

