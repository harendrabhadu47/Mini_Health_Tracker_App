import { Alert, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BarChart } from 'react-native-chart-kit'
import { COLORS } from '../assests/colors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SelectList } from 'react-native-dropdown-select-list'


const { width } = Dimensions.get('window')
const days = ["Sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
interface TDailyLog {
    date: string;
    steps: string;
    yearStart: string;
    waterIntake:string;
    sleepHours:string;
}

interface WeekRange {
    start: Date;
    end: Date;
}

interface WeekData {
    value: number;
    key: string;
}

interface TDailyLogData extends Partial<TDailyLog> {
    date: string;
}

// Extend Date prototype to include getWeek method
declare global {
    interface Date {
        getWeek(): number;
    }
}

Date.prototype.getWeek = function (): number {
    const date = new Date(this);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 4 - (date.getDay() || 7));
    const yearStart = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((((+date - +yearStart) / 86400000) + 1) / 7);
};

function getMonday(date: Date): Date {
    const day = date.getDay() || 7;
    const monday = new Date(date);
    monday.setDate(date.getDate() - day + 1);
    return monday;
}

function getWeekRange(date: string | Date): WeekRange {
    const monday = getMonday(new Date(date));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { start: monday, end: sunday };
}

function formatDateRange(start: Date, end: Date): string {
    const formatDate = (date: Date) =>
        date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
    return `${formatDate(start)} - ${formatDate(end)}`;
}

function groupDataByWeeks(data: TDailyLogData[]): WeekData[] {
    const weeksMap = new Map<string, WeekData>();

    data.forEach(({ date }) => {
        const { start, end } = getWeekRange(date);
        const weekKey = start.toISOString().split("T")[0];

        if (!weeksMap.has(weekKey)) {
            const weekNumber = start.getWeek();
            weeksMap.set(weekKey, {
                value: weekNumber,
                key: `Week ${weekNumber}: ${formatDateRange(start, end)}`,
            });
        }
    });

    return Array.from(weeksMap.values());
}

function getMondayFromWeek(year: number, weekNumber: number): Date {
    const jan1 = new Date(year, 0, 1);
    const dayOffset = 1 - (jan1.getDay() || 7);
    const firstMonday = new Date(jan1.setDate(jan1.getDate() + dayOffset));
    return new Date(firstMonday.setDate(firstMonday.getDate() + (weekNumber - 1) * 7));
}

function getWeekDates(monday: Date): string[] {
    return Array.from({ length: 7 }, (_, i) => {
        const day = new Date(monday);
        day.setDate(monday.getDate() + i);
        return day.toISOString().split("T")[0];
    });
}

function getWeekDataFromWeekNumber(year: number, weekNumber: number, data: TDailyLogData[]): TDailyLogData[] {
    const weekDates = getWeekDates(getMondayFromWeek(year, weekNumber));
    return weekDates.map(date => data.find(item => item.date === date) || { date });
}

function formatData(data: TDailyLogData[] = [], key: keyof TDailyLog = 'steps'): number[] {
    return data.map(day => Number(day[key]) || 0);
}



const WeeklyOverview = () => {
    const [Logs, setLogs] = useState([])
    const [selected, setSelected] = React.useState("");
    const [weeks, setWeeks] = useState<any>([])
    const [selectedWeekData, setSelectedWeekData] = useState <TDailyLogData[]>([])
    const fetchLogs = async () => {
        try {
            const storedLogs = await AsyncStorage.getItem('dailyLogs');
            const logsArray = storedLogs ? JSON.parse(storedLogs) : [];
            setLogs(logsArray); 
            const weeksArray = groupDataByWeeks(logsArray)
            setWeeks(weeksArray)

        } catch (error) {
            Alert.alert('Error fetching logs');
        }
    };
    useEffect(() => {
        fetchLogs();
    }, []);


    useEffect(() => {
        const weekData = getWeekDataFromWeekNumber(2024, Number(selected), Logs);
        
        setSelectedWeekData(weekData)
    }, [selected])


    const chartConfig = {
        backgroundGradientFrom: "#f1f1f1",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#f1f1f1",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(155, 155, 155, ${opacity})`,
        barPercentage: 0.5,
        decimalPlaces: 0,
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Weekly Overview</Text>
            </View>
            <View style={{ width: '80%', alignSelf: 'center' }}>
                <SelectList
                    setSelected={setSelected}
                    data={weeks}
                    save="value"
                    search={false}
                    placeholder='Select Week'
                />
            </View>
            <ScrollView style={styles.container}
                showsVerticalScrollIndicator={false}>
                <View>
                    <Text style={styles.title}>Water</Text>
                    <BarChart
                        data={{
                            labels: days,
                            datasets: [{ data: formatData(selectedWeekData,'waterIntake') }]
                        }}
                        fromZero
                        width={width - 30}
                        height={200}
                        chartConfig={chartConfig}
                        yAxisSuffix=' L'
                        yAxisLabel=''
                        style={{
                            borderRadius: 18,
                            alignSelf: 'center'
                        }} />
                </View>
                <View>
                    <Text style={styles.title}>Steps</Text>
                    <BarChart
                        data={{
                            labels: days,
                            datasets: [{ data: formatData(selectedWeekData,'steps') }]
                        }}
                        width={width - 30}
                        height={200}
                        chartConfig={chartConfig}
                        yAxisSuffix=' S'
                        yAxisLabel=''
                        style={{
                            borderRadius: 18,
                            alignSelf: 'center'
                        }} />
                </View>
                <View>
                    <Text style={styles.title}>Sleep Hours</Text>
                    <BarChart
                        data={{
                            labels: days,
                            datasets: [{ data: formatData(selectedWeekData,'sleepHours') }]
                        }}
                        width={width - 30}
                        height={200}
                        chartConfig={chartConfig}
                        yAxisSuffix=' H'
                        yAxisLabel=''
                        style={{
                            borderRadius: 18,
                            alignSelf: 'center'
                        }} />
                </View>
            </ScrollView>
        </View>
    )
}

export default WeeklyOverview

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        margin: 10
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
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        margin: 3,
        marginTop: 8,
        color: COLORS.black,

    },
})