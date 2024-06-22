import React, { useEffect, useState } from "react";
import { View, Switch, Text } from "react-native";
import { Surface, useTheme } from "react-native-paper";
import { LineChart } from "react-native-gifted-charts";
export default function LinesChart({ data }) {
    const theme = useTheme();
    console.log(theme.colors)
    const [lineData, setLineData] = useState([]);
    const [chartVisible, setChartVisible] = useState(false);

    function formatVeryCompactDateTime(timestamp) {
        var date = new Date(timestamp);
        var minutes = date.getMinutes();
        if (minutes >= 30) {
            date.setHours(date.getHours() + 1);
        }
        date.setMinutes(0, 0, 0);

        var options = {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };

        var compactDateTime = date.toLocaleString('en-US', options);
        compactDateTime = compactDateTime.replace(',', '').replace(' ', '_');

        return compactDateTime;
    }

    useEffect(() => {
        const formattedData = data.map(item => ({
            value: item.uv,
            dataPointText: formatVeryCompactDateTime(item.uv_time)
        }));
        setLineData(formattedData);
        setChartVisible(true); // Show the toggle once data is formatted and ready
    }, [data]);

    return (
        <View style={{ backgroundColor: theme.colors.background, flex: 1, justifyContent: 'center' }}>
            <Surface  style={{ backgroundColor: theme.colors.surface,  marginVertical: 10, alignItems: 'center', padding: 10 }}>
                <Text style={{ color: theme.colors.text }}>Show Chart:</Text>
                <Switch
                    value={chartVisible}
                    onValueChange={setChartVisible}
                    thumbColor={chartVisible ? theme.colors.primary : "#ccc"}
                    trackColor={{ false: "#767577", true: theme.colors.accent }}
                />
            </Surface>
            {chartVisible && (
                <LineChart
                    initialSpacing={0}
                    data={lineData}
                    spacing={50}
                    textColor1={theme.colors.text} // Ensuring readability
                    textShiftY={-25}
                    textShiftX={-15}
                    textFontSize={12}
                    thickness={5}
                    hideRules
                    isAnimated={false}
                    yAxisColor={theme.colors.primary} // Dynamic color based on theme
                    showVerticalLines
                    verticalLinesColor="rgba(14,164,164,0.5)" // Consider adjusting based on theme
                    xAxisColor={theme.colors.primary} // Dynamic color based on theme
                    color={theme.colors.accent} // Dynamic color for the line chart
                />
            )}
        </View>
    );
}
