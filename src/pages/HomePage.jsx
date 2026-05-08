import { useState } from "react";
import dayjs from "dayjs";

import {
  AppInput,
  AppTextarea,
  AppSelect,
  AppMultiSelect,
  AppAutocomplete,
  AppCheckbox,
  AppRadio,
  AppRadioGroup,
  AppSwitch,
  AppDatePicker,
  AppDateRangePicker,
  AppTimePicker,
  AppDateTimePicker,
  AppFileUpload,
  AppImageUpload,
  AppSearchInput,
  AppPasswordInput,
  AppPhoneInput,
  AppNumberInput,
  AppCurrencyInput,
  AppPercentageInput,
  AppButton,
} from "@/components";

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Inactive", value: "inactive", disabled: true },
];

const skillOptions = [
  { label: "React", value: "react" },
  { label: "Node.js", value: "node" },
  { label: "UI Design", value: "design" },
  { label: "Testing", value: "testing" },
];

const cityOptions = [
  { label: "Mumbai", value: "mumbai" },
  { label: "Delhi", value: "delhi" },
  { label: "Bengaluru", value: "bengaluru" },
  { label: "Pune", value: "pune" },
];

const planOptions = [
  { label: "Starter", value: "starter" },
  { label: "Professional", value: "professional" },
  { label: "Enterprise", value: "enterprise" },
];

export default function HomePage() {
  const [form, setForm] = useState({
    text: "John Doe",
    email: "john@example.com",
    password: "password123",
    phone: "9876543210",
    search: "",
    number: 5,
    currency: 2500,
    percentage: 18,
    textarea: "This is a sample description.",
    status: "active",
    skills: ["react", "design"],
    city: cityOptions[0],
    cities: [cityOptions[0], cityOptions[2]],
    checkbox: true,
    radio: "professional",
    switch: true,
    singleRadio: true,
    date: dayjs(),
    time: dayjs(),
    dateTime: dayjs(),
    dateRange: {
      startDate: dayjs(),
      endDate: dayjs().add(7, "day"),
    },
    file: null,
    image: null,
  });

  const updateField = (field) => (eventOrValue) => {
    const value = eventOrValue?.target
      ? eventOrValue.target.value
      : eventOrValue;

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateChecked = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.checked,
    }));
  };

  const handleReset = () => {
    setForm((prev) => ({
      ...prev,
      search: "",
      text: "",
      email: "",
      password: "",
      phone: "",
      textarea: "",
      number: 1,
      currency: 0,
      percentage: 0,
      file: null,
      image: null,
    }));
  };

  return (
    <main className="min-h-screen bg-bg text-text">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <p className="text-sm font-semibold text-primary">Component Demo</p>

          <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Inputs Showcase
              </h1>
              <p className="mt-2 max-w-3xl text-text-muted">
                Demo page for all reusable app input components with controlled
                values, helper text, states, selects, date pickers, uploads, and
                specialized inputs.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <AppButton
                variant="outlined"
                colorVariant="neutral"
                onClick={handleReset}
              >
                Reset Text Values
              </AppButton>

              <AppButton colorVariant="primary">Submit Demo</AppButton>
            </div>
          </div>
        </header>

        <DemoSection title="Basic Inputs">
          <AppInput
            label="Text Input"
            placeholder="Enter full name"
            value={form.text}
            onChange={updateField("text")}
            helperText="Standard AppInput field."
            fullWidth
          />

          <AppInput
            label="Email Input"
            type="email"
            placeholder="name@example.com"
            value={form.email}
            onChange={updateField("email")}
            success
            helperText="Success state example."
            fullWidth
          />

          <AppPasswordInput
            label="Password Input"
            value={form.password}
            onChange={updateField("password")}
            helperText="Password field with visibility toggle."
            fullWidth
          />

          <AppSearchInput
            label="Search Input"
            placeholder="Search records..."
            value={form.search}
            onChange={updateField("search")}
            clearable
            onClear={() => updateField("search")("")}
            fullWidth
          />

          <AppPhoneInput
            label="Phone Input"
            value={form.phone}
            onChange={updateField("phone")}
            helperText="Indian mobile number input."
            fullWidth
          />

          <AppInput
            label="Read Only Input"
            value="Read only value"
            readOnly
            helperText="Read-only state."
            fullWidth
          />

          <AppInput
            label="Disabled Input"
            value="Disabled value"
            disabled
            helperText="Disabled state."
            fullWidth
          />

          <AppInput
            label="Error Input"
            value="Wrong value"
            error
            errorText="This field has an error."
            fullWidth
          />
        </DemoSection>

        <DemoSection title="Adornments, Variants, Sizes">
          <AppInput
            label="Prefix / Suffix"
            value={form.text}
            onChange={updateField("text")}
            prefix="ID"
            suffix="USR"
            helperText="Using prefix and suffix props."
            fullWidth
          />

          <AppInput
            label="Soft Variant"
            value="Soft input"
            variant="soft"
            colorVariant="info"
            rounded="lg"
            fullWidth
          />

          <AppInput
            label="Bordered Variant"
            value="Bordered input"
            variant="bordered"
            colorVariant="primary"
            rounded="xl"
            fullWidth
          />

          <AppInput label="Small Size" value="Small" size="small" fullWidth />

          <AppInput
            label="Medium Size"
            value="Medium"
            size="medium"
            fullWidth
          />

          <AppInput label="Large Size" value="Large" size="large" fullWidth />
        </DemoSection>

        <DemoSection title="Textarea">
          <div className="md:col-span-2">
            <AppTextarea
              label="Description"
              placeholder="Write description..."
              value={form.textarea}
              onChange={updateField("textarea")}
              minRows={4}
              maxRows={8}
              showCount
              maxLength={250}
              resize="vertical"
              helperText="Textarea with counter and resize."
              fullWidth
            />
          </div>

          <AppTextarea
            label="Error Textarea"
            value="Too short"
            error
            errorText="Description must be at least 20 characters."
            rows={4}
            fullWidth
          />
        </DemoSection>

        <DemoSection title="Select Inputs">
          <AppSelect
            label="Single Select"
            value={form.status}
            onChange={updateField("status")}
            options={statusOptions}
            placeholder="Choose status"
            helperText="Single dropdown selection."
            fullWidth
          />

          <AppMultiSelect
            label="Multi Select"
            value={form.skills}
            onChange={updateField("skills")}
            options={skillOptions}
            showCheckbox
            showChips
            showSelectAll
            helperText="Multiple selection with chips."
            fullWidth
          />

          <AppAutocomplete
            label="Autocomplete"
            value={form.city}
            onChange={(_, value) => updateField("city")(value)}
            options={cityOptions}
            placeholder="Search city"
            showSearchIcon
            helperText="Searchable single select."
            fullWidth
          />

          <AppAutocomplete
            label="Multiple Autocomplete"
            value={form.cities}
            onChange={(_, value) => updateField("cities")(value)}
            options={cityOptions}
            multiple
            showCheckbox
            limitTags={2}
            placeholder="Select cities"
            helperText="Searchable multi select."
            fullWidth
          />

          <AppAutocomplete
            label="Free Solo Autocomplete"
            value={form.city}
            onChange={(_, value) => updateField("city")(value)}
            options={cityOptions}
            freeSolo
            placeholder="Type or select city"
            helperText="Allows custom values."
            fullWidth
          />
        </DemoSection>

        <DemoSection title="Choice Inputs">
          <AppCheckbox
            label="Checkbox"
            checked={form.checkbox}
            onChange={updateChecked("checkbox")}
            helperText="Boolean checkbox field."
            colorVariant="primary"
          />

          <AppCheckbox
            label="Indeterminate Checkbox"
            checked={false}
            indeterminate
            helperText="Indeterminate state."
            colorVariant="warning"
          />

          <AppSwitch
            label="Switch"
            checked={form.switch}
            onChange={updateChecked("switch")}
            helperText="Toggle setting."
            colorVariant="success"
          />

          <AppSwitch
            label="Read Only Switch"
            checked
            readOnly
            helperText="Read-only switch."
            colorVariant="info"
          />

          <AppRadio
            label="Single Radio"
            checked={form.singleRadio}
            onChange={updateChecked("singleRadio")}
            helperText="Standalone radio option."
            colorVariant="primary"
          />

          <AppRadioGroup
            label="Radio Group"
            name="plan"
            value={form.radio}
            onChange={updateField("radio")}
            options={planOptions}
            direction="row"
            helperText="Grouped radio options."
            colorVariant="primary"
          />
        </DemoSection>

        <DemoSection title="Number Inputs">
          <AppNumberInput
            label="Number Input"
            value={form.number}
            onChange={updateField("number")}
            min={1}
            max={100}
            step={1}
            helperText="Numeric input with min and max."
            fullWidth
          />

          <AppNumberInput
            label="Decimal Number"
            value={form.number}
            onChange={updateField("number")}
            allowDecimal
            step={0.5}
            helperText="Decimal values allowed."
            fullWidth
          />

          <AppCurrencyInput
            label="Currency Input"
            value={form.currency}
            onChange={updateField("currency")}
            currency="₹"
            position="prefix"
            helperText="Currency amount field."
            fullWidth
          />

          <AppPercentageInput
            label="Percentage Input"
            value={form.percentage}
            onChange={updateField("percentage")}
            helperText="Percentage field from 0 to 100."
            fullWidth
          />
        </DemoSection>

        <DemoSection title="Date and Time Inputs">
          <AppDatePicker
            label="Date Picker"
            value={form.date}
            onChange={updateField("date")}
            showToday
            showClear
            helperText="Date-only picker."
            fullWidth
          />

          <AppTimePicker
            label="Time Picker"
            value={form.time}
            onChange={updateField("time")}
            helperText="Time-only picker."
            fullWidth
          />

          <AppDateTimePicker
            label="Date Time Picker"
            value={form.dateTime}
            onChange={updateField("dateTime")}
            disablePast
            helperText="Combined date and time picker."
            fullWidth
          />

          <div className="md:col-span-2">
            <AppDateRangePicker
              startLabel="Start Date"
              endLabel="End Date"
              value={form.dateRange}
              onChange={updateField("dateRange")}
              helperText="Date range picker."
              fullWidth
            />
          </div>
        </DemoSection>

        <DemoSection title="Upload Inputs">
          <AppFileUpload
            label="File Upload"
            value={form.file}
            onChange={updateField("file")}
            accept=".pdf,.doc,.docx,.jpg,.png"
            buttonText="Choose File"
            dragText="Drag file here"
            browseText="Browse"
            showFileList
            helperText="Upload document or image files."
            fullWidth
          />

          <AppFileUpload
            label="Multiple File Upload"
            value={form.file}
            onChange={updateField("file")}
            multiple
            maxFiles={5}
            showFileList
            showProgress
            progress={65}
            helperText="Multiple upload with progress."
            fullWidth
          />

          <AppImageUpload
            label="Image Upload"
            value={form.image}
            onChange={updateField("image")}
            preview
            previewSize={120}
            helperText="Image upload with preview."
            fullWidth
          />
        </DemoSection>

        <DemoSection title="Validation and Loading States">
          <AppInput
            label="Required Field"
            value={form.text}
            onChange={updateField("text")}
            required
            helperText="Required input example."
            fullWidth
          />

          <AppInput
            label="Loading Input"
            value="Fetching data..."
            loading
            helperText="Loading state."
            fullWidth
          />

          <AppSelect
            label="Loading Select"
            value=""
            options={[]}
            loading
            helperText="Loading dropdown state."
            fullWidth
          />

          <AppAutocomplete
            label="Loading Autocomplete"
            value={null}
            options={[]}
            loading
            loadingText="Loading suggestions..."
            helperText="Async search loading state."
            fullWidth
          />

          <AppFileUpload
            label="Loading Upload"
            value={null}
            onChange={updateField("file")}
            loading
            loadingText="Uploading..."
            showProgress
            progress={45}
            helperText="Upload loading state."
            fullWidth
          />
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
