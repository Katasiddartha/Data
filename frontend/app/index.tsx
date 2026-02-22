import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LineChart, BarChart, PieChart } from 'react-native-gifted-charts';
import DateTimePicker from '@react-native-community/datetimepicker';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface TestData {
  date: string;
  tester: string;
  module: string;
  test_cases: number;
  passed: number;
  failed: number;
  build: string;
}

interface Summary {
  total_tests: number;
  total_passed: number;
  total_failed: number;
  pass_rate: number;
  total_testers: number;
  total_modules: number;
  total_builds: number;
}

interface FilterOptions {
  testers: string[];
  modules: string[];
  builds: string[];
}

export default function Index() {
  const [testData, setTestData] = useState<TestData[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    testers: [],
    modules: [],
    builds: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'table' | 'chart'>('dashboard');

  // Filter states
  const [selectedTester, setSelectedTester] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedBuild, setSelectedBuild] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [showDateFromPicker, setShowDateFromPicker] = useState(false);
  const [showDateToPicker, setShowDateToPicker] = useState(false);

  const fetchData = async () => {
    try {
      // Build query params
      const params = new URLSearchParams();
      if (selectedTester) params.append('tester', selectedTester);
      if (selectedModule) params.append('module', selectedModule);
      if (selectedBuild) params.append('build', selectedBuild);
      if (dateFrom) params.append('date_from', dateFrom.toISOString().split('T')[0]);
      if (dateTo) params.append('date_to', dateTo.toISOString().split('T')[0]);

      const queryString = params.toString();
      const suffix = queryString ? `?${queryString}` : '';

      const [dataRes, summaryRes, filtersRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/test-data${suffix}`),
        fetch(`${BACKEND_URL}/api/test-data/summary${suffix}`),
        fetch(`${BACKEND_URL}/api/test-data/filters`),
      ]);

      const data = await dataRes.json();
      const summaryData = await summaryRes.json();
      const filtersData = await filtersRes.json();

      setTestData(data);
      setSummary(summaryData);
      setFilterOptions(filtersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(interval);
  }, [selectedTester, selectedModule, selectedBuild, dateFrom, dateTo]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const clearFilters = () => {
    setSelectedTester(null);
    setSelectedModule(null);
    setSelectedBuild(null);
    setDateFrom(null);
    setDateTo(null);
  };

  const getChartData = () => {
    // Group data by date
    const dateMap = new Map<string, { passed: number; failed: number }>();
    testData.forEach((item) => {
      const existing = dateMap.get(item.date) || { passed: 0, failed: 0 };
      dateMap.set(item.date, {
        passed: existing.passed + item.passed,
        failed: existing.failed + item.failed,
      });
    });

    const sortedDates = Array.from(dateMap.keys()).sort();
    return sortedDates.map((date) => {
      const data = dateMap.get(date)!;
      return {
        value: data.passed + data.failed,
        label: date.substring(5), // MM-DD
        dataPointText: `${data.passed + data.failed}`,
      };
    });
  };

  const getTesterBarData = () => {
    const testerMap = new Map<string, { passed: number; failed: number; total: number }>();
    testData.forEach((item) => {
      const existing = testerMap.get(item.tester) || { passed: 0, failed: 0, total: 0 };
      testerMap.set(item.tester, {
        passed: existing.passed + item.passed,
        failed: existing.failed + item.failed,
        total: existing.total + item.test_cases,
      });
    });

    const testers = Array.from(testerMap.keys());
    const barData: any[] = [];
    
    testers.forEach((tester, index) => {
      const data = testerMap.get(tester)!;
      barData.push({
        value: data.total,
        label: tester.split(' ')[0], // First name only
        frontColor: '#007AFF',
        spacing: 2,
        labelWidth: 60,
        labelTextStyle: { fontSize: 10 },
      });
      barData.push({
        value: data.passed,
        frontColor: '#34C759',
      });
      barData.push({
        value: data.failed,
        frontColor: '#FF3B30',
      });
    });

    return barData;
  };

  const getModuleBarData = () => {
    const moduleMap = new Map<string, { passed: number; failed: number; total: number }>();
    testData.forEach((item) => {
      const existing = moduleMap.get(item.module) || { passed: 0, failed: 0, total: 0 };
      moduleMap.set(item.module, {
        passed: existing.passed + item.passed,
        failed: existing.failed + item.failed,
        total: existing.total + item.test_cases,
      });
    });

    // Get top 6 modules by total tests
    const sortedModules = Array.from(moduleMap.entries())
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 6);

    const barData: any[] = [];
    
    sortedModules.forEach(([module, data]) => {
      barData.push({
        value: data.total,
        label: module.length > 8 ? module.substring(0, 8) + '...' : module,
        frontColor: '#007AFF',
        spacing: 2,
        labelWidth: 70,
        labelTextStyle: { fontSize: 9 },
      });
      barData.push({
        value: data.passed,
        frontColor: '#34C759',
      });
      barData.push({
        value: data.failed,
        frontColor: '#FF3B30',
      });
    });

    return barData;
  };

  const getPieChartData = () => {
    const totalPassed = testData.reduce((sum, item) => sum + item.passed, 0);
    const totalFailed = testData.reduce((sum, item) => sum + item.failed, 0);

    return [
      {
        value: totalPassed,
        color: '#34C759',
        text: `${totalPassed}`,
      },
      {
        value: totalFailed,
        color: '#FF3B30',
        text: `${totalFailed}`,
      },
    ];
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading test data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Test Dashboard</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="filter" size={24} color="#fff" />
          {(selectedTester || selectedModule || selectedBuild || dateFrom || dateTo) && (
            <View style={styles.filterBadge} />
          )}
        </TouchableOpacity>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeView === 'dashboard' && styles.activeTab]}
          onPress={() => setActiveView('dashboard')}
        >
          <Ionicons
            name="grid"
            size={20}
            color={activeView === 'dashboard' ? '#007AFF' : '#666'}
          />
          <Text style={[styles.tabText, activeView === 'dashboard' && styles.activeTabText]}>
            Dashboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeView === 'table' && styles.activeTab]}
          onPress={() => setActiveView('table')}
        >
          <Ionicons
            name="list"
            size={20}
            color={activeView === 'table' ? '#007AFF' : '#666'}
          />
          <Text style={[styles.tabText, activeView === 'table' && styles.activeTabText]}>
            Table
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeView === 'chart' && styles.activeTab]}
          onPress={() => setActiveView('chart')}
        >
          <Ionicons
            name="bar-chart"
            size={20}
            color={activeView === 'chart' ? '#007AFF' : '#666'}
          />
          <Text style={[styles.tabText, activeView === 'chart' && styles.activeTabText]}>
            Chart
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {activeView === 'dashboard' && summary && (
          <View style={styles.dashboardContainer}>
            {/* Summary Cards */}
            <View style={styles.summaryRow}>
              <View style={[styles.summaryCard, { backgroundColor: '#007AFF' }]}>
                <Ionicons name="document-text" size={32} color="#fff" />
                <Text style={styles.summaryValue}>{summary.total_tests}</Text>
                <Text style={styles.summaryLabel}>Total Tests</Text>
              </View>
              <View style={[styles.summaryCard, { backgroundColor: '#34C759' }]}>
                <Ionicons name="checkmark-circle" size={32} color="#fff" />
                <Text style={styles.summaryValue}>{summary.total_passed}</Text>
                <Text style={styles.summaryLabel}>Passed</Text>
              </View>
            </View>

            <View style={styles.summaryRow}>
              <View style={[styles.summaryCard, { backgroundColor: '#FF3B30' }]}>
                <Ionicons name="close-circle" size={32} color="#fff" />
                <Text style={styles.summaryValue}>{summary.total_failed}</Text>
                <Text style={styles.summaryLabel}>Failed</Text>
              </View>
              <View style={[styles.summaryCard, { backgroundColor: '#FF9500' }]}>
                <Ionicons name="trending-up" size={32} color="#fff" />
                <Text style={styles.summaryValue}>{summary.pass_rate}%</Text>
                <Text style={styles.summaryLabel}>Pass Rate</Text>
              </View>
            </View>

            <View style={styles.summaryRow}>
              <View style={[styles.summaryCard, { backgroundColor: '#5856D6' }]}>
                <Ionicons name="people" size={32} color="#fff" />
                <Text style={styles.summaryValue}>{summary.total_testers}</Text>
                <Text style={styles.summaryLabel}>Testers</Text>
              </View>
              <View style={[styles.summaryCard, { backgroundColor: '#AF52DE' }]}>
                <Ionicons name="cube" size={32} color="#fff" />
                <Text style={styles.summaryValue}>{summary.total_modules}</Text>
                <Text style={styles.summaryLabel}>Modules</Text>
              </View>
            </View>

            <View style={styles.fullWidthCard}>
              <View style={[styles.summaryCard, { backgroundColor: '#00C7BE', flex: 1 }]}>
                <Ionicons name="git-branch" size={32} color="#fff" />
                <Text style={styles.summaryValue}>{summary.total_builds}</Text>
                <Text style={styles.summaryLabel}>Builds</Text>
              </View>
            </View>

            {/* Recent Tests */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Tests</Text>
              {testData.slice(0, 5).map((item, index) => (
                <View key={index} style={styles.testCard}>
                  <View style={styles.testCardHeader}>
                    <Text style={styles.testModule}>{item.module}</Text>
                    <Text style={styles.testBuild}>{item.build}</Text>
                  </View>
                  <View style={styles.testCardBody}>
                    <Text style={styles.testTester}>
                      <Ionicons name="person" size={14} color="#666" /> {item.tester}
                    </Text>
                    <Text style={styles.testDate}>
                      <Ionicons name="calendar" size={14} color="#666" /> {item.date}
                    </Text>
                  </View>
                  <View style={styles.testCardFooter}>
                    <View style={styles.testStat}>
                      <Text style={styles.testStatLabel}>Total:</Text>
                      <Text style={styles.testStatValue}>{item.test_cases}</Text>
                    </View>
                    <View style={styles.testStat}>
                      <Text style={[styles.testStatLabel, { color: '#34C759' }]}>Passed:</Text>
                      <Text style={[styles.testStatValue, { color: '#34C759' }]}>
                        {item.passed}
                      </Text>
                    </View>
                    <View style={styles.testStat}>
                      <Text style={[styles.testStatLabel, { color: '#FF3B30' }]}>Failed:</Text>
                      <Text style={[styles.testStatValue, { color: '#FF3B30' }]}>
                        {item.failed}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeView === 'table' && (
          <View style={styles.tableContainer}>
            <Text style={styles.sectionTitle}>Test Results ({testData.length} records)</Text>
            {testData.map((item, index) => (
              <View key={index} style={styles.tableCard}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableLabel}>Date:</Text>
                  <Text style={styles.tableValue}>{item.date}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableLabel}>Tester:</Text>
                  <Text style={styles.tableValue}>{item.tester}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableLabel}>Module:</Text>
                  <Text style={styles.tableValue}>{item.module}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableLabel}>Build:</Text>
                  <Text style={styles.tableValue}>{item.build}</Text>
                </View>
                <View style={styles.tableDivider} />
                <View style={styles.tableStatsRow}>
                  <View style={styles.tableStat}>
                    <Text style={styles.tableStatLabel}>Tests</Text>
                    <Text style={styles.tableStatValue}>{item.test_cases}</Text>
                  </View>
                  <View style={styles.tableStat}>
                    <Text style={[styles.tableStatLabel, { color: '#34C759' }]}>Passed</Text>
                    <Text style={[styles.tableStatValue, { color: '#34C759' }]}>
                      {item.passed}
                    </Text>
                  </View>
                  <View style={styles.tableStat}>
                    <Text style={[styles.tableStatLabel, { color: '#FF3B30' }]}>Failed</Text>
                    <Text style={[styles.tableStatValue, { color: '#FF3B30' }]}>
                      {item.failed}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeView === 'chart' && (
          <View style={styles.chartContainer}>
            {/* Pie Chart - Pass/Fail Distribution */}
            <Text style={styles.sectionTitle}>Pass/Fail Distribution</Text>
            <View style={styles.chartWrapper}>
              {getPieChartData().length > 0 && getPieChartData()[0].value + getPieChartData()[1].value > 0 ? (
                <View style={styles.pieChartContainer}>
                  <PieChart
                    data={getPieChartData()}
                    donut
                    radius={90}
                    innerRadius={50}
                    centerLabelComponent={() => (
                      <View style={styles.pieCenter}>
                        <Text style={styles.pieCenterValue}>
                          {summary?.pass_rate || 0}%
                        </Text>
                        <Text style={styles.pieCenterLabel}>Pass Rate</Text>
                      </View>
                    )}
                  />
                  <View style={styles.pieLegend}>
                    <View style={styles.pieLegendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#34C759' }]} />
                      <Text style={styles.legendText}>
                        Passed: {getPieChartData()[0].value}
                      </Text>
                    </View>
                    <View style={styles.pieLegendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#FF3B30' }]} />
                      <Text style={styles.legendText}>
                        Failed: {getPieChartData()[1].value}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : (
                <Text style={styles.noDataText}>No data available for pie chart</Text>
              )}
            </View>

            {/* Bar Chart - By Tester */}
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
              Test Results by Tester
            </Text>
            <View style={styles.chartWrapper}>
              {getTesterBarData().length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.barChartContainer}>
                    <BarChart
                      data={getTesterBarData()}
                      height={220}
                      barWidth={22}
                      spacing={16}
                      noOfSections={4}
                      yAxisThickness={1}
                      xAxisThickness={1}
                      xAxisColor={'#ddd'}
                      yAxisColor={'#ddd'}
                      yAxisTextStyle={{ color: '#666', fontSize: 10 }}
                      isAnimated
                    />
                    <View style={styles.barLegend}>
                      <View style={styles.barLegendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#007AFF' }]} />
                        <Text style={styles.legendText}>Total</Text>
                      </View>
                      <View style={styles.barLegendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#34C759' }]} />
                        <Text style={styles.legendText}>Passed</Text>
                      </View>
                      <View style={styles.barLegendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#FF3B30' }]} />
                        <Text style={styles.legendText}>Failed</Text>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              ) : (
                <Text style={styles.noDataText}>No data available for tester chart</Text>
              )}
            </View>

            {/* Bar Chart - By Module */}
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
              Test Results by Module (Top 6)
            </Text>
            <View style={styles.chartWrapper}>
              {getModuleBarData().length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.barChartContainer}>
                    <BarChart
                      data={getModuleBarData()}
                      height={220}
                      barWidth={22}
                      spacing={16}
                      noOfSections={4}
                      yAxisThickness={1}
                      xAxisThickness={1}
                      xAxisColor={'#ddd'}
                      yAxisColor={'#ddd'}
                      yAxisTextStyle={{ color: '#666', fontSize: 10 }}
                      isAnimated
                    />
                    <View style={styles.barLegend}>
                      <View style={styles.barLegendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#007AFF' }]} />
                        <Text style={styles.legendText}>Total</Text>
                      </View>
                      <View style={styles.barLegendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#34C759' }]} />
                        <Text style={styles.legendText}>Passed</Text>
                      </View>
                      <View style={styles.barLegendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#FF3B30' }]} />
                        <Text style={styles.legendText}>Failed</Text>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              ) : (
                <Text style={styles.noDataText}>No data available for module chart</Text>
              )}
            </View>

            {/* Line Chart - Trend Over Time */}
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Test Cases Trend Over Time</Text>
            <View style={styles.chartWrapper}>
              {getChartData().length > 0 ? (
                <LineChart
                  data={getChartData()}
                  height={250}
                  width={320}
                  spacing={40}
                  initialSpacing={10}
                  color="#007AFF"
                  thickness={3}
                  startFillColor="rgba(0, 122, 255, 0.3)"
                  endFillColor="rgba(0, 122, 255, 0.01)"
                  startOpacity={0.9}
                  endOpacity={0.2}
                  backgroundColor="#fff"
                  yAxisColor="#ddd"
                  xAxisColor="#ddd"
                  dataPointsColor="#007AFF"
                  dataPointsRadius={4}
                  textColor="#333"
                  textFontSize={12}
                  curved
                  areaChart
                />
              ) : (
                <Text style={styles.noDataText}>No data available for line chart</Text>
              )}
            </View>

            {/* Legend for Line Chart */}
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#007AFF' }]} />
                <Text style={styles.legendText}>Total Test Cases</Text>
              </View>
            </View>

            {/* Module Breakdown */}
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Module Breakdown</Text>
            {Array.from(new Set(testData.map((d) => d.module))).map((module, index) => {
              const moduleData = testData.filter((d) => d.module === module);
              const totalPassed = moduleData.reduce((sum, d) => sum + d.passed, 0);
              const totalFailed = moduleData.reduce((sum, d) => sum + d.failed, 0);
              const total = totalPassed + totalFailed;
              const passRate = total > 0 ? ((totalPassed / total) * 100).toFixed(1) : 0;

              return (
                <View key={index} style={styles.moduleCard}>
                  <Text style={styles.moduleName}>{module}</Text>
                  <View style={styles.moduleStats}>
                    <Text style={styles.moduleStatText}>Total: {total}</Text>
                    <Text style={[styles.moduleStatText, { color: '#34C759' }]}>✓ {totalPassed}</Text>
                    <Text style={[styles.moduleStatText, { color: '#FF3B30' }]}>✗ {totalFailed}</Text>
                    <Text style={styles.modulePassRate}>{passRate}%</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${passRate}%`, backgroundColor: '#34C759' },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Date Range */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Date Range</Text>
                <View style={styles.dateRow}>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowDateFromPicker(true)}
                  >
                    <Text style={styles.dateButtonText}>
                      {dateFrom ? dateFrom.toISOString().split('T')[0] : 'From Date'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowDateToPicker(true)}
                  >
                    <Text style={styles.dateButtonText}>
                      {dateTo ? dateTo.toISOString().split('T')[0] : 'To Date'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Tester Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Tester</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <TouchableOpacity
                    style={[
                      styles.filterChip,
                      !selectedTester && styles.filterChipActive,
                    ]}
                    onPress={() => setSelectedTester(null)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        !selectedTester && styles.filterChipTextActive,
                      ]}
                    >
                      All
                    </Text>
                  </TouchableOpacity>
                  {filterOptions.testers.map((tester, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.filterChip,
                        selectedTester === tester && styles.filterChipActive,
                      ]}
                      onPress={() => setSelectedTester(tester)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          selectedTester === tester && styles.filterChipTextActive,
                        ]}
                      >
                        {tester}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Module Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Module</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <TouchableOpacity
                    style={[
                      styles.filterChip,
                      !selectedModule && styles.filterChipActive,
                    ]}
                    onPress={() => setSelectedModule(null)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        !selectedModule && styles.filterChipTextActive,
                      ]}
                    >
                      All
                    </Text>
                  </TouchableOpacity>
                  {filterOptions.modules.map((module, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.filterChip,
                        selectedModule === module && styles.filterChipActive,
                      ]}
                      onPress={() => setSelectedModule(module)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          selectedModule === module && styles.filterChipTextActive,
                        ]}
                      >
                        {module}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Build Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Build</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <TouchableOpacity
                    style={[
                      styles.filterChip,
                      !selectedBuild && styles.filterChipActive,
                    ]}
                    onPress={() => setSelectedBuild(null)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        !selectedBuild && styles.filterChipTextActive,
                      ]}
                    >
                      All
                    </Text>
                  </TouchableOpacity>
                  {filterOptions.builds.map((build, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.filterChip,
                        selectedBuild === build && styles.filterChipActive,
                      ]}
                      onPress={() => setSelectedBuild(build)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          selectedBuild === build && styles.filterChipTextActive,
                        ]}
                      >
                        {build}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Pickers */}
      {showDateFromPicker && (
        <DateTimePicker
          value={dateFrom || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDateFromPicker(false);
            if (selectedDate) setDateFrom(selectedDate);
          }}
        />
      )}
      {showDateToPicker && (
        <DateTimePicker
          value={dateTo || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDateToPicker(false);
            if (selectedDate) setDateTo(selectedDate);
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterButton: {
    padding: 8,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  dashboardContainer: {
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
    opacity: 0.9,
  },
  fullWidthCard: {
    marginBottom: 16,
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  testCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  testCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  testModule: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  testBuild: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  testCardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  testTester: {
    fontSize: 14,
    color: '#666',
  },
  testDate: {
    fontSize: 14,
    color: '#666',
  },
  testCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  testStat: {
    alignItems: 'center',
  },
  testStatLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  testStatValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  tableContainer: {
    padding: 16,
  },
  tableCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  tableLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  tableValue: {
    fontSize: 14,
    color: '#333',
  },
  tableDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  tableStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tableStat: {
    alignItems: 'center',
  },
  tableStatLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  tableStatValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  chartContainer: {
    padding: 16,
  },
  chartWrapper: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 32,
  },
  pieChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 16,
  },
  pieCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieCenterValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  pieCenterLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  pieLegend: {
    gap: 12,
  },
  pieLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barChartContainer: {
    paddingHorizontal: 10,
    paddingVertical: 16,
  },
  barLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
  },
  barLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendContainer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
  moduleCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  moduleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  moduleStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  moduleStatText: {
    fontSize: 14,
    color: '#666',
  },
  modulePassRate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  modalBody: {
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 14,
    color: '#333',
  },
  filterChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#007AFF',
  },
  filterChipText: {
    fontSize: 14,
    color: '#333',
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});