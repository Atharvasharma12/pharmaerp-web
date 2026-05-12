import React from "react";

import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import DonutLargeRoundedIcon from "@mui/icons-material/DonutLargeRounded";
import ShowChartRoundedIcon from "@mui/icons-material/ShowChartRounded";
import PieChartRoundedIcon from "@mui/icons-material/PieChartRounded";
import StackedLineChartRoundedIcon from "@mui/icons-material/StackedLineChartRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";

import {
  AppBox,
  AppStack,
  AppGrid,
  AppText,
  AppHeading,
  AppSection,
  AppCard,
  AppBadge,
  AppKpiCard,
  AppBarChart,
  AppLineChart,
  AppPieChart,
  AppAreaChart,
  AppDonutChart,
  AppSparkline,
} from "@/components";

const monthlyRevenueData = [
  { label: "Jan", revenue: 42000, expense: 26000, profit: 16000 },
  { label: "Feb", revenue: 52000, expense: 31000, profit: 21000 },
  { label: "Mar", revenue: 61000, expense: 37000, profit: 24000 },
  { label: "Apr", revenue: 74000, expense: 42000, profit: 32000 },
  { label: "May", revenue: 69000, expense: 39000, profit: 30000 },
  { label: "Jun", revenue: 86000, expense: 48000, profit: 38000 },
];

const salesAreaData = [
  { label: "Week 1", sales: 18000, purchase: 12000 },
  { label: "Week 2", sales: 24000, purchase: 15000 },
  { label: "Week 3", sales: 21000, purchase: 14000 },
  { label: "Week 4", sales: 32000, purchase: 19000 },
  { label: "Week 5", sales: 38000, purchase: 23000 },
  { label: "Week 6", sales: 41000, purchase: 25000 },
];

const departmentData = [
  { label: "Sales", value: 42, colorVariant: "primary" },
  { label: "HRMS", value: 18, colorVariant: "success" },
  { label: "Inventory", value: 24, colorVariant: "warning" },
  { label: "Finance", value: 16, colorVariant: "info" },
];

const expenseData = [
  { label: "Salary", value: 45, colorVariant: "primary" },
  { label: "Rent", value: 18, colorVariant: "warning" },
  { label: "Software", value: 14, colorVariant: "info" },
  { label: "Marketing", value: 23, colorVariant: "success" },
];

const sparklineRevenue = [
  { label: "Mon", value: 12 },
  { label: "Tue", value: 18 },
  { label: "Wed", value: 16 },
  { label: "Thu", value: 26 },
  { label: "Fri", value: 24 },
  { label: "Sat", value: 32 },
  { label: "Sun", value: 38 },
];

const sparklineOrders = [20, 28, 24, 36, 42, 39, 48, 54];

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString()}`;

const UIComponentDisplayPage = () => {
  return (
    <AppBox
      sx={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg)",
        p: { xs: 2, md: 3 },
      }}
    >
      <AppStack spacing={4}>
        <AppBox>
          <AppHeading level={4} weight={800}>
            Chart Components Showcase
          </AppHeading>

          <AppText
            color="var(--color-text-muted)"
            sx={{
              mt: 0.6,
              maxWidth: 780,
            }}
          >
            All ERP chart components preview: KPI cards, bar chart, line chart,
            area chart, pie chart, donut chart and sparkline.
          </AppText>
        </AppBox>

        <AppSection
          title="KPI Cards"
          description="High-level ERP metrics for dashboards."
        >
          <AppGrid columns={{ xs: 1, sm: 2, lg: 4 }} gap={2}>
            <AppKpiCard
              title="Total Revenue"
              value="₹8.6L"
              subtitle="This month revenue"
              icon={<AttachMoneyRoundedIcon />}
              colorVariant="success"
              trend={{
                value: "+18.4%",
                direction: "up",
                label: "vs last month",
              }}
            />

            <AppKpiCard
              title="Employees"
              value="248"
              subtitle="Active employees"
              icon={<PeopleAltRoundedIcon />}
              colorVariant="primary"
              badge="HRMS"
              trend={{
                value: "+6",
                direction: "up",
                label: "new",
              }}
            />

            <AppKpiCard
              title="Inventory Items"
              value="1,284"
              subtitle="Available stock items"
              icon={<Inventory2RoundedIcon />}
              colorVariant="warning"
              trend={{
                value: "-4.2%",
                direction: "down",
                label: "low stock",
              }}
            />

            <AppKpiCard
              title="Invoices"
              value="368"
              subtitle="Generated invoices"
              icon={<ReceiptLongRoundedIcon />}
              colorVariant="info"
              trend={{
                value: "Stable",
                direction: "neutral",
                label: "this week",
              }}
            />
          </AppGrid>
        </AppSection>

        <AppSection
          title="Sparkline Charts"
          description="Compact mini charts for cards and quick analytics."
        >
          <AppGrid columns={{ xs: 1, md: 2, lg: 3 }} gap={2}>
            <AppSparkline
              title="Weekly Revenue"
              value="₹38K"
              subtitle="Last 7 days"
              data={sparklineRevenue}
              colorVariant="success"
              trend={{
                value: "+12.8%",
                direction: "up",
              }}
              footer="Revenue improved after Friday campaign."
            />

            <AppSparkline
              title="Orders"
              value="54"
              subtitle="Today’s order trend"
              data={sparklineOrders}
              colorVariant="primary"
              variant="line"
              showArea
              trend={{
                value: "+8.2%",
                direction: "up",
              }}
            />

            <AppSparkline
              title="Low Stock Alerts"
              value="14"
              subtitle="Inventory alert trend"
              data={[8, 12, 10, 15, 13, 18, 14]}
              colorVariant="warning"
              variant="bar"
              showArea={false}
              trend={{
                value: "-2",
                direction: "down",
              }}
            />
          </AppGrid>
        </AppSection>

        <AppSection
          title="Bar Charts"
          description="Grouped and stacked comparison charts."
        >
          <AppGrid columns={{ xs: 1, lg: 2 }} gap={2}>
            <AppCard bordered shadow="sm">
              <AppBarChart
                title="Revenue vs Expense"
                subtitle="Monthly business comparison"
                data={monthlyRevenueData}
                xKey="label"
                bars={[
                  {
                    key: "revenue",
                    label: "Revenue",
                    colorVariant: "primary",
                  },
                  {
                    key: "expense",
                    label: "Expense",
                    colorVariant: "warning",
                  },
                ]}
                valueFormatter={formatCurrency}
              />
            </AppCard>

            <AppCard bordered shadow="sm">
              <AppBarChart
                title="Stacked Finance Overview"
                subtitle="Revenue, expense and profit"
                data={monthlyRevenueData}
                xKey="label"
                variant="stacked"
                bars={[
                  {
                    key: "expense",
                    label: "Expense",
                    colorVariant: "warning",
                  },
                  {
                    key: "profit",
                    label: "Profit",
                    colorVariant: "success",
                  },
                ]}
                valueFormatter={formatCurrency}
              />
            </AppCard>
          </AppGrid>
        </AppSection>

        <AppSection
          title="Line & Area Charts"
          description="Trend charts for revenue, sales and purchase reports."
        >
          <AppGrid columns={{ xs: 1, lg: 2 }} gap={2}>
            <AppCard bordered shadow="sm">
              <AppLineChart
                title="Monthly Revenue Trend"
                subtitle="Line chart with multiple series"
                data={monthlyRevenueData}
                xKey="label"
                lines={[
                  {
                    key: "revenue",
                    label: "Revenue",
                    colorVariant: "primary",
                  },
                  {
                    key: "profit",
                    label: "Profit",
                    colorVariant: "success",
                  },
                ]}
                curve="monotone"
                valueFormatter={formatCurrency}
              />
            </AppCard>

            <AppCard bordered shadow="sm">
              <AppAreaChart
                title="Sales & Purchase Area"
                subtitle="Weekly sales and purchase flow"
                data={salesAreaData}
                xKey="label"
                areas={[
                  {
                    key: "sales",
                    label: "Sales",
                    colorVariant: "primary",
                  },
                  {
                    key: "purchase",
                    label: "Purchase",
                    colorVariant: "warning",
                  },
                ]}
                curve="monotone"
                valueFormatter={formatCurrency}
              />
            </AppCard>
          </AppGrid>
        </AppSection>

        <AppSection
          title="Pie & Donut Charts"
          description="Distribution charts for modules, expenses and categories."
        >
          <AppGrid columns={{ xs: 1, lg: 2 }} gap={2}>
            <AppCard bordered shadow="sm">
              <AppPieChart
                title="Department Distribution"
                subtitle="Employees by department"
                data={departmentData}
                variant="pie"
                showLabels
                labelType="percent"
              />
            </AppCard>

            <AppCard bordered shadow="sm">
              <AppDonutChart
                title="Expense Breakdown"
                subtitle="Monthly expense distribution"
                data={expenseData}
                centerLabel="Total"
                centerValue="₹4.8L"
                centerSubtitle="Expenses"
                showLabels={false}
                valueFormatter={(value) => `${value}%`}
              />
            </AppCard>
          </AppGrid>
        </AppSection>

        <AppSection
          title="Chart Variants Overview"
          description="Quick list of all chart components available in your ERP system."
        >
          <AppGrid columns={{ xs: 1, sm: 2, lg: 4 }} gap={2}>
            {[
              {
                icon: <BarChartRoundedIcon />,
                title: "AppBarChart",
                color: "primary",
                text: "Grouped, stacked and horizontal bar charts.",
              },
              {
                icon: <ShowChartRoundedIcon />,
                title: "AppLineChart",
                color: "success",
                text: "Line charts for trends and comparisons.",
              },
              {
                icon: <StackedLineChartRoundedIcon />,
                title: "AppAreaChart",
                color: "info",
                text: "Area charts for filled trend visualization.",
              },
              {
                icon: <PieChartRoundedIcon />,
                title: "AppPieChart",
                color: "warning",
                text: "Pie chart for category distribution.",
              },
              {
                icon: <DonutLargeRoundedIcon />,
                title: "AppDonutChart",
                color: "primary",
                text: "Donut chart with center summary label.",
              },
              {
                icon: <QueryStatsRoundedIcon />,
                title: "AppSparkline",
                color: "success",
                text: "Small mini chart for KPI cards.",
              },
              {
                icon: <TrendingUpRoundedIcon />,
                title: "AppKpiCard",
                color: "info",
                text: "Metric card with trend and badge support.",
              },
            ].map((item) => (
              <AppCard key={item.title} bordered shadow="sm">
                <AppStack spacing={1.25}>
                  <AppBox
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: `var(--color-${item.color}-soft)`,
                      color: `var(--color-${item.color})`,
                      "& svg": {
                        fontSize: 24,
                      },
                    }}
                  >
                    {item.icon}
                  </AppBox>

                  <AppStack direction="row" alignItems="center" gap={1}>
                    <AppHeading level={6} weight={800}>
                      {item.title}
                    </AppHeading>

                    <AppBadge
                      label="Chart"
                      size="small"
                      variant="soft"
                      colorVariant={item.color}
                    />
                  </AppStack>

                  <AppText color="var(--color-text-muted)">{item.text}</AppText>
                </AppStack>
              </AppCard>
            ))}
          </AppGrid>
        </AppSection>
      </AppStack>
    </AppBox>
  );
};

export default UIComponentDisplayPage;
