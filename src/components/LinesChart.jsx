import { LineChart } from "react-native-gifted-charts"
import React, { useEffect, useState } from "react";
import { Platform, View } from "react-native";

export default LinesChart = ({ data }) => {
    console.log(data)
    const [lineData, setLineData] = useState(data);
    function formatVeryCompactDateTime(timestamp) {
        // Create a Date object from the timestamp
        var date = new Date(timestamp);

        // Round the hour to the nearest
        var minutes = date.getMinutes();
        if (minutes >= 30) {
            date.setHours(date.getHours() + 1); // Increment hour if minutes are 30 or more
        }

        // Zero out the minutes and seconds for clean hour display
        date.setMinutes(0, 0, 0);

        // Define options for displaying the day and rounded hour
        var options = {
            month: 'short', // abbreviated month name
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // use 24-hour format
        };

        // Format the date with the specified options
        var compactDateTime = date.toLocaleString('en-US', options);
        compactDateTime = compactDateTime.replace(',', ''); // Remove comma after day
        compactDateTime = compactDateTime.replace(' ', '_'); // Remove extra space after day
        console.log(compactDateTime)

        return compactDateTime;
    }
    useEffect(() => {
        const dat = []
        for (let i = 0; i < data.length; i++) {
            const value = data[i].uv;
            const dataPointText = formatVeryCompactDateTime(data[i].uv_time);
  
            dat.push({ value, dataPointText })
  
          }
        setLineData(dat)
    }

    , [])

    //   const lineData = [
    //       {value: 0, dataPointText: '0'},
    //       {value: 20, dataPointText: '20'},
    //       {value: 18, dataPointText: '18'},
    //       {value: 40, dataPointText: '40'},
    //       {value: 36, dataPointText: '36'},
    //       {value: 60, dataPointText: '60'},
    //       {value: 54, dataPointText: '54'},
    //       {value: 85, dataPointText: '85'}
    //   ];
    return (
        <View style={{ backgroundColor: '#1A3461', flex: 1 }}>
            {console.log(lineData)
            
            }

            { lineData && <LineChart
                
                
                initialSpacing={0}
                data={lineData}
                spacing={50}
                textColor1="yellow"
                textShiftY={-25}
                textShiftX={-15}
                textFontSize={12}
                thickness={5}
                hideRules
                isAnimated={Platform.OS !== 'ios' ? true : false}
                yAxisColor="#0BA5A4"
                showVerticalLines
                verticalLinesColor="rgba(14,164,164,0.5)"
                xAxisColor="#0BA5A4"
                color="#0BA5A4"
            />}
        </View>
    );
};