import { useState } from "react";

import {
  AppButton,
  AppBadge,
  AppCard,
  AppPagination,
  AppAvatar,
  AppAvatarGroup,
  AppStatusBadge,
  AppTag,
  AppInfoCard,
  AppStatCard,
  AppTimeline,
  AppDescriptionList,
  AppKeyValue,
  AppAccordion,
} from "@/components";

const teamMembers = [
  { id: 1, name: "Rahul Sharma", initials: "RS", colorVariant: "primary" },
  { id: 2, name: "Priya Mehta", initials: "PM", colorVariant: "success" },
  { id: 3, name: "Aman Verma", initials: "AV", colorVariant: "warning" },
  { id: 4, name: "Neha Kapoor", initials: "NK", colorVariant: "info" },
  { id: 5, name: "Karan Shah", initials: "KS", colorVariant: "error" },
];

const timelineItems = [
  {
    id: 1,
    title: "Record created",
    description: "A new customer profile was created.",
    time: "09:00 AM",
    colorVariant: "success",
  },
  {
    id: 2,
    title: "Profile updated",
    description: "Contact information and billing details were changed.",
    time: "10:30 AM",
    colorVariant: "info",
  },
  {
    id: 3,
    title: "Approval pending",
    description: "The record is waiting for manager approval.",
    time: "12:15 PM",
    colorVariant: "warning",
  },
  {
    id: 4,
    title: "Sync failed",
    description: "External CRM sync failed and needs retry.",
    time: "02:45 PM",
    colorVariant: "error",
    action: <AppButton size="small">Retry</AppButton>,
  },
];

const descriptionItems = [
  {
    key: "name",
    label: "Customer Name",
    value: "Acme Industries",
    badge: "Verified",
    badgeColor: "success",
  },
  {
    key: "email",
    label: "Email",
    value: "contact@acme.example",
  },
  {
    key: "plan",
    label: "Plan",
    value: "Enterprise",
    badge: "Active",
    badgeColor: "primary",
  },
  {
    key: "location",
    label: "Location",
    value: "Mumbai, India",
  },
  {
    key: "owner",
    label: "Owner",
    value: "Priya Mehta",
  },
  {
    key: "renewal",
    label: "Renewal Date",
    value: "08 May 2026",
    badge: "Upcoming",
    badgeColor: "warning",
  },
];

const accordionItems = [
  {
    id: "details",
    title: "Customer Details",
    subtitle: "Basic profile and account information",
    content: (
      <AppDescriptionList
        columns={2}
        items={descriptionItems.slice(0, 4)}
        variant="card"
        bordered
      />
    ),
  },
  {
    id: "billing",
    title: "Billing Summary",
    subtitle: "Plan, renewal, and payment status",
    content: (
      <div className="grid gap-4 md:grid-cols-3">
        <AppStatCard
          title="MRR"
          value="₹1.2L"
          subtitle="Monthly recurring revenue"
          trend="up"
          trendValue="+12%"
          colorVariant="success"
          variant="soft"
        />
        <AppStatCard
          title="Invoices"
          value="24"
          subtitle="Generated this year"
          trend="neutral"
          trendValue="Stable"
          colorVariant="info"
          variant="soft"
        />
        <AppStatCard
          title="Due"
          value="₹18K"
          subtitle="Pending payment"
          trend="down"
          trendValue="-4%"
          colorVariant="warning"
          variant="soft"
        />
      </div>
    ),
  },
  {
    id: "activity",
    title: "Recent Activity",
    subtitle: "Latest customer timeline",
    content: <AppTimeline items={timelineItems.slice(0, 3)} dense />,
  },
];

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [removedTags, setRemovedTags] = useState([]);

  const handleRemoveTag = (tag) => {
    setRemovedTags((prev) => [...prev, tag]);
  };

  const visibleTags = ["Frontend", "Backend", "Urgent", "Customer"].filter(
    (tag) => !removedTags.includes(tag),
  );

  return (
    <main className="min-h-screen bg-bg text-text">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <p className="text-sm font-semibold text-primary">Component Demo</p>

          <div className="mt-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Data Display Showcase
            </h1>
            <p className="mt-2 max-w-3xl text-text-muted">
              Demo page for all reusable data display components including
              badges, cards, avatars, status badges, tags, statistics,
              timelines, description lists, key-value rows, pagination, and
              accordions.
            </p>
          </div>
        </header>

        <DemoSection title="Badges, Status Badges, and Tags">
          <DemoCard title="AppBadge Variants">
            <div className="flex flex-wrap gap-3">
              <AppBadge label="Soft" variant="soft" colorVariant="primary" />
              <AppBadge
                label="Contained"
                variant="contained"
                colorVariant="success"
              />
              <AppBadge
                label="Outlined"
                variant="outlined"
                colorVariant="warning"
              />
              <AppBadge label="Text" variant="text" colorVariant="info" />
              <AppBadge label="Dot Badge" dot colorVariant="error" />
            </div>
          </DemoCard>

          <DemoCard title="AppStatusBadge States">
            <div className="flex flex-wrap gap-3">
              <AppStatusBadge status="active" />
              <AppStatusBadge status="inactive" />
              <AppStatusBadge status="pending" />
              <AppStatusBadge status="approved" />
              <AppStatusBadge status="rejected" />
              <AppStatusBadge status="draft" />
              <AppStatusBadge status="blocked" />
              <AppStatusBadge status="completed" />
              <AppStatusBadge status="failed" />
              <AppStatusBadge status="processing" />
            </div>
          </DemoCard>

          <DemoCard title="AppTag Removable and Clickable">
            <div className="flex flex-wrap gap-3">
              {visibleTags.map((tag) => (
                <AppTag
                  key={tag}
                  label={tag}
                  removable
                  onDelete={() => handleRemoveTag(tag)}
                  clickable
                  onClick={() => {}}
                  colorVariant="primary"
                  variant="soft"
                />
              ))}

              {visibleTags.length === 0 && (
                <AppButton
                  size="small"
                  variant="outlined"
                  onClick={() => setRemovedTags([])}
                >
                  Reset Tags
                </AppButton>
              )}
            </div>
          </DemoCard>
        </DemoSection>

        <DemoSection title="Cards and Information Blocks">
          <AppCard
            title="AppCard Default"
            subtitle="Reusable content container"
            action={<AppButton size="small">Action</AppButton>}
            footer={
              <span className="text-sm text-text-muted">Card footer</span>
            }
            padding="md"
            rounded="lg"
            bordered
          >
            <p className="text-sm text-text-muted">
              Use AppCard for grouped data, dashboard sections, forms, and list
              content.
            </p>
          </AppCard>

          <AppCard
            title="Hoverable Card"
            subtitle="Outlined, hoverable, and clickable"
            variant="outlined"
            padding="md"
            rounded="xl"
            shadow="sm"
            hoverable
            clickable
            onClick={() => {}}
          >
            <p className="text-sm text-text-muted">
              Cards can be interactive with hover and click behavior.
            </p>
          </AppCard>

          <AppInfoCard
            title="AppInfoCard"
            description="Use this component for contextual guidance, notes, help panels, or important information."
            badge="Info"
            badgeColor="info"
            colorVariant="info"
            variant="soft"
            action={<AppButton size="small">Learn More</AppButton>}
          />

          <AppInfoCard
            title="Warning Info Card"
            description="This setting affects all users in the workspace."
            badge="Warning"
            badgeColor="warning"
            colorVariant="warning"
            variant="outlined"
          />
        </DemoSection>

        <DemoSection title="Avatars and Avatar Groups">
          <DemoCard title="AppAvatar Sizes and Status">
            <div className="flex flex-wrap items-center gap-4">
              <AppAvatar
                name="Rahul Sharma"
                size="xs"
                showStatus
                status="online"
              />
              <AppAvatar
                name="Priya Mehta"
                size="small"
                showStatus
                status="away"
                colorVariant="success"
              />
              <AppAvatar
                name="Aman Verma"
                size="medium"
                showStatus
                status="busy"
                colorVariant="warning"
              />
              <AppAvatar
                name="Neha Kapoor"
                size="large"
                showStatus
                status="offline"
                colorVariant="info"
              />
              <AppAvatar
                name="Karan Shah"
                size="xl"
                variant="rounded"
                bordered
                colorVariant="error"
              />
            </div>
          </DemoCard>

          <DemoCard title="AppAvatarGroup">
            <div className="space-y-4">
              <AppAvatarGroup
                items={teamMembers}
                max={4}
                size="small"
                showTooltip
                bordered
              />

              <AppAvatarGroup
                items={teamMembers}
                max={3}
                size="medium"
                showTooltip
                bordered
              />

              <AppAvatarGroup
                items={teamMembers}
                max={5}
                size="large"
                showTooltip
              />
            </div>
          </DemoCard>
        </DemoSection>

        <DemoSection title="Stats and Key-Value Display">
          <AppStatCard
            title="Revenue"
            value="₹24.5L"
            subtitle="This month"
            trend="up"
            trendValue="+18%"
            colorVariant="success"
            variant="soft"
          />

          <AppStatCard
            title="Open Tickets"
            value="42"
            subtitle="Requires attention"
            trend="down"
            trendValue="-6%"
            colorVariant="warning"
            variant="outlined"
          />

          <AppStatCard
            title="Active Users"
            value="12,430"
            subtitle="Across all teams"
            trend="neutral"
            trendValue="Stable"
            colorVariant="info"
            variant="default"
          />

          <DemoCard title="AppKeyValue Rows">
            <div className="space-y-4">
              <AppKeyValue
                label="Invoice No"
                value="INV-1024"
                badge="Paid"
                badgeColor="success"
              />
              <AppKeyValue
                label="Customer"
                value="Acme Industries"
                direction="column"
                size="medium"
              />
              <AppKeyValue
                label="Priority"
                value="High"
                badge="Urgent"
                badgeColor="error"
                align="space-between"
              />
            </div>
          </DemoCard>
        </DemoSection>

        <DemoSection title="Description Lists">
          <div className="md:col-span-2 xl:col-span-3">
            <DemoCard title="AppDescriptionList Card Variant">
              <AppDescriptionList
                columns={3}
                items={descriptionItems}
                variant="card"
                bordered
                striped
              />
            </DemoCard>
          </div>

          <div className="md:col-span-2 xl:col-span-3">
            <DemoCard title="AppDescriptionList Default Variant">
              <AppDescriptionList
                columns={2}
                items={descriptionItems}
                variant="default"
                size="medium"
                align="space-between"
              />
            </DemoCard>
          </div>
        </DemoSection>

        <DemoSection title="Timeline">
          <div className="md:col-span-2 xl:col-span-3">
            <DemoCard title="AppTimeline Default">
              <AppTimeline
                items={timelineItems}
                variant="soft"
                colorVariant="primary"
                showConnector
              />
            </DemoCard>
          </div>

          <DemoCard title="Dense Timeline">
            <AppTimeline items={timelineItems.slice(0, 3)} dense size="small" />
          </DemoCard>

          <DemoCard title="Outlined Timeline">
            <AppTimeline
              items={timelineItems.slice(0, 3)}
              variant="outlined"
              colorVariant="info"
            />
          </DemoCard>
        </DemoSection>

        <DemoSection title="Pagination">
          <div className="md:col-span-2 xl:col-span-3">
            <DemoCard title="AppPagination With Rows Per Page">
              <AppPagination
                page={page}
                count={10}
                total={96}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}
                showRowsPerPage
                showTotal
                variant="outlined"
                shape="rounded"
                colorVariant="primary"
              />
            </DemoCard>
          </div>

          <DemoCard title="Contained Pagination">
            <AppPagination
              page={page}
              count={8}
              onPageChange={setPage}
              variant="contained"
              colorVariant="success"
            />
          </DemoCard>

          <DemoCard title="Small Pagination">
            <AppPagination
              page={page}
              count={5}
              onPageChange={setPage}
              size="small"
              colorVariant="info"
            />
          </DemoCard>
        </DemoSection>

        <DemoSection title="Accordion">
          <div className="md:col-span-2 xl:col-span-3">
            <DemoCard title="AppAccordion Multiple Sections">
              <AppAccordion
                items={accordionItems}
                defaultExpanded={["details"]}
                multiple
                variant="outlined"
                rounded="lg"
                showDivider
              />
            </DemoCard>
          </div>

          <div className="md:col-span-2 xl:col-span-3">
            <DemoCard title="Soft Accordion">
              <AppAccordion
                items={accordionItems}
                defaultExpanded="billing"
                variant="soft"
                rounded="xl"
                elevation
              />
            </DemoCard>
          </div>
        </DemoSection>
      </section>
    </main>
  );
}

function DemoSection({ title, children }) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">{title}</h2>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {children}
      </div>
    </section>
  );
}

function DemoCard({ title, children }) {
  return (
    <div className="rounded-xl border border-border bg-surface-alt p-4">
      <h3 className="mb-4 font-semibold">{title}</h3>
      {children}
    </div>
  );
}
