# Component Catalog

## Global AI Rules

- Import reusable components from `@/components`.
- Do not recreate UI if a component exists here.
- Do not use raw MUI components directly in pages when app components exist.
- Use design-system props like `variant`, `colorVariant`, `size`, `rounded`, `loading`, `fullWidth`.
- Use `sx` only for page-specific overrides.
- Do not hardcode colors; use theme tokens, CSS variables, Tailwind theme colors, or component props.

---

## Theme System

### colorTokens

Path: `src/theme/tokens.js`  
Use for: Central light/dark design tokens.  
Contains: `bg`, `surface`, `surfaceAlt`, `surfaceHover`, `surfaceActive`, `border`, `borderStrong`, `divider`, `text`, `textMuted`, `textDisabled`, `textInverse`, `primary`, `success`, `error`, `warning`, `info`, `neutral`, `disabledBg`, `disabledText`, `disabledBorder`, `readOnlyBg`, `hoverOverlay`, `activeOverlay`, `focusRing`, `overlay`, `shadowXs`, `shadowSm`, `shadowMd`, `shadowLg`, `shadowXl`.  
Modes: `light | dark`

### getThemeTokens

Path: `src/theme/getThemeTokens.js`  
Use for: Reading tokens for current theme mode.  
API: `getThemeTokens(mode)`  
Returns: `colorTokens[mode] || colorTokens.light`  
Example: `const t = getThemeTokens(theme)`

### createAppTheme

Path: `src/theme/createAppTheme.js`  
Use for: Creating MUI theme from app tokens.  
API: `createAppTheme(mode)`  
Includes: MUI palette, typography, shape, CssBaseline, Paper, Card, Button, OutlinedInput, InputLabel, HelperText, Divider, Dialog, Drawer, TableCell, Chip, Tooltip, Menu overrides.  
Rule: Do not create another MUI theme inside pages/components.

### ThemeProvider / useTheme

Path: `src/providers/ThemeProvider.jsx` or `src/contexts/ThemeContext.jsx`  
Use for: App-wide light/dark mode state and token sync.  
Provides: `theme`, `isDark`, `setTheme`, `toggleTheme`  
Persists: `localStorage.theme`  
Also sets CSS variables: `--app-color-*`, `--app-focus-ring`, `--app-shadow-*`  
Example: `const { theme, isDark, toggleTheme } = useTheme()`

### AppProvider

Path: `src/providers/AppProvider.jsx`  
Use for: Root provider wrapper.  
Wraps: `ThemeProvider`, `ReduxProvider`, `ToastProvider`  
Rule: App entry must stay wrapped in `<AppProvider>`.

### index.css

Path: `src/index.css`  
Use for: Tailwind v4 theme bridge and global base styles.  
Includes: `@theme` color mapping, custom dark variant, fallback CSS variables, body styles, focus ring, scrollbar, selection.  
Tailwind colors: `bg-bg`, `bg-surface`, `bg-surface-alt`, `text-text`, `text-text-muted`, `border-border`, `bg-primary`, `text-primary`, `bg-success`, `bg-error`, `bg-warning`, `bg-info`.

### Theme AI Rules

- Use component props like `colorVariant` before custom color styling.
- Use `getThemeTokens(theme)` only inside reusable components that need direct token access.
- Use `useTheme()` when a component needs `theme`, `isDark`, `setTheme`, or `toggleTheme`.
- Use CSS variables or Tailwind theme colors instead of hex values.
- Do not hardcode light/dark colors in pages.
- Do not create a separate theme system.
- Do not wrap pages with another `MuiThemeProvider`.

---

## Buttons

### AppButton

Path: `src/components/ui/buttons/AppButton.jsx`  
Use for: Standard action buttons, form buttons, CTA buttons.  
Replaces: MUI `Button`

Props:  
`children: ReactNode`, `onClick: function`, `type: string`, `variant: string`, `colorVariant: string`, `size: string`, `fullWidth: boolean`, `disabled: boolean`, `loading: boolean`, `startIcon: ReactNode`, `endIcon: ReactNode`, `rounded: string`, `elevation: boolean`, `uppercase: boolean`, `fontWeight: number | string`, `loaderVariant: string`, `sx: object`, `...props: object`

Values:  
`type=button|submit|reset`, `variant=contained|outlined|text|soft|gradient`, `colorVariant=primary|success|error|warning|info|dark`, `size=small|medium|large`, `rounded=sm|md|lg`, `loaderVariant=spinner|dots|pulse`

Example:  
`<AppButton colorVariant="primary" onClick={handleSave}>Save</AppButton>`

---

### AppIconButton

Path: `src/components/ui/buttons/AppIconButton.jsx`  
Use for: Icon-only actions like edit, delete, view, refresh, download.  
Replaces: MUI `IconButton`

Props:  
`icon: ReactNode`, `children: ReactNode`, `onClick: function`, `type: string`, `variant: string`, `colorVariant: string`, `size: string`, `rounded: string`, `disabled: boolean`, `loading: boolean`, `elevation: boolean`, `tooltip: string`, `tooltipPlacement: string`, `tooltipVariant: string`, `tooltipSize: string`, `tooltipDisabled: boolean`, `loaderVariant: string`, `sx: object`, `...props: object`

Values:  
`type=button|submit|reset`, `variant=contained|outlined|text|soft|gradient`, `colorVariant=primary|success|error|warning|info|dark`, `size=small|medium|large`, `rounded=sm|md|lg|full`, `tooltipPlacement=top|bottom|left|right`, `loaderVariant=spinner|dots|pulse`

Example:  
`<AppIconButton icon={<EditRoundedIcon />} tooltip="Edit" onClick={handleEdit} />`

---

### AppButtonGroup

Path: `src/components/ui/buttons/AppButtonGroup.jsx`  
Use for: Grouped buttons, segmented actions, filter toggles, toolbar groups.

Props:  
`children: ReactNode`, `orientation: string`, `fullWidth: boolean`, `spacing: number | string`, `variant: string`, `size: string`, `colorVariant: string`, `rounded: string`, `sx: object`

Values:  
`orientation=horizontal|vertical`, `variant=contained|outlined|text|soft|gradient`, `size=small|medium|large`, `colorVariant=primary|success|error|warning|info|dark`, `rounded=sm|md|lg`

Example:  
`<AppButtonGroup><AppButton>Day</AppButton><AppButton>Week</AppButton></AppButtonGroup>`

---

### AppSplitButton

Path: `src/components/ui/buttons/AppSplitButton.jsx`  
Use for: Primary action with dropdown alternatives like Save, Export, Create.  
Built with: `AppButton`, `AppIconButton`, `AppMenu`

Props:  
`label: string`, `items: array`, `onClick: function`, `selectedIndex: number`, `variant: string`, `colorVariant: string`, `size: string`, `rounded: string`, `disabled: boolean`, `loading: boolean`, `elevation: boolean`, `menuMinWidth: number | string`, `closeOnItemClick: boolean`, `sx: object`, `buttonSx: object`, `arrowSx: object`

Item shape:  
`{ label: string, onClick: function, disabled: boolean, icon: ReactNode }`

Values:  
`variant=contained|outlined|text|soft|gradient`, `colorVariant=primary|success|error|warning|info|dark`, `size=small|medium|large`, `rounded=sm|md|lg`

Example:  
`<AppSplitButton label="Export" items={[{ label: "CSV", onClick: exportCsv }]} />`

---

### AppLoadingButton

Path: `src/components/ui/buttons/AppLoadingButton.jsx`  
Use for: Async submit/save/delete buttons.  
Wraps: `AppButton`

Props:  
`children: ReactNode`, `loading: boolean`, `loadingText: string`, `disabled: boolean`, `loaderVariant: string`, plus all `AppButton` props

Values:  
`loaderVariant=spinner|dots|pulse`

Example:  
`<AppLoadingButton loading={isSaving} loadingText="Saving...">Save</AppLoadingButton>`

---

### Button AI Rules

- Use `AppButton` for normal buttons.
- Use `AppIconButton` for icon-only actions.
- Use `AppLoadingButton` for async actions.
- Use `AppButtonGroup` for grouped/segmented buttons.
- Use `AppSplitButton` for dropdown actions.
- Never use raw MUI `Button` or `IconButton` in pages.
- Always check prop types before passing values.
- Pass functions only to event props like `onClick`.
- Pass objects only to style props like `sx`, `buttonSx`, and `arrowSx`.
- Pass React elements only to icon props like `icon`, `startIcon`, and `endIcon`.

---

## Inputs

### AppInput

Path: `src/components/ui/inputs/AppInput.jsx`  
Use for: Standard text inputs, email inputs, search fields, password inputs, prefixed/suffixed fields.  
Replaces: MUI `TextField`, `OutlinedInput` in pages.

Props:  
`label: string`, `helperText: string | ReactNode`, `errorText: string | ReactNode`, `value: string | number`, `defaultValue: string | number`, `onChange: function`, `type: string`, `name: string`, `id: string`, `placeholder: string`, `fullWidth: boolean`, `disabled: boolean`, `readOnly: boolean`, `required: boolean`, `error: boolean`, `success: boolean`, `loading: boolean`, `clearable: boolean`, `onClear: function`, `size: string`, `variant: string`, `colorVariant: string`, `rounded: string`, `startAdornment: ReactNode`, `endAdornment: ReactNode`, `prefix: string | ReactNode`, `suffix: string | ReactNode`, `startIcon: ReactNode`, `endIcon: ReactNode`, `multiline: boolean`, `minRows: number`, `maxRows: number`, `rows: number`, `passwordToggle: boolean`, `autoComplete: string`, `autoFocus: boolean`, `sx: object`, `inputSx: object`, `formControlSx: object`, `labelSx: object`, `helperTextSx: object`, `inputProps: object`, `...props: object`

Values:  
`size=small|medium|large`, `variant=surface|soft|bordered`, `colorVariant=primary|success|error|warning|info|dark|neutral`, `rounded=sm|md|lg|xl|full`, `type=text|email|password|number|tel|search|url`

Example:  
`<AppInput label="Email" type="email" placeholder="Enter email" value={email} onChange={handleChange} />`

---

### AppTextarea

Path: `src/components/ui/inputs/AppTextarea.jsx`  
Use for: Multi-line text fields, comments, notes, descriptions, remarks.  
Replaces: MUI multiline `TextField` or raw `textarea`.

Props:  
`label: string`, `helperText: string | ReactNode`, `errorText: string | ReactNode`, `value: string | number`, `defaultValue: string | number`, `onChange: function`, `name: string`, `id: string`, `placeholder: string`, `fullWidth: boolean`, `disabled: boolean`, `readOnly: boolean`, `required: boolean`, `error: boolean`, `success: boolean`, `loading: boolean`, `clearable: boolean`, `onClear: function`, `size: string`, `variant: string`, `colorVariant: string`, `rounded: string`, `startAdornment: ReactNode`, `endAdornment: ReactNode`, `prefix: string | ReactNode`, `suffix: string | ReactNode`, `startIcon: ReactNode`, `endIcon: ReactNode`, `minRows: number`, `maxRows: number`, `rows: number`, `resize: string`, `showCount: boolean`, `maxLength: number`, `autoComplete: string`, `autoFocus: boolean`, `sx: object`, `inputSx: object`, `formControlSx: object`, `labelSx: object`, `helperTextSx: object`, `counterSx: object`, `inputProps: object`, `...props: object`

Values:  
`size=small|medium|large`, `variant=surface|soft|bordered`, `colorVariant=primary|success|error|warning|info|dark|neutral`, `rounded=sm|md|lg|xl|full`, `resize=none|both|horizontal|vertical`

Example:  
`<AppTextarea label="Description" minRows={4} showCount maxLength={250} />`

---

### AppSelect

Path: `src/components/ui/inputs/AppSelect.jsx`  
Use for: Single-select dropdowns, status selectors, category selectors, role selectors.  
Replaces: MUI `Select` in pages.

Props:  
`label: string`, `helperText: string | ReactNode`, `errorText: string | ReactNode`, `value: string | number`, `defaultValue: string | number`, `onChange: function`, `name: string`, `id: string`, `placeholder: string`, `fullWidth: boolean`, `disabled: boolean`, `readOnly: boolean`, `required: boolean`, `error: boolean`, `success: boolean`, `loading: boolean`, `clearable: boolean`, `onClear: function`, `size: string`, `variant: string`, `colorVariant: string`, `rounded: string`, `startAdornment: ReactNode`, `endAdornment: ReactNode`, `prefix: string | ReactNode`, `suffix: string | ReactNode`, `startIcon: ReactNode`, `endIcon: ReactNode`, `options: array`, `optionLabelKey: string`, `optionValueKey: string`, `getOptionLabel: function`, `getOptionValue: function`, `renderOption: function`, `renderValue: function`, `displayEmpty: boolean`, `showCheckIcon: boolean`, `menuMaxHeight: number`, `autoFocus: boolean`, `sx: object`, `inputSx: object`, `formControlSx: object`, `labelSx: object`, `helperTextSx: object`, `selectProps: object`, `menuProps: object`, `inputProps: object`, `...props: object`

Option shape:  
`{ label: string, value: string | number, disabled: boolean }`

Values:  
`size=small|medium|large`, `variant=surface|soft|bordered`, `colorVariant=primary|success|error|warning|info|dark|neutral`, `rounded=sm|md|lg|xl|full`

Example:  
`<AppSelect label="Status" value={status} onChange={handleStatusChange} options={statusOptions} />`

---

### AppMultiSelect

Path: `src/components/ui/inputs/AppMultiSelect.jsx`  
Use for: Multi-select dropdowns, tag selectors, user selectors, permission selectors.  
Replaces: MUI multiple `Select` in pages.

Props:  
`label: string`, `helperText: string | ReactNode`, `errorText: string | ReactNode`, `value: array`, `defaultValue: array`, `onChange: function`, `name: string`, `id: string`, `placeholder: string`, `fullWidth: boolean`, `disabled: boolean`, `readOnly: boolean`, `required: boolean`, `error: boolean`, `success: boolean`, `loading: boolean`, `clearable: boolean`, `onClear: function`, `size: string`, `variant: string`, `colorVariant: string`, `rounded: string`, `startAdornment: ReactNode`, `endAdornment: ReactNode`, `prefix: string | ReactNode`, `suffix: string | ReactNode`, `startIcon: ReactNode`, `endIcon: ReactNode`, `options: array`, `optionLabelKey: string`, `optionValueKey: string`, `getOptionLabel: function`, `getOptionValue: function`, `renderOption: function`, `renderTag: function`, `renderValue: function`, `displayEmpty: boolean`, `showCheckbox: boolean`, `showCheckIcon: boolean`, `showChips: boolean`, `limitTags: number`, `menuMaxHeight: number`, `autoFocus: boolean`, `open: boolean`, `defaultOpen: boolean`, `onOpenChange: function`, `showSelectAll: boolean`, `showCloseAction: boolean`, `selectAllLabel: string`, `deselectAllLabel: string`, `closeLabel: string`, `sx: object`, `inputSx: object`, `formControlSx: object`, `labelSx: object`, `helperTextSx: object`, `selectProps: object`, `menuProps: object`, `inputProps: object`, `...props: object`

Option shape:  
`{ label: string, value: string | number, disabled: boolean }`

Values:  
`size=small|medium|large`, `variant=surface|soft|bordered`, `colorVariant=primary|success|error|warning|info|dark|neutral`, `rounded=sm|md|lg|xl|full`

Example:  
`<AppMultiSelect label="Permissions" value={permissions} onChange={handlePermissionsChange} options={permissionOptions} />`

---

### AppAutocomplete

Path: `src/components/ui/inputs/AppAutocomplete.jsx`  
Use for: Searchable select, async search, user picker, product picker, free text suggestions.  
Replaces: MUI `Autocomplete` in pages.

Props:  
`label: string`, `helperText: string | ReactNode`, `errorText: string | ReactNode`, `value: any`, `defaultValue: any`, `onChange: function`, `inputValue: string`, `onInputChange: function`, `name: string`, `id: string`, `placeholder: string`, `fullWidth: boolean`, `disabled: boolean`, `readOnly: boolean`, `required: boolean`, `error: boolean`, `success: boolean`, `loading: boolean`, `clearable: boolean`, `onClear: function`, `size: string`, `variant: string`, `colorVariant: string`, `rounded: string`, `startAdornment: ReactNode`, `endAdornment: ReactNode`, `prefix: string | ReactNode`, `suffix: string | ReactNode`, `startIcon: ReactNode`, `endIcon: ReactNode`, `options: array`, `multiple: boolean`, `freeSolo: boolean`, `disableCloseOnSelect: boolean`, `filterSelectedOptions: boolean`, `autoHighlight: boolean`, `autoComplete: boolean`, `autoSelect: boolean`, `openOnFocus: boolean`, `limitTags: number`, `showCheckbox: boolean`, `showCheckIcon: boolean`, `showSearchIcon: boolean`, `optionLabelKey: string`, `optionValueKey: string`, `getOptionLabel: function`, `getOptionValue: function`, `isOptionEqualToValue: function`, `filterOptions: function`, `groupBy: function`, `renderOption: function`, `renderTag: function`, `noOptionsText: string`, `loadingText: string`, `menuMaxHeight: number`, `autoFocus: boolean`, `sx: object`, `inputSx: object`, `formControlSx: object`, `labelSx: object`, `helperTextSx: object`, `autocompleteSx: object`, `textFieldProps: object`, `...props: object`

Option shape:  
`string | { label: string, value: string | number, disabled: boolean }`

Values:  
`size=small|medium|large`, `variant=surface|soft|bordered`, `colorVariant=primary|success|error|warning|info|dark|neutral`, `rounded=sm|md|lg|xl|full`

Example:  
`<AppAutocomplete label="Customer" options={customers} value={customer} onChange={handleCustomerChange} />`

---

### AppCheckbox

Path: `src/components/ui/inputs/AppCheckbox.jsx`  
Use for: Boolean fields, checklist items, permission toggles, table row selection.  
Replaces: MUI `Checkbox` in pages.

Props:  
`label: string | ReactNode`, `checked: boolean`, `defaultChecked: boolean`, `onChange: function`, `name: string`, `value: string | number | boolean`, `colorVariant: string`, `size: string`, `labelPlacement: string`, `disabled: boolean`, `required: boolean`, `indeterminate: boolean`, `helperText: string | ReactNode`, `error: boolean`, `fullWidth: boolean`, `rounded: string`, `sx: object`, `checkboxSx: object`, `labelSx: object`, `helperTextSx: object`, `...props: object`

Values:  
`colorVariant=primary|success|error|warning|info|dark|neutral`, `size=small|medium|large`, `labelPlacement=end|start|top|bottom`, `rounded=sm|md|lg|full`

Example:  
`<AppCheckbox label="I agree" checked={accepted} onChange={handleAcceptedChange} />`

---

### AppRadio

Path: `src/components/ui/inputs/AppRadio.jsx`  
Use for: Single radio option in radio groups, status choice, mode selection.  
Replaces: MUI `Radio` in pages.

Props:  
`label: string | ReactNode`, `checked: boolean`, `defaultChecked: boolean`, `onChange: function`, `name: string`, `value: string | number | boolean`, `colorVariant: string`, `size: string`, `labelPlacement: string`, `disabled: boolean`, `required: boolean`, `helperText: string | ReactNode`, `error: boolean`, `fullWidth: boolean`, `sx: object`, `radioSx: object`, `labelSx: object`, `helperTextSx: object`, `...props: object`

Values:  
`colorVariant=primary|success|error|warning|info|dark|neutral`, `size=small|medium|large`, `labelPlacement=end|start|top|bottom`

Example:  
`<AppRadio label="Active" value="active" checked={status === "active"} onChange={handleStatusChange} />`

---

### AppSwitch

Path: `src/components/ui/inputs/AppSwitch.jsx`  
Use for: Toggle settings, active/inactive states, feature enable/disable fields.  
Replaces: MUI `Switch` in pages.

Props:  
`label: string | ReactNode`, `checked: boolean`, `defaultChecked: boolean`, `onChange: function`, `name: string`, `value: string | number | boolean`, `colorVariant: string`, `size: string`, `labelPlacement: string`, `disabled: boolean`, `required: boolean`, `helperText: string | ReactNode`, `error: boolean`, `fullWidth: boolean`, `readOnly: boolean`, `sx: object`, `switchSx: object`, `labelSx: object`, `helperTextSx: object`, `...props: object`

Values:  
`colorVariant=primary|success|error|warning|info|dark|neutral`, `size=small|medium|large`, `labelPlacement=end|start|top|bottom`

Example:  
`<AppSwitch label="Active" checked={isActive} onChange={handleActiveChange} />`

---

### AppDatePicker

Path: `src/components/ui/inputs/AppDatePicker.jsx`  
Use for: Date selection fields, filters, form date values.  
Replaces: Direct MUI X `DatePicker` usage in pages.

Props:  
`label: string`, `value: dayjs object | null`, `onChange: function`, `name: string`, `colorVariant: string`, `size: string`, `disabled: boolean`, `required: boolean`, `helperText: string | ReactNode`, `error: boolean`, `fullWidth: boolean`, `readOnly: boolean`, `placeholder: string`, `format: string`, `minDate: dayjs object | null`, `maxDate: dayjs object | null`, `disablePast: boolean`, `disableFuture: boolean`, `showToday: boolean`, `showClear: boolean`, `sx: object`, `inputSx: object`, `labelSx: object`, `helperTextSx: object`, `...props: object`

Values:  
`colorVariant=primary|success|error|warning|info|dark|neutral`, `size=small|medium|large`

AI Notes:

- Requires `import dayjs from "dayjs";`
- `value` must be a dayjs object or `null`.
- Do not pass plain date strings like `"2026-05-08"`.
- Correct: `value={dayjs("2026-05-08")}`
- Wrong: `value="2026-05-08"`
- Built on MUI X `DatePicker` + `AdapterDayjs`.
- Common error: `value.isValid is not a function`.
- Cause: Passing string instead of dayjs object.

Example:  
`<AppDatePicker label="Invoice Date" value={dayjs("2026-05-08")} onChange={setDate} />`

---

### AppFileUpload

Path: `src/components/ui/inputs/AppFileUpload.jsx`  
Use for: File upload fields, drag-and-drop upload, document attachment inputs.

Props:  
`label: string`, `value: File | FileList | array | null`, `onChange: function`, `name: string`, `accept: string`, `multiple: boolean`, `disabled: boolean`, `required: boolean`, `error: boolean`, `helperText: string | ReactNode`, `fullWidth: boolean`, `colorVariant: string`, `size: string`, `buttonText: string`, `dragText: string`, `browseText: string`, `showFileList: boolean`, `showProgress: boolean`, `progress: number`, `loading: boolean`, `loadingText: string`, `loaderVariant: string`, `maxFiles: number`, `sx: object`, `uploadBoxSx: object`, `buttonSx: object`, `labelSx: object`, `helperTextSx: object`, `fileListSx: object`, `...props: object`

Values:  
`colorVariant=primary|success|error|warning|info|dark|neutral`, `size=small|medium|large`, `loaderVariant=spinner|dots|pulse`

Example:  
`<AppFileUpload label="Upload Invoice" accept=".pdf,.jpg" value={file} onChange={setFile} />`

---

### AppPasswordInput

Path: `src/components/ui/inputs/AppPasswordInput.jsx`  
Use for: Password fields with visibility toggle.  
Wraps: `AppInput`

Props:  
`autoComplete: string`, `placeholder: string`, `passwordToggle: boolean`, plus all `AppInput` props

Values:  
`autoComplete=current-password|new-password|off`

Example:  
`<AppPasswordInput label="Password" value={password} onChange={handlePasswordChange} />`

---

### AppPhoneInput

Path: `src/components/ui/inputs/AppPhoneInput.jsx`  
Use for: Phone number fields, Indian mobile number fields, numeric-only contact fields.  
Wraps: `AppInput`

Props:  
`value: string | number`, `onChange: function`, `countryCode: string`, `showCountryCode: boolean`, `maxLength: number`, `onlyMobile: boolean`, `placeholder: string`, `helperText: string | ReactNode`, `errorText: string | ReactNode`, `validateOnBlur: boolean`, `onBlur: function`, `inputProps: object`, plus all `AppInput` props

Values:  
`countryCode=+91`, `maxLength=10`, `onlyMobile=true|false`, `validateOnBlur=true|false`

Example:  
`<AppPhoneInput label="Mobile Number" value={phone} onChange={handlePhoneChange} />`

---

### AppNumberInput

Path: `src/components/ui/inputs/AppNumberInput.jsx`  
Use for: Numeric values, quantities, counts, scores, limits, percentages when a custom wrapper is not required.  
Wraps: `AppInput`

Props:  
`value: string | number`, `onChange: function`, `min: number`, `max: number`, `step: number`, `allowNegative: boolean`, `allowDecimal: boolean`, `clampOnBlur: boolean`, `suffix: string | ReactNode`, `inputProps: object`, `onBlur: function`, plus all `AppInput` props

Values:  
`allowNegative=true|false`, `allowDecimal=true|false`, `clampOnBlur=true|false`

Example:  
`<AppNumberInput label="Quantity" min={1} max={100} value={quantity} onChange={handleQuantityChange} />`

---

### AppCurrencyInput

Path: `src/components/ui/inputs/AppCurrencyInput.jsx`  
Use for: Currency amount fields, price inputs, invoice values, payment values.  
Wraps: `AppNumberInput`

Props:  
`currency: string`, `position: string`, `allowDecimal: boolean`, `min: number`, plus all `AppNumberInput` props

Values:  
`position=prefix|suffix`, `currency=₹|$|€|custom string`

Example:  
`<AppCurrencyInput label="Amount" value={amount} onChange={handleAmountChange} />`

---

### AppPercentageInput

Path: `src/components/ui/inputs/AppPercentageInput.jsx`  
Use for: Percentage values, discount fields, tax rate fields, completion values.  
Wraps: `AppNumberInput`

Props:  
`min: number`, `max: number`, `allowDecimal: boolean`, `suffix: string | ReactNode`, plus all `AppNumberInput` props

Values:  
`min=0`, `max=100`, `suffix=%`

Example:  
`<AppPercentageInput label="Discount" value={discount} onChange={handleDiscountChange} />`

---

### AppRadioGroup

Path: `src/components/ui/inputs/AppRadioGroup.jsx`  
Use for: Radio option groups, status choice groups, form mode selectors.  
Built with: `AppRadio`

Props:  
`options: array`, `value: string | number | boolean`, `onChange: function`, `name: string`, `direction: string`, `spacing: number | string`, plus all `AppRadio` props

Option shape:  
`{ label: string, value: string | number | boolean, id: string | number, disabled: boolean }`

Values:  
`direction=row|column`

Example:  
`<AppRadioGroup name="status" value={status} onChange={handleStatusChange} options={statusOptions} />`

---

### AppDateRangePicker

Path: `src/components/ui/inputs/AppDateRangePicker.jsx`  
Use for: Date range filters, report ranges, start/end date form fields.  
Built with: `AppDatePicker`

Props:  
`startLabel: string`, `endLabel: string`, `startName: string`, `endName: string`, `value: object`, `onChange: function`, `startValue: dayjs object | null`, `endValue: dayjs object | null`, `fullWidth: boolean`, `gap: number | string`, plus all `AppDatePicker` props

Value shape:  
`{ startDate: dayjs object | null, endDate: dayjs object | null }`

AI Notes:

- Requires `import dayjs from "dayjs";`
- `value` shape:
  `{ startDate: dayjs() | null, endDate: dayjs() | null }`
- Do not pass plain strings.

Example:  
`<AppDateRangePicker value={{ startDate: dayjs(), endDate: dayjs() }} onChange={setDateRange} />`

---

### AppTimePicker

Path: `src/components/ui/inputs/AppTimePicker.jsx`  
Use for: Time selection fields, schedule forms, attendance forms.  
Replaces: Direct MUI X `TimePicker` usage in pages.

Props:  
`label: string`, `value: dayjs object | null`, `onChange: function`, `name: string`, `colorVariant: string`, `size: string`, `disabled: boolean`, `required: boolean`, `helperText: string | ReactNode`, `error: boolean`, `fullWidth: boolean`, `readOnly: boolean`, `placeholder: string`, `format: string`, `minTime: dayjs object | null`, `maxTime: dayjs object | null`, `sx: object`, `inputSx: object`, `labelSx: object`, `helperTextSx: object`, `...props: object`

Values:  
`colorVariant=primary|success|error|warning|info|dark|neutral`, `size=small|medium|large`

AI Notes:

- Requires `import dayjs from "dayjs";`
- `value` must be a dayjs object.
- Correct: `value={dayjs()}`
- Wrong: `value="10:30"`

Example:  
`<AppTimePicker label="Start Time" value={dayjs()} onChange={setStartTime} />`

---

### AppDateTimePicker

Path: `src/components/ui/inputs/AppDateTimePicker.jsx`  
Use for: Date-time selection fields, scheduling, reminders, event forms.  
Replaces: Direct MUI X `DateTimePicker` usage in pages.

Props:  
`label: string`, `value: dayjs object | null`, `onChange: function`, `name: string`, `colorVariant: string`, `size: string`, `disabled: boolean`, `required: boolean`, `helperText: string | ReactNode`, `error: boolean`, `fullWidth: boolean`, `readOnly: boolean`, `placeholder: string`, `format: string`, `minDateTime: dayjs object | null`, `maxDateTime: dayjs object | null`, `disablePast: boolean`, `disableFuture: boolean`, `sx: object`, `inputSx: object`, `labelSx: object`, `helperTextSx: object`, `...props: object`

Values:  
`colorVariant=primary|success|error|warning|info|dark|neutral`, `size=small|medium|large`

AI Notes:

- Requires `import dayjs from "dayjs";`
- `value` must be a dayjs object or `null`.
- Correct: `value={dayjs("2026-05-08T10:30")}`
- Do not pass plain strings.

Example:  
`<AppDateTimePicker label="Meeting Time" value={dayjs("2026-05-08T10:30")} onChange={setMeetingTime} />`

---

### AppImageUpload

Path: `src/components/ui/inputs/AppImageUpload.jsx`  
Use for: Image upload fields, avatar upload, product image upload, previewable file inputs.  
Wraps: `AppFileUpload`

Props:  
`value: string | File | null`, `onChange: function`, `accept: string`, `preview: boolean`, `previewSize: number`, `helperText: string | ReactNode`, plus all `AppFileUpload` props

Values:  
`accept=image/*`, `preview=true|false`

Example:  
`<AppImageUpload label="Profile Image" value={image} onChange={setImage} />`

---

### AppSearchInput

Path: `src/components/ui/inputs/AppSearchInput.jsx`  
Use for: Search boxes, table search, filter search, command search fields.  
Wraps: `AppInput`

Props:  
`placeholder: string`, `clearable: boolean`, `startIcon: ReactNode`, `type: string`, plus all `AppInput` props

Values:  
`type=search`, `clearable=true|false`

Example:  
`<AppSearchInput value={search} onChange={handleSearchChange} placeholder="Search records..." />`

---

### Input AI Rules

- Use `AppInput` for standard text, email, password, and generic input fields.
- Use `AppTextarea` for multi-line text instead of raw `textarea`.
- Use `AppSelect` for single dropdown selection.
- Use `AppMultiSelect` for multiple dropdown selection.
- Use `AppAutocomplete` for searchable selects, async selectors, and suggestion inputs.
- Use `AppCheckbox` for boolean checkbox fields.
- Use `AppRadio` for single radio controls.
- Use `AppRadioGroup` for grouped radio choices.
- Use `AppSwitch` for toggle fields.
- Use `AppDatePicker` for date-only fields.
- Use `AppDateRangePicker` for start/end date ranges.
- Use `AppTimePicker` for time-only fields.
- Use `AppDateTimePicker` for combined date-time fields.
- Use `AppFileUpload` for file upload fields.
- Use `AppImageUpload` for image upload with preview.
- Use `AppSearchInput` for search fields.
- Use `AppPasswordInput` for password fields.
- Use `AppPhoneInput` for phone/mobile number fields.
- Use `AppNumberInput` for numeric entry instead of raw number inputs.
- Use `AppCurrencyInput` for money fields.
- Use `AppPercentageInput` for percentage fields.
- Never use raw MUI `TextField`, `OutlinedInput`, `Select`, `Autocomplete`, `Checkbox`, `Radio`, `Switch`, or raw HTML inputs in pages when these components fit.
- Pass functions only to event props like `onChange`, `onBlur`, `onClear`, `renderOption`, and `renderValue`.
- Pass objects only to style/config props like `sx`, `inputSx`, `formControlSx`, `labelSx`, `helperTextSx`, `inputProps`, `selectProps`, and `menuProps`.
- Pass React elements only to visual props like `startIcon`, `endIcon`, `startAdornment`, and `endAdornment`.
- Do not hardcode colors inside pages; use component props or theme tokens.

### Critical Runtime Rules

#### Date Components

All date/time components use Dayjs internally.

Required:  
`import dayjs from "dayjs";`

Correct:  
`value={dayjs()}`

Wrong:  
`value="2026-05-08"`

Affected Components:

- `AppDatePicker`
- `AppTimePicker`
- `AppDateTimePicker`
- `AppDateRangePicker`

## Charts

### AppKpiCard

Path: `src/components/ui/charts/AppKpiCard.jsx`  
Use for: Dashboard stats, analytics summaries, metric highlight cards, compact reporting widgets.

Props:  
`title: string | ReactNode`, `value: string | number | ReactNode`, `subtitle: string | ReactNode`, `icon: ReactNode`, `footer: string | ReactNode`, `trend: object`, `badge: string | ReactNode`, `variant: string`, `colorVariant: string`, `size: string`, `loading: boolean`, `compact: boolean`, `elevation: boolean`, `fullHeight: boolean`, `onClick: function`, `sx: object`, `contentSx: object`, `...props: object`

Trend shape:  
`{ value: string | number, direction: string, label: string }`

Values:  
`variant=surface|soft|outlined`, `colorVariant=primary|success|error|warning|info|dark|neutral`, `size=small|medium|large`, `trend.direction=up|down|neutral`

Example:  
`<AppKpiCard title="Revenue" value="$24,500" trend={{ value: "+12%", direction: "up", label: "vs last month" }} colorVariant="success" />`

---

### AppBarChart

Path: `src/components/ui/charts/AppBarChart.jsx`  
Use for: Category comparisons, grouped bars, stacked totals, and horizontal ranking charts.  
Replaces: Direct `@mui/x-charts/BarChart` usage in pages.

Props:  
`data: array`, `bars: array`, `xKey: string`, `title: string | ReactNode`, `subtitle: string | ReactNode`, `height: number`, `variant: string`, `layout: string`, `showLegend: boolean`, `showGrid: boolean`, `loading: boolean`, `emptyText: string`, `valueFormatter: function`, `sx: object`

Bar shape:  
`{ key: string, label: string, colorVariant: string }`

Values:  
`variant=grouped|stacked`, `layout=vertical|horizontal`, `colorVariant=primary|success|error|warning|info|dark|neutral`

Example:  
`<AppBarChart title="Sales by Region" data={salesData} xKey="region" bars={[{ key: "sales", label: "Sales", colorVariant: "primary" }]} />`

---

### AppLineChart

Path: `src/components/ui/charts/AppLineChart.jsx`  
Use for: Trends over time, analytics timelines, comparative growth charts, activity monitoring.  
Replaces: Direct `@mui/x-charts/LineChart` usage in pages.

Props:  
`data: array`, `lines: array`, `xKey: string`, `title: string | ReactNode`, `subtitle: string | ReactNode`, `height: number`, `curve: string`, `showLegend: boolean`, `showGrid: boolean`, `showArea: boolean`, `stacked: boolean`, `loading: boolean`, `emptyText: string`, `valueFormatter: function`, `xValueFormatter: function`, `sx: object`

Line shape:  
`{ key: string, label: string, colorVariant: string, curve: string, area: boolean, showMark: boolean, stacked: boolean }`

Values:  
`curve=linear|monotone|step|stepBefore|stepAfter|natural`, `colorVariant=primary|success|error|warning|info|dark|neutral`

Example:  
`<AppLineChart title="Visitors" data={visitorData} xKey="date" lines={[{ key: "visitors", label: "Visitors", colorVariant: "info" }]} />`

---

### AppAreaChart

Path: `src/components/ui/charts/AppAreaChart.jsx`  
Use for: Filled trend charts, cumulative metrics, stacked area comparisons, volume-over-time visuals.  
Replaces: Direct `@mui/x-charts/LineChart` usage when area styling is required.

Props:  
`data: array`, `areas: array`, `xKey: string`, `title: string | ReactNode`, `subtitle: string | ReactNode`, `height: number`, `curve: string`, `showLegend: boolean`, `showGrid: boolean`, `stacked: boolean`, `showMark: boolean`, `loading: boolean`, `emptyText: string`, `valueFormatter: function`, `xValueFormatter: function`, `maxWidth: number | string`, `sx: object`, `chartSx: object`

Area shape:  
`{ key: string, label: string, colorVariant: string, color: string, curve: string, stacked: boolean, showMark: boolean }`

Values:  
`curve=linear|monotone|step|stepBefore|stepAfter|natural`, `colorVariant=primary|success|error|warning|info|dark|neutral`

Example:  
`<AppAreaChart title="Revenue Trend" data={revenueData} xKey="month" stacked areas={[{ key: "product", label: "Product", colorVariant: "primary" }]} />`

---

### AppPieChart

Path: `src/components/ui/charts/AppPieChart.jsx`  
Use for: Category distribution, percentage breakdowns, donut charts, single-series share visuals.  
Replaces: Direct `@mui/x-charts/PieChart` usage in pages.

Props:  
`data: array`, `title: string | ReactNode`, `subtitle: string | ReactNode`, `height: number`, `variant: string`, `innerRadius: number`, `outerRadius: number`, `paddingAngle: number`, `cornerRadius: number`, `startAngle: number`, `endAngle: number`, `showLegend: boolean`, `showLabels: boolean`, `labelType: string`, `loading: boolean`, `emptyText: string`, `valueFormatter: function`, `sx: object`, `chartSx: object`

Data shape:  
`{ id: string | number, label: string, value: number, colorVariant: string, color: string }`

Values:  
`variant=pie|donut`, `labelType=value|percent|both`, `colorVariant=primary|success|error|warning|info|dark|neutral`

Example:  
`<AppPieChart title="Lead Sources" data={[{ label: "Organic", value: 45, colorVariant: "primary" }]} variant="donut" />`

---

### Chart AI Rules

- Use `AppKpiCard` for single metrics before building custom stat cards.
- Use `AppBarChart` for category comparisons, grouped bars, stacked totals, and horizontal ranking charts.
- Use `AppLineChart` for trend lines and time-series comparisons.
- Use `AppAreaChart` for filled trend charts and stacked volume/cumulative views.
- Use `AppPieChart` only for simple part-to-whole distribution charts.
- Do not use raw `@mui/x-charts` components directly in pages when these wrappers fit.
- Pass semantic chart colors through `colorVariant`; avoid hardcoded colors in page code.
- Keep chart data normalized as arrays of objects and configure series through `bars`, `lines`, `areas`, or pie `data`.
- Use `loading` and `emptyText` states instead of rendering ad hoc placeholders around charts.
- Use `sx` or `chartSx` only for page-specific layout overrides.

## Overlays

### AppDialog

Path: `src/components/ui/overlays/AppDialog.jsx`  
Use for: Modal dialogs, confirmation flows, forms in popup, focused user actions.  
Replaces: MUI `Dialog`

Props:  
`open: boolean`, `onClose: function`, `title: string | ReactNode`, `subtitle: string | ReactNode`, `children: ReactNode`, `maxWidth: string | false`, `fullWidth: boolean`, `fullScreen: boolean`, `showHeader: boolean`, `showClose: boolean`, `closeOnBackdrop: boolean`, `showActions: boolean`, `actions: ReactNode`, `cancelLabel: string`, `confirmLabel: string`, `onCancel: function`, `onConfirm: function`, `confirmLoading: boolean`, `confirmDisabled: boolean`, `cancelProps: object`, `confirmProps: object`, `headerSx: object`, `contentSx: object`, `actionsSx: object`, `paperSx: object`, `titleSx: object`, `subtitleSx: object`, `...props: object`

Values:  
`maxWidth=xs|sm|md|lg|xl|false`

Example:  
`<AppDialog open={open} onClose={handleClose} title="Edit Record" showActions onConfirm={handleSave}>Content</AppDialog>`

---

### AppDrawer

Path: `src/components/ui/overlays/AppDrawer.jsx`  
Use for: Side drawers, detail panels, filters, quick forms, contextual actions.  
Replaces: MUI `Drawer`

Props:  
`open: boolean`, `onClose: function`, `title: string | ReactNode`, `subtitle: string | ReactNode`, `children: ReactNode`, `anchor: string`, `width: number | string`, `height: number | string`, `showHeader: boolean`, `showClose: boolean`, `closeOnBackdrop: boolean`, `footer: ReactNode`, `showFooter: boolean`, `primaryActionLabel: string`, `secondaryActionLabel: string`, `onPrimaryAction: function`, `onSecondaryAction: function`, `primaryActionProps: object`, `secondaryActionProps: object`, `primaryLoading: boolean`, `primaryDisabled: boolean`, `headerSx: object`, `bodySx: object`, `footerSx: object`, `paperSx: object`, `titleSx: object`, `subtitleSx: object`, `...props: object`

Values:  
`anchor=left|right|top|bottom`

Example:  
`<AppDrawer open={open} onClose={handleClose} title="Filters" showFooter onPrimaryAction={applyFilters}>Content</AppDrawer>`

---

### AppMenu

Path: `src/components/ui/overlays/AppMenu.jsx`  
Use for: Action menus, row actions, kebab menus, compact option lists.  
Replaces: MUI `Menu`

Props:  
`trigger: function | ReactElement`, `triggerIcon: ReactNode`, `triggerTooltip: string`, `triggerProps: object`, `items: array`, `children: ReactNode`, `anchorOrigin: object`, `transformOrigin: object`, `minWidth: number | string`, `maxWidth: number | string`, `dense: boolean`, `closeOnItemClick: boolean`, `disabled: boolean`, `menuSx: object`, `paperSx: object`, `itemSx: object`, `onOpen: function`, `onClose: function`, `...props: object`

Item shape:  
`{ id: string | number, label: string, description: string, icon: ReactNode, endIcon: ReactNode, onClick: function, disabled: boolean, selected: boolean, danger: boolean, type: string, sx: object, closeOnClick: boolean }`

Values:  
`type=divider|label`

Example:  
`<AppMenu items={[{ label: "Edit", onClick: handleEdit }, { label: "Delete", danger: true, onClick: handleDelete }]} />`

---

### AppPopover

Path: `src/components/ui/overlays/AppPopover.jsx`  
Use for: Floating content panels, compact previews, contextual popovers, mini forms.  
Replaces: MUI `Popover`

Props:  
`trigger: function | ReactElement`, `triggerIcon: ReactNode`, `triggerTooltip: string`, `triggerProps: object`, `open: boolean`, `anchorEl: HTMLElement | null`, `onOpen: function`, `onClose: function`, `title: string | ReactNode`, `subtitle: string | ReactNode`, `children: ReactNode`, `showHeader: boolean`, `showClose: boolean`, `footer: ReactNode`, `anchorOrigin: object`, `transformOrigin: object`, `width: number | string`, `maxWidth: number | string`, `maxHeight: number | string`, `closeOnBackdrop: boolean`, `disabled: boolean`, `paperSx: object`, `headerSx: object`, `bodySx: object`, `footerSx: object`, `titleSx: object`, `subtitleSx: object`, `...props: object`

Example:  
`<AppPopover title="Details" showHeader triggerTooltip="View details">Content</AppPopover>`

---

### AppTooltip

Path: `src/components/ui/overlays/AppTooltip.jsx`  
Use for: Hover hints, icon explanations, helper text, compact guidance.  
Replaces: MUI `Tooltip`

Props:  
`children: ReactNode`, `title: string | ReactNode`, `placement: string`, `arrow: boolean`, `enterDelay: number`, `leaveDelay: number`, `disabled: boolean`, `variant: string`, `size: string`, `maxWidth: number | string`, `followCursor: boolean`, `open: boolean`, `onOpen: function`, `onClose: function`, `sx: object`, `slotProps: object`, `...props: object`

Values:  
`variant=default|dark|light|primary|success|error|warning|info`  
`size=small|medium|large`  
`placement=top|bottom|left|right`

Example:  
`<AppTooltip title="Edit record"><AppIconButton icon={<EditIcon />} /></AppTooltip>`

---

### AppAlert

Path: `src/components/ui/overlays/AppAlert.jsx`  
Use for: Inline alerts, form warnings, success/error/info messages, contextual notices.  
Replaces: MUI `Alert`

Props:  
`title: string | ReactNode`, `children: ReactNode`, `severity: string`, `variant: string`, `showIcon: boolean`, `closable: boolean`, `onClose: function`, `icon: ReactNode`, `actions: ReactNode`, `fullWidth: boolean`, `rounded: string`, `dense: boolean`, `visible: boolean`, `sx: object`, `contentSx: object`, `...props: object`

Values:  
`severity=success|error|warning|info`  
`variant=soft|outlined|filled`  
`rounded=sm|md|lg`

Example:  
`<AppAlert severity="success" title="Saved">Your changes were saved successfully.</AppAlert>`

---

### AppToast

Path: `src/components/ui/overlays/AppToast.jsx`  
Use for: Toast notifications, transient success/error/warning/info feedback.  
Replaces: MUI `Snackbar`

Props:  
`open: boolean`, `onClose: function`, `title: string | ReactNode`, `message: string | ReactNode`, `children: ReactNode`, `severity: string`, `variant: string`, `position: string`, `autoHideDuration: number`, `showIcon: boolean`, `closable: boolean`, `icon: ReactNode`, `actions: ReactNode`, `rounded: string`, `dense: boolean`, `fullWidth: boolean`, `disableClickAway: boolean`, `transition: ReactElementType`, `sx: object`, `alertSx: object`, `contentSx: object`, `...props: object`

Values:  
`severity=success|error|warning|info`  
`variant=soft|outlined|filled`  
`position=top-right|top-left|bottom-right|bottom-left|top-center|bottom-center`

Example:  
`<AppToast open={open} onClose={handleClose} severity="success" message="Saved successfully" />`

---

### AppConfirmModal

Path: `src/components/ui/overlays/AppConfirmModal.jsx`  
Use for: Delete confirmations, destructive actions, approval prompts, irreversible action warnings.  
Built with: `AppDialog`, `AppButton`, `AppLoadingButton`

Props:  
`open: boolean`, `onClose: function`, `onConfirm: function`, `onCancel: function`, `title: string | ReactNode`, `message: string | ReactNode`, `description: string | ReactNode`, `variant: string`, `icon: ReactNode`, `showIcon: boolean`, `confirmLabel: string`, `cancelLabel: string`, `loading: boolean`, `confirmDisabled: boolean`, `cancelDisabled: boolean`, `closeOnBackdrop: boolean`, `maxWidth: string | false`, `fullWidth: boolean`, `contentSx: object`, `iconSx: object`, `messageSx: object`, `descriptionSx: object`, `cancelProps: object`, `confirmProps: object`, `...props: object`

Values:  
`variant=warning|error|info|success`

Example:  
`<AppConfirmModal open={open} variant="error" confirmLabel="Delete" onConfirm={handleDelete} />`

---

### AppSidePanel

Path: `src/components/ui/overlays/AppSidePanel.jsx`  
Use for: Right-side edit panels, create forms, details panels, persistent drawer workflows.  
Built with: `AppDrawer`, `AppButton`

Props:  
`open: boolean`, `onClose: function`, `title: string | ReactNode`, `subtitle: string | ReactNode`, `children: ReactNode`, `anchor: string`, `width: number | string`, `showHeader: boolean`, `showClose: boolean`, `closeOnBackdrop: boolean`, `showFooter: boolean`, `footer: ReactNode`, `primaryActionLabel: string`, `secondaryActionLabel: string`, `onPrimaryAction: function`, `onSecondaryAction: function`, `primaryLoading: boolean`, `primaryDisabled: boolean`, `secondaryDisabled: boolean`, `primaryActionProps: object`, `secondaryActionProps: object`, `contentPadding: number | string`, `stickyFooter: boolean`, `bodySx: object`, `footerSx: object`, `paperSx: object`, `...props: object`

Values:  
`anchor=left|right|top|bottom`

Example:  
`<AppSidePanel open={open} onClose={handleClose} title="Create User" onPrimaryAction={handleSubmit}>Form</AppSidePanel>`

---

### AppDropdown

Path: `src/components/ui/overlays/AppDropdown.jsx`  
Use for: Dropdown buttons, icon dropdowns, custom trigger menus, action selectors.  
Built with: `AppButton`, `AppIconButton`, `AppMenu`

Props:  
`label: string`, `icon: ReactNode`, `items: array`, `children: ReactNode`, `triggerType: string`, `trigger: function | ReactElement`, `variant: string`, `colorVariant: string`, `size: string`, `rounded: string`, `disabled: boolean`, `loading: boolean`, `buttonProps: object`, `iconButtonProps: object`, `menuMinWidth: number | string`, `menuMaxWidth: number | string`, `closeOnItemClick: boolean`, `endIcon: ReactNode`, `...props: object`

Values:  
`triggerType=button|icon|custom`  
`variant=contained|outlined|text|soft|gradient`  
`colorVariant=primary|success|error|warning|info|dark`  
`size=small|medium|large`  
`rounded=sm|md|lg`

Example:  
`<AppDropdown label="Actions" items={[{ label: "Edit", onClick: handleEdit }]} />`

---

### Overlay AI Rules

- Use `AppDialog` for modal workflows instead of raw MUI `Dialog`.
- Use `AppDrawer` for generic drawers and `AppSidePanel` for form/detail side panels.
- Use `AppMenu` for action menus and row menus.
- Use `AppDropdown` when the menu needs a button, icon, or custom dropdown trigger.
- Use `AppPopover` for floating contextual content richer than a menu.
- Use `AppTooltip` for hover-only helper text.
- Use `AppAlert` for inline status messages.
- Use `AppToast` for temporary global feedback messages.
- Use `AppConfirmModal` for confirmation flows, especially destructive actions.
- Never use raw MUI `Dialog`, `Drawer`, `Menu`, `Popover`, `Tooltip`, `Alert`, or `Snackbar` in pages when these wrappers fit.
- Prefer component props like `variant`, `severity`, `colorVariant`, `size`, `rounded`, `loading`, and `disabled` before custom styles.
- Pass functions only to event props like `onClose`, `onConfirm`, `onCancel`, `onOpen`, and `onClick`.
- Pass React elements only to visual props like `icon`, `triggerIcon`, `endIcon`, `actions`, and `footer`.
- Pass objects only to style/config props like `sx`, `paperSx`, `bodySx`, `headerSx`, `footerSx`, `contentSx`, `slotProps`, `buttonProps`, and `iconButtonProps`.
- Do not hardcode colors inside pages; use theme tokens, component props, or CSS variables.
- Use `closeOnBackdrop={false}` for critical confirmation or unsaved-change flows.

## Feedback

### AppLoader

Path: `src/components/ui/feedback/AppLoader.jsx`  
Use for: Loading indicators, async page states, section loaders, inline loading feedback.  
Replaces: Raw MUI `CircularProgress` usage in pages.

Props:  
`size: string`, `variant: string`, `colorVariant: string`, `text: string`, `fullScreen: boolean`, `center: boolean`, `overlay: boolean`, `thickness: number`, `sx: object`, `textSx: object`

Values:  
`size=small|medium|large|page|fullscreen`, `variant=spinner|dots|pulse`, `colorVariant=primary|success|error|warning|info`

Example:  
`<AppLoader size="page" text="Loading data..." />`

---

### AppSkeleton

Path: `src/components/ui/feedback/AppSkeleton.jsx`  
Use for: Generic skeleton placeholders, text placeholders, avatar placeholders, card/content loading blocks.  
Replaces: Raw MUI `Skeleton` usage in pages.

Props:  
`variant: string`, `width: number | string | array`, `height: number | string`, `count: number`, `gap: number | string`, `animation: string | false`, `rounded: boolean`, `colorVariant: string`, `fullWidth: boolean`, `sx: object`, `itemSx: object`

Values:  
`variant=text|circular|rectangular|rounded`, `animation=pulse|wave|false`, `colorVariant=default|primary|success|error|warning|info`

Example:  
`<AppSkeleton variant="text" count={3} />`

---

### AppTableSkeleton

Path: `src/components/ui/feedback/AppTableSkeleton.jsx`  
Use for: Table loading states, data-grid placeholders, list-table skeleton screens.

Props:  
`rows: number`, `columns: number`, `showHeader: boolean`, `showToolbar: boolean`, `rowHeight: number`, `headerHeight: number`, `toolbarHeight: number`, `gap: number | string`, `rounded: boolean`, `sx: object`

Example:  
`<AppTableSkeleton rows={8} columns={5} showToolbar />`

---

### AppEmptyState

Path: `src/components/ui/feedback/AppEmptyState.jsx`  
Use for: Empty lists, no records, no search results, blank dashboard states, first-use states.

Props:  
`title: string | ReactNode`, `description: string | ReactNode`, `icon: ReactNode`, `action: ReactNode`, `size: string`, `align: string`, `fullHeight: boolean`, `sx: object`

Values:  
`size=small|medium|large|page`, `align=center|left`

Example:  
`<AppEmptyState title="No records found" description="Try changing your filters." />`

---

### AppPageLoader

Path: `src/components/ui/feedback/AppPageLoader.jsx`  
Use for: Full-page loading states, route-level loading, dashboard/page fetching states.  
Built with: `AppLoader`

Props:  
`text: string`, `variant: string`, `colorVariant: string`, `overlay: boolean`, `fullScreen: boolean`, `sx: object`

Values:  
`variant=spinner|dots|pulse`, `colorVariant=primary|success|error|warning|info`

Example:  
`<AppPageLoader text="Loading page..." />`

---

### AppInlineLoader

Path: `src/components/ui/feedback/AppInlineLoader.jsx`  
Use for: Inline loading states inside buttons, labels, table cells, compact async content.  
Built with: `AppLoader`

Props:  
`text: string`, `variant: string`, `colorVariant: string`, `size: string`, `direction: string`, `sx: object`, `textSx: object`

Values:  
`variant=spinner|dots|pulse`, `colorVariant=primary|success|error|warning|info`, `size=small|medium`, `direction=row|column`

Example:  
`<AppInlineLoader text="Checking..." size="small" />`

---

### AppErrorState

Path: `src/components/ui/feedback/AppErrorState.jsx`  
Use for: Error screens, failed data fetch states, retryable page or section errors.  
Built with: `AppEmptyState`, `AppButton`

Props:  
`title: string | ReactNode`, `description: string | ReactNode`, `actionText: string`, `onRetry: function`, `showAction: boolean`, `size: string`, `fullHeight: boolean`, `sx: object`

Values:  
`size=small|medium|large|page`

Example:  
`<AppErrorState onRetry={fetchData} />`

---

### AppNoPermission

Path: `src/components/ui/feedback/AppNoPermission.jsx`  
Use for: Access denied screens, restricted pages, role/permission-based blocked states.  
Built with: `AppEmptyState`, `AppButton`

Props:  
`title: string | ReactNode`, `description: string | ReactNode`, `actionText: string`, `onAction: function`, `showAction: boolean`, `size: string`, `fullHeight: boolean`, `sx: object`

Values:  
`size=small|medium|large|page`

Example:  
`<AppNoPermission showAction onAction={goBack} />`

---

### AppNotFoundState

Path: `src/components/ui/feedback/AppNotFoundState.jsx`  
Use for: 404 pages, missing resources, deleted records, invalid route states.  
Built with: `AppEmptyState`, `AppButton`

Props:  
`title: string | ReactNode`, `description: string | ReactNode`, `actionText: string`, `onAction: function`, `showAction: boolean`, `size: string`, `fullHeight: boolean`, `sx: object`

Values:  
`size=small|medium|large|page`

Example:  
`<AppNotFoundState onAction={goToDashboard} />`

---

### AppCardSkeleton

Path: `src/components/ui/feedback/AppCardSkeleton.jsx`  
Use for: Card loading states, profile card placeholders, dashboard card skeletons.

Props:  
`showAvatar: boolean`, `showActions: boolean`, `lines: number`, `sx: object`

Example:  
`<AppCardSkeleton showAvatar lines={4} />`

---

### AppFormSkeleton

Path: `src/components/ui/feedback/AppFormSkeleton.jsx`  
Use for: Form loading states, edit/create form placeholders, detail form skeletons.

Props:  
`fields: number`, `showHeader: boolean`, `showActions: boolean`, `sx: object`

Example:  
`<AppFormSkeleton fields={6} />`

---

### Feedback AI Rules

- Use `AppLoader` for reusable loading indicators instead of raw `CircularProgress`.
- Use `AppPageLoader` for route-level or full-page loading states.
- Use `AppInlineLoader` for compact inline loading inside content.
- Use `AppSkeleton` for simple reusable skeleton placeholders.
- Use `AppTableSkeleton` for table or data-grid loading states.
- Use `AppCardSkeleton` for card loading placeholders.
- Use `AppFormSkeleton` for form loading placeholders.
- Use `AppEmptyState` for generic empty data states.
- Use `AppErrorState` for retryable error states.
- Use `AppNoPermission` for restricted access states.
- Use `AppNotFoundState` for missing resource or 404 states.
- Do not use raw MUI `CircularProgress` or `Skeleton` in pages when these wrappers fit.
- Prefer `loading`, `emptyText`, `AppLoader`, `AppSkeleton`, and state components over ad hoc placeholders.
- Pass functions only to event props like `onRetry` and `onAction`.
- Pass React elements only to visual props like `icon` and `action`.
- Pass objects only to style props like `sx`, `textSx`, and `itemSx`.
- Do not hardcode colors inside pages; use theme tokens, component props, or CSS variables.

## Navigation

### AppTabs

Path: `src/components/ui/navigation/AppTabs.jsx`  
Use for: Page tabs, section tabs, settings tabs, segmented navigation with optional panels.  
Replaces: MUI `Tabs` and `Tab` in pages.

Props:  
`tabs: array`, `value: string | number`, `onChange: function`, `variant: string`, `colorVariant: string`, `size: string`, `rounded: string`, `fullWidth: boolean`, `centered: boolean`, `scrollable: boolean`, `showPanels: boolean`, `panelSx: object`, `disabled: boolean`, `elevation: boolean`, `stretch: boolean`, `tabMinWidth: number | string`, `sx: object`, `tabsSx: object`, `tabSx: object`, `...props: object`

Tab shape:  
`{ label: string, value: string | number, icon: ReactNode, badge: string | number, disabled: boolean, panel: ReactNode }`

Values:  
`variant=line|pills|soft|enclosed|text`, `colorVariant=primary|success|error|warning|info|dark|neutral`, `size=small|medium|large`, `rounded=sm|md|lg|full`

Example:  
`<AppTabs value={tab} onChange={setTab} tabs={[{ label: "Overview", value: "overview" }]} />`

---

### AppVerticalTabs

Path: `src/components/ui/navigation/AppVerticalTabs.jsx`  
Use for: Sidebar tab navigation, settings sections, account panels, vertical section switching.

Props:  
`tabs: array`, `value: string | number`, `onChange: function`, `variant: string`, `colorVariant: string`, `size: string`, `showPanels: boolean`, `fullHeight: boolean`, `width: number | string`, `contentWidth: number | string`, `disabled: boolean`, `showShortcuts: boolean`, `sx: object`, `tabsSx: object`, `tabSx: object`, `panelSx: object`

Tab shape:  
`{ label: string, value: string | number, description: string, icon: ReactNode, badge: string | number, shortcut: string, disabled: boolean, panel: ReactNode }`

Values:  
`variant=soft|line|pills|cards`, `colorVariant=primary|success|error|warning|info|neutral`, `size=small|medium|large`

Example:  
`<AppVerticalTabs value={section} onChange={setSection} tabs={[{ label: "Profile", value: "profile", panel: <Profile /> }]} />`

---

### AppBreadcrumb

Path: `src/components/ui/navigation/AppBreadcrumb.jsx`  
Use for: Breadcrumb navigation, page hierarchy, route trails, parent-child navigation paths.  
Replaces: MUI `Breadcrumbs` usage in pages.

Props:  
`items: array`, `variant: string`, `colorVariant: string`, `size: string`, `rounded: string`, `separator: ReactNode`, `maxItems: number`, `showHome: boolean`, `homeLabel: string`, `homeHref: string`, `homeIcon: ReactNode`, `onHomeClick: function`, `disabled: boolean`, `capitalize: boolean`, `elevation: boolean`, `sx: object`, `itemSx: object`, `currentItemSx: object`, `...props: object`

Item shape:  
`{ label: string, href: string, icon: ReactNode, onClick: function, disabled: boolean, current: boolean }`

Values:  
`variant=text|soft|contained|outlined`, `colorVariant=primary|success|error|warning|info|dark|neutral`, `size=small|medium|large`, `rounded=sm|md|lg|full`

Example:  
`<AppBreadcrumb showHome items={[{ label: "Users", href: "/users" }, { label: "Edit", current: true }]} />`

---

### AppSearchCommand

Path: `src/components/ui/navigation/AppSearchCommand.jsx`  
Use for: Command palette, global search, keyboard shortcuts, quick navigation, searchable app actions.

Props:  
`open: boolean`, `defaultOpen: boolean`, `onOpenChange: function`, `items: array`, `title: string`, `placeholder: string`, `emptyText: string`, `shortcutLabel: string`, `showShortcutHint: boolean`, `closeOnSelect: boolean`, `disableAutoFocus: boolean`, `maxHeight: number | string`, `width: number | string`, `filterFn: function`, `initialQuery: string`, `showGroups: boolean`, `loopNavigation: boolean`, `sx: object`, `dialogProps: object`, `contentSx: object`, `inputProps: object`

Item shape:  
`{ key: string, label: string, description: string, group: string, icon: ReactNode, shortcut: string, keywords: array, color: string, disabled: boolean, onSelect: function }`

Values:  
`color=primary|success|error|warning|info|neutral`

Example:  
`<AppSearchCommand items={[{ label: "Create user", group: "Actions", shortcut: "C", onSelect: handleCreate }]} />`

---

### AppShortcutHint

Path: `src/components/ui/navigation/AppShortcutHint.jsx`  
Use for: Keyboard shortcut labels, command hints, action shortcuts, compact key combinations.

Props:  
`keys: string | array`, `size: string`, `variant: string`, `colorVariant: string`, `rounded: string`, `separator: string | ReactNode`, `sx: object`, `keySx: object`

Values:  
`size=small|medium|large`, `variant=soft|outlined|filled|text`, `colorVariant=primary|success|error|warning|info|dark|neutral`, `rounded=sm|md|lg|full`

Example:  
`<AppShortcutHint keys={["Ctrl", "K"]} />`

---

### AppScrollToTop

Path: `src/components/ui/navigation/AppScrollToTop.jsx`  
Use for: Floating scroll-to-top buttons, long page navigation, back-to-top page actions.

Props:  
`threshold: number`, `position: string`, `behavior: string`, `icon: ReactNode`, `tooltip: string`, `colorVariant: string`, `variant: string`, `size: string`, `rounded: string`, `container: Window | HTMLElement`, `sx: object`, `buttonSx: object`

Values:  
`position=bottom-right|bottom-left|top-right|top-left`, `behavior=smooth|auto`, `colorVariant=primary|success|error|warning|info|dark|neutral`, `variant=contained|outlined|soft|text`, `size=small|medium|large`, `rounded=sm|md|lg|full`

Example:  
`<AppScrollToTop threshold={300} />`

---

### AppStickyBar

Path: `src/components/ui/navigation/AppStickyBar.jsx`  
Use for: Sticky headers, sticky footers, filter bars, action bars, page toolbar sections.

Props:  
`children: ReactNode`, `left: ReactNode`, `center: ReactNode`, `right: ReactNode`, `position: string`, `variant: string`, `rounded: string`, `elevation: boolean`, `blur: boolean`, `divider: boolean`, `fullWidth: boolean`, `maxWidth: number | string`, `offsetTop: number | string`, `offsetBottom: number | string`, `zIndex: number`, `padding: number | string`, `minHeight: number | string`, `containerSx: object`, `contentSx: object`, `sx: object`, `...props: object`

Values:  
`position=top|bottom`, `variant=surface|soft|bordered|transparent`, `rounded=none|sm|md|lg|full`

Example:  
`<AppStickyBar left={<PageTitle />} right={<AppButton>Save</AppButton>} />`

---

### AppStepper

Path: `src/components/ui/navigation/AppStepper.jsx`  
Use for: Multi-step forms, onboarding progress, checkout steps, workflow status indicators.

Props:  
`steps: array`, `activeStep: number`, `orientation: string`, `clickable: boolean`, `showDescription: boolean`, `showStepNumber: boolean`, `onStepClick: function`, `size: string`, `sx: object`

Step shape:  
`{ id: string | number, label: string, description: string, status: string, disabled: boolean }`

Values:  
`orientation=horizontal|vertical`, `size=small|medium|large`, `status=completed|active|pending|error`

Example:  
`<AppStepper activeStep={1} steps={[{ label: "Details" }, { label: "Review" }, { label: "Submit" }]} />`

---

### Navigation AI Rules

- Use `AppTabs` for horizontal tab navigation instead of raw MUI `Tabs`.
- Use `AppVerticalTabs` for sidebar-style tab navigation.
- Use `AppBreadcrumb` for route hierarchy and parent-child page trails.
- Use `AppSearchCommand` for command palettes, global search, and quick app actions.
- Use `AppShortcutHint` for keyboard shortcut labels.
- Use `AppScrollToTop` for long pages that need quick return navigation.
- Use `AppStickyBar` for sticky page headers, filters, and action bars.
- Use `AppStepper` for multi-step workflows instead of custom step indicators.
- Do not use raw MUI `Tabs`, `Tab`, or `Breadcrumbs` in pages when these wrappers fit.
- Pass functions only to event props like `onChange`, `onStepClick`, `onOpenChange`, `onHomeClick`, and `onSelect`.
- Pass React elements only to visual props like `icon`, `homeIcon`, `left`, `center`, `right`, `children`, and `panel`.
- Pass objects only to style/config props like `sx`, `tabsSx`, `tabSx`, `panelSx`, `dialogProps`, `contentSx`, `inputProps`, `containerSx`, and `buttonSx`.
- Keep navigation data normalized as arrays of objects.
- Do not hardcode colors inside pages; use `colorVariant`, theme tokens, or CSS variables.

## Data Display

### AppBadge

Path: `src/components/ui/data-display/AppBadge.jsx`  
Use for: Status labels, count badges, category pills, metadata indicators, compact labels.  
Replaces: Raw MUI `Chip` or custom badge spans in pages.

Props:  
`label: string | number | ReactNode`, `children: ReactNode`, `variant: string`, `colorVariant: string`, `size: string`, `rounded: string`, `dot: boolean`, `startIcon: ReactNode`, `endIcon: ReactNode`, `removable: boolean`, `onDelete: function`, `clickable: boolean`, `onClick: function`, `disabled: boolean`, `sx: object`, `...props: object`

Values:  
`variant=soft|contained|outlined|text`, `colorVariant=primary|success|error|warning|info|dark|neutral`, `size=small|medium|large`, `rounded=sm|md|lg|full`

Example:  
`<AppBadge label="Active" colorVariant="success" variant="soft" />`

---

### AppCard

Path: `src/components/ui/data-display/AppCard.jsx`  
Use for: Content containers, dashboard sections, form sections, list cards, grouped data blocks.  
Replaces: Raw MUI `Card`, `Paper`, or repeated bordered `Box` containers in pages.

Props:  
`children: ReactNode`, `title: string | ReactNode`, `subtitle: string | ReactNode`, `action: ReactNode`, `footer: ReactNode`, `variant: string`, `padding: string`, `rounded: string`, `shadow: string`, `bordered: boolean`, `hoverable: boolean`, `clickable: boolean`, `onClick: function`, `fullHeight: boolean`, `sx: object`, `headerSx: object`, `contentSx: object`, `footerSx: object`, `...props: object`

Values:  
`variant=default|soft|outlined|ghost`, `padding=none|xs|sm|md|lg`, `rounded=sm|md|lg|xl`, `shadow=none|xs|sm|md|lg`

Example:  
`<AppCard title="Customer Details" padding="md" rounded="lg">Content</AppCard>`

---

### AppPagination

Path: `src/components/ui/data-display/AppPagination.jsx`  
Use for: Table pagination, list pagination, page navigation, server-side paged data controls.  
Replaces: Raw MUI `Pagination` or custom pagination controls in pages.

Props:  
`page: number`, `count: number`, `total: number`, `rowsPerPage: number`, `rowsPerPageOptions: array`, `onPageChange: function`, `onRowsPerPageChange: function`, `showRowsPerPage: boolean`, `showTotal: boolean`, `variant: string`, `shape: string`, `size: string`, `colorVariant: string`, `disabled: boolean`, `sx: object`, `paginationSx: object`, `selectSx: object`, `...props: object`

Values:  
`variant=text|outlined|contained`, `shape=circular|rounded`, `size=small|medium|large`, `colorVariant=primary|success|error|warning|info|dark|neutral`

Example:  
`<AppPagination page={page} count={10} onPageChange={setPage} />`

---

### AppAvatar

Path: `src/components/ui/data-display/AppAvatar.jsx`  
Use for: User avatars, profile images, initials, compact identity display.  
Replaces: Raw MUI `Avatar` usage in pages.

Props:  
`src: string`, `alt: string`, `name: string`, `initials: string`, `icon: ReactNode`, `size: string`, `colorVariant: string`, `variant: string`, `bordered: boolean`, `status: string`, `statusColor: string`, `showStatus: boolean`, `clickable: boolean`, `onClick: function`, `sx: object`, `imgProps: object`, `...props: object`

Values:  
`size=xs|small|medium|large|xl`, `colorVariant=primary|success|error|warning|info|dark|neutral`, `variant=circular|rounded|square`, `status=online|offline|busy|away`, `statusColor=success|error|warning|neutral`

Example:  
`<AppAvatar name="Rahul Sharma" size="medium" />`

---

### AppAvatarGroup

Path: `src/components/ui/data-display/AppAvatarGroup.jsx`  
Use for: User groups, assignee lists, team members, participants, compact avatar stacks.  
Built with: `AppAvatar`

Props:  
`items: array`, `max: number`, `size: string`, `spacing: number`, `showTooltip: boolean`, `bordered: boolean`, `onClick: function`, `sx: object`

Item shape:  
`{ id: string | number, name: string, src: string, alt: string, initials: string, icon: ReactNode, colorVariant: string, sx: object }`

Values:  
`size=xs|small|medium|large|xl`

Example:  
`<AppAvatarGroup items={teamMembers} max={4} size="small" />`

---

### AppStatusBadge

Path: `src/components/ui/data-display/AppStatusBadge.jsx`  
Use for: Record statuses, approval states, workflow states, active/inactive indicators.  
Built with: `AppBadge`

Props:  
`status: string`, `label: string | ReactNode`, `size: string`, `variant: string`, `rounded: string`, `showDot: boolean`, `showIcon: boolean`, `sx: object`, `...props: object`

Values:  
`status=active|inactive|pending|approved|rejected|draft|blocked|completed|failed|processing`, `size=small|medium|large`, `variant=soft|contained|outlined|text`, `rounded=sm|md|lg|full`

Example:  
`<AppStatusBadge status="approved" />`

---

### AppTag

Path: `src/components/ui/data-display/AppTag.jsx`  
Use for: Tags, labels, categories, removable filters, clickable metadata pills.  
Built with: `AppBadge`

Props:  
`label: string | number | ReactNode`, `children: ReactNode`, `colorVariant: string`, `variant: string`, `size: string`, `rounded: string`, `removable: boolean`, `onDelete: function`, `clickable: boolean`, `onClick: function`, `showIcon: boolean`, `icon: ReactNode`, `disabled: boolean`, `sx: object`, `...props: object`

Values:  
`variant=soft|contained|outlined|text`, `colorVariant=primary|success|error|warning|info|dark|neutral`, `size=small|medium|large`, `rounded=sm|md|lg|full`

Example:  
`<AppTag label="Frontend" removable onDelete={handleRemove} />`

---

### AppInfoCard

Path: `src/components/ui/data-display/AppInfoCard.jsx`  
Use for: Informational cards, contextual notes, help blocks, summary callouts, guidance panels.  
Built with: `AppCard`, `AppBadge`

Props:  
`title: string | ReactNode`, `description: string | ReactNode`, `icon: ReactNode`, `badge: string | ReactNode`, `badgeColor: string`, `colorVariant: string`, `action: ReactNode`, `children: ReactNode`, `variant: string`, `sx: object`, `iconSx: object`

Values:  
`variant=default|outlined|soft|ghost`, `colorVariant=primary|success|error|warning|info`, `badgeColor=primary|success|error|warning|info|dark|neutral`

Example:  
`<AppInfoCard title="Note" description="This setting affects all users." colorVariant="info" />`

---

### AppStatCard

Path: `src/components/ui/data-display/AppStatCard.jsx`  
Use for: Dashboard metrics, statistic cards, quick summaries, KPI-like display cards.  
Built with: `AppCard`, `AppBadge`

Props:  
`title: string | ReactNode`, `value: string | number | ReactNode`, `subtitle: string | ReactNode`, `icon: ReactNode`, `trend: string`, `trendValue: string | number | ReactNode`, `colorVariant: string`, `variant: string`, `loading: boolean`, `sx: object`, `iconSx: object`

Values:  
`trend=up|down|neutral`, `colorVariant=primary|success|error|warning|info`, `variant=default|soft|outlined`

Example:  
`<AppStatCard title="Orders" value="1,240" trend="up" trendValue="+8%" colorVariant="success" />`

---

### AppTimeline

Path: `src/components/ui/data-display/AppTimeline.jsx`  
Use for: Activity history, audit trails, order tracking, workflow events, chronological logs.

Props:  
`items: array`, `variant: string`, `size: string`, `colorVariant: string`, `showConnector: boolean`, `align: string`, `dense: boolean`, `sx: object`, `itemSx: object`, `dotSx: object`, `contentSx: object`

Item shape:  
`{ id: string | number, title: string | ReactNode, description: string | ReactNode, time: string | ReactNode, icon: ReactNode, colorVariant: string, dotColor: string, action: ReactNode, sx: object }`

Values:  
`variant=default|outlined|filled|soft`, `size=small|medium|large`, `colorVariant=primary|success|error|warning|info|dark|neutral`, `align=left|right|alternate`

Example:  
`<AppTimeline items={[{ title: "Created", description: "Record was created", time: "Today" }]} />`

---

### AppDescriptionList

Path: `src/components/ui/data-display/AppDescriptionList.jsx`  
Use for: Detail views, read-only record information, profile details, invoice metadata, key-value grids.  
Built with: `AppKeyValue`, `AppCard`

Props:  
`items: array`, `columns: number | string`, `variant: string`, `size: string`, `bordered: boolean`, `striped: boolean`, `dense: boolean`, `labelWidth: number | string`, `align: string`, `sx: object`, `itemSx: object`

Item shape:  
`{ key: string | number, label: string | ReactNode, value: string | number | ReactNode, icon: ReactNode, badge: string | ReactNode, badgeColor: string, props: object, sx: object }`

Values:  
`columns=1|2|3|4`, `variant=default|card`, `size=small|medium|large`, `align=start|center|end|space-between`

Example:  
`<AppDescriptionList columns={2} items={[{ label: "Email", value: user.email }]} />`

---

### AppKeyValue

Path: `src/components/ui/data-display/AppKeyValue.jsx`  
Use for: Single label-value pairs, metadata rows, compact detail fields, inline data summaries.  
Built with: `AppBadge`

Props:  
`label: string | ReactNode`, `value: string | number | ReactNode`, `icon: ReactNode`, `badge: string | ReactNode`, `badgeColor: string`, `direction: string`, `align: string`, `size: string`, `muted: boolean`, `ellipsis: boolean`, `sx: object`, `labelSx: object`, `valueSx: object`

Values:  
`direction=row|column`, `align=start|center|end|space-between`, `size=small|medium|large`, `badgeColor=primary|success|error|warning|info|dark|neutral`

Example:  
`<AppKeyValue label="Invoice No" value="INV-1024" badge="Paid" badgeColor="success" />`

---

### AppAccordion

Path: `src/components/ui/data-display/AppAccordion.jsx`  
Use for: Expandable sections, FAQ lists, collapsible details, grouped settings, nested content blocks.  
Replaces: Raw MUI `Accordion` usage in pages.

Props:  
`items: array`, `defaultExpanded: string | number | array`, `expanded: string | number | array`, `onChange: function`, `multiple: boolean`, `variant: string`, `size: string`, `rounded: string`, `elevation: boolean`, `disabled: boolean`, `showDivider: boolean`, `sx: object`, `itemSx: object`, `summarySx: object`, `detailsSx: object`, `...props: object`

Item shape:  
`{ id: string | number, title: string | ReactNode, subtitle: string | ReactNode, content: ReactNode, icon: ReactNode, action: ReactNode, disabled: boolean, sx: object }`

Values:  
`variant=default|soft|outlined|ghost`, `size=small|medium|large`, `rounded=sm|md|lg|xl`

Example:  
`<AppAccordion items={[{ id: "details", title: "Details", content: <Details /> }]} />`

---

### Data Display AI Rules

- Use `AppBadge` for compact labels, statuses, counts, and pills instead of raw MUI `Chip`.
- Use `AppStatusBadge` for known workflow/status values like active, pending, approved, failed, or processing.
- Use `AppTag` for tags, categories, filters, and removable labels.
- Use `AppCard` for reusable content containers instead of raw MUI `Card`, `Paper`, or repeated bordered `Box` layouts.
- Use `AppInfoCard` for contextual notes, information blocks, and help callouts.
- Use `AppStatCard` for compact dashboard metrics when a full chart KPI card is not needed.
- Use `AppAvatar` for user/profile display.
- Use `AppAvatarGroup` for grouped users, teams, assignees, or participants.
- Use `AppPagination` for paginated lists and tables.
- Use `AppTimeline` for activity history, logs, tracking, and chronological events.
- Use `AppDescriptionList` for read-only detail grids.
- Use `AppKeyValue` for individual label-value pairs.
- Use `AppAccordion` for collapsible sections instead of raw MUI `Accordion`.
- Do not use raw MUI `Chip`, `Card`, `Paper`, `Avatar`, `Pagination`, or `Accordion` in pages when these wrappers fit.
- Prefer component props like `variant`, `colorVariant`, `size`, `rounded`, `loading`, and `disabled` before custom styling.
- Pass functions only to event props like `onClick`, `onDelete`, `onChange`, and pagination handlers.
- Pass React elements only to visual/content props like `icon`, `action`, `children`, `footer`, `content`, and `title`.
- Pass objects only to style/config props like `sx`, `itemSx`, `iconSx`, `labelSx`, `valueSx`, `summarySx`, and `detailsSx`.
- Keep display data normalized as arrays of objects for `items`, timeline entries, accordion rows, avatar groups, and description lists.
- Do not hardcode colors inside pages; use `colorVariant`, theme tokens, or CSS variables.
