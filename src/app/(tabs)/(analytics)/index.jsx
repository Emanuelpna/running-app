import { useEffect, useState } from "react";
import { View, ScrollView, Text, Dimensions, StyleSheet } from "react-native";
import { BarChart, ContributionGraph } from "react-native-chart-kit";

import { MONTHS_DICT } from "../../../domain/months";

import { TrackReports } from "../../../data/reports/TrackReports";
import { TrackRepository } from "../../../data/repositories/TrackRepository";

const PAGE_PADDING = 10;

const trackRepository = new TrackRepository();

export default function AnalyticsHome() {
  const screenWidth = Dimensions.get("window").width - PAGE_PADDING * 2;

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: "#fff",
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(18, 12, 31, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  const [tracksByMonth, setTracksByMonth] = useState([]);

  useEffect(() => {
    async function get() {
      const trackReports = new TrackReports(trackRepository);
      const tracks = await trackReports.getCountOfTracksByMonth();

      const dataset = Object.keys(MONTHS_DICT);

      setTracksByMonth(
        dataset.map((month) =>
          tracks[month.toString()]?.length
            ? tracks[month.toString()]?.length
            : null
        )
      );
    }

    get();
  }, []);

  const tracksByMonthData = {
    labels: Object.values(MONTHS_DICT),
    datasets: [
      {
        data: tracksByMonth,
      },
    ],
  };

  const [tracksByDayHeatmap, setTracksByDayHeatmap] = useState([]);

  useEffect(() => {
    async function get() {
      const trackReports = new TrackReports(trackRepository);
      const tracks = await trackReports.getDaysRunned();

      setTracksByDayHeatmap(tracks);
    }

    get();
  }, []);

  const [averagePace, setAveragePace] = useState(0);

  useEffect(() => {
    async function get() {
      const trackReports = new TrackReports(trackRepository);
      const pace = await trackReports.getAveragePace();

      setAveragePace(pace);
    }

    get();
  }, []);

  return (
    <ScrollView style={styles.layout}>
      <Text>Pace Médio: {averagePace}</Text>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Corridas por mês</Text>
        <BarChart
          data={tracksByMonthData}
          height={220}
          width={screenWidth}
          yAxisSuffix=""
          showValuesOnTopOfBars
          withHorizontalLabels={false}
          chartConfig={chartConfig}
          verticalLabelRotation={30}
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Frequência nos últimos 3 meses</Text>

        <ContributionGraph
          values={tracksByDayHeatmap}
          endDate={new Date("2025-07-01")}
          numDays={90}
          height={220}
          width={screenWidth}
          chartConfig={chartConfig}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layout: {
    padding: PAGE_PADDING,
  },
  chartTitle: {
    marginLeft: 14,
    marginTop: 16,
    marginBottom: 12,
  },
  chartContainer: {
    marginVertical: 12,
    backgroundColor: "white",
    borderRadius: 32,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
