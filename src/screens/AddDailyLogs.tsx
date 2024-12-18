import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from '../assests/colors';
import assests from '../assests';
import moment from 'moment';

interface TDailyLog {
    waterIntake : string;
    steps : string;
    sleepHours : string;
    date : string
}

interface IProps {
    navigation:any
}

const AddDailyLogs:React.FC<IProps> = ({ navigation}) => {
    const [waterIntake, setWaterIntake] = useState<string>('');
    const [steps, setSteps] = useState('');
    const [sleepHours, setSleepHours] = useState('')
    const [waterError, setWaterError] = useState('')
    const [stepsError, setStepsError] = useState('')
    const [sleepError, setSleepError] = useState('')
    const [logs, setLogs] = useState<TDailyLog[]>([]);

    const handleSave = async () => {
        setWaterError('');
        setStepsError('');
        setSleepError('');
        
        if (!waterIntake.trim()) {
            setWaterError('Water intake is required');
        } else if (steps === '') {
            setStepsError('Steps are required');
        } else if (sleepHours === '') {
            setSleepError('Sleep hours are required');
        } else {
            try {
                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);
                
                const formattedDate = moment(currentDate).format('YYYY-MM-DD')
                
                const newLog: TDailyLog = {
                    waterIntake,
                    steps,
                    sleepHours,
                    date: formattedDate,
                };
            
                const storedLogs = await AsyncStorage.getItem('dailyLogs');
                const logsArr: TDailyLog[] = storedLogs ? JSON.parse(storedLogs) : [];
         
            
                const todayIndex = logsArr.findIndex((log: TDailyLog) => {
                    return log.date === newLog.date
                });
            
                if (todayIndex !== -1) {
                    logsArr[todayIndex] = newLog;
                } else {
                    logsArr.push(newLog);
                }
            
                await AsyncStorage.setItem('dailyLogs', JSON.stringify(logsArr));
                console.log('today log --->>>', JSON.stringify(logsArr));
    
                setWaterIntake('');
                setSteps('');
                setSleepHours('');
                setLogs(logsArr);
            
                navigation.navigate("TabNavigator");
            } catch (error: any) {
                Alert.alert('Error in saving logs', error.message);
            }
        }
    };
    
    
    return (
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center',}}>
            <View style={styles.container}>
                        <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={assests.leftarrow} style={{height:23, width:23}}/>
                        </TouchableOpacity>
                            <Text style={styles.headerText}>Enter your Daily Logs</Text>
                        </View>
                        <Text style={styles.inpHeader}>*Water Intake</Text>
                <TextInput
                    style={styles.healthInp}
                    placeholder='Enter Your Water Intake'
                    keyboardType='numeric'
                    value={waterIntake}
                    onChangeText={(text) => setWaterIntake(text)}
                ></TextInput>
                <Text style={styles.healthErr}>{waterError}</Text>
                <Text style={styles.inpHeader}>*Steps</Text>
                <TextInput
                    style={styles.healthInp}
                    placeholder='Enter Your Steps'
                    keyboardType='numeric'
                    value={steps}
                    onChangeText={(text) => setSteps(text)}
                ></TextInput>
                <Text style={styles.healthErr}>{stepsError}</Text>
                <Text style={styles.inpHeader}>*Sleep Hours</Text>
                <TextInput
                    style={styles.healthInp}
                    placeholder='Enter Your Sleep Hours'
                    keyboardType='numeric'
                    value={sleepHours}
                    onChangeText={(text) => setSleepHours(text)}
                ></TextInput>
                <Text style={styles.healthErr}>{sleepError}</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Text style={styles.addBtn}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default AddDailyLogs

const styles = StyleSheet.create({
    container: {
        width: '100%'
    },
    header: {
        flexDirection:'row',
        padding: 10,
        backgroundColor: COLORS.gray200,
        marginBottom:10,
        // justifyContent:'center'
    },
    headerText: {
        color: COLORS.black,
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal:80
    },
    inpHeader:{
        color: COLORS.black,
        fontWeight: '500',
        fontSize: 13,
        marginHorizontal:40,
    },
    healthInp: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        width: '80%',
        alignSelf: 'center',
        paddingHorizontal: 10,
        height: 40,
        overflow: 'hidden'

    },
    addBtn: {
        backgroundColor: "#6e79e0",
        borderRadius: 20,
        width: '50%',
        alignSelf: 'center',
        marginVertical: 10,
        textAlign: 'center',
        padding: 10,
        fontWeight: '600',
        fontSize: 16,
        color:'white'

    },
    healthErr: {
        textAlign: 'center',
        marginVertical:2,
        color: 'red',
        fontWeight: '500',
        fontSize: 13
    }
})