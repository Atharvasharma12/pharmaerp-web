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

---

## Charts

### AppKpiCard

Path: `src/components/charts/AppKpiCard.jsx`  
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

Path: `src/components/charts/AppBarChart.jsx`  
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

Path: `src/components/charts/AppLineChart.jsx`  
Use for: Trends over time, analytics timelines, comparative growth charts, and activity monitoring.  
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

Path: `src/components/charts/AppAreaChart.jsx`  
Use for: Filled trend charts, cumulative metrics, stacked area comparisons, and volume-over-time visuals.  
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

Path: `src/components/charts/AppPieChart.jsx`  
Use for: Category distribution, percentage breakdowns, donut charts, and single-series share visuals.  
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

### AppDonutChart

Path: `src/components/charts/AppDonutChart.jsx`  
Use for: Donut charts, center-labeled distribution charts, part-to-whole breakdowns, percentage summaries, and dashboard share visuals.  
Replaces: Direct `@mui/x-charts/PieChart` usage for donut-specific charts.

Props:  
`data: array`, `title: string | ReactNode`, `subtitle: string | ReactNode`, `height: number`, `innerRadius: number`, `outerRadius: number`, `paddingAngle: number`, `cornerRadius: number`, `startAngle: number`, `endAngle: number`, `centerLabel: string | ReactNode`, `centerValue: string | number | ReactNode`, `centerSubtitle: string | ReactNode`, `showLegend: boolean`, `showLabels: boolean`, `labelType: string`, `loading: boolean`, `emptyText: string`, `valueFormatter: function`, `sx: object`, `chartSx: object`

Data shape:  
`{ id: string | number, label: string, value: number, colorVariant: string, color: string }`

Values:  
`labelType=value|percent|both`, `colorVariant=primary|success|error|warning|info|dark|neutral`, `showLegend=true|false`, `showLabels=true|false`, `loading=true|false`

Example:  
`<AppDonutChart title="Users by Status" centerLabel="Total" centerValue={1200} data={statusData} />`

---

### AppSparkline

Path: `src/components/charts/AppSparkline.jsx`  
Use for: Compact trend charts, mini dashboard charts, KPI card trends, activity sparklines, and small inline analytics visuals.  
Replaces: Direct `@mui/x-charts/SparkLineChart` usage in pages.

Props:  
`data: array`, `xData: array`, `title: string | ReactNode`, `value: string | number | ReactNode`, `subtitle: string | ReactNode`, `footer: string | ReactNode`, `height: number`, `width: number | string`, `colorVariant: string`, `variant: string`, `showArea: boolean`, `showTooltip: boolean`, `showHighlight: boolean`, `trend: object`, `loading: boolean`, `emptyText: string`, `valueFormatter: function`, `sx: object`, `chartSx: object`

Data shape:  
`number[]` or `{ value: number, label: string, date: string, name: string }[]`

Trend shape:  
`{ value: string | number, direction: string, label: string }`

Values:  
`variant=line|area|bar`, `colorVariant=primary|success|error|warning|info|dark|neutral`, `trend.direction=up|down|neutral`, `showArea=true|false`, `showTooltip=true|false`, `showHighlight=true|false`, `loading=true|false`

Example:  
`<AppSparkline title="Visitors" value="24.5k" data={[10, 14, 18, 16, 22]} trend={{ value: "+8%", direction: "up", label: "this week" }} />`

---

### Chart AI Rules

- Use `AppKpiCard` for single metrics before building custom stat cards.
- Use `AppBarChart` for category comparisons, grouped bars, stacked totals, and horizontal ranking charts.
- Use `AppLineChart` for trend lines and time-series comparisons.
- Use `AppAreaChart` for filled trend charts and stacked volume/cumulative views.
- Use `AppPieChart` for simple part-to-whole distribution charts.
- Use `AppDonutChart` when the chart needs a center label, center value, or donut-specific layout.
- Use `AppSparkline` for compact metric trends and mini chart previews.
- Do not use raw `@mui/x-charts` components directly in pages when these wrappers fit.
- Pass semantic chart colors through `colorVariant`; avoid hardcoded colors in page code.
- Keep chart data normalized as arrays of objects and configure series through `bars`, `lines`, `areas`, or pie/donut data.
- Use simple number arrays or `{ value, label }` arrays for `AppSparkline`.
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
`variant=default|dark|light|primary|success|error|warning|info`, `size=small|medium|large`, `placement=top|bottom|left|right`

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
`severity=success|error|warning|info`, `variant=soft|outlined|filled`, `rounded=sm|md|lg`

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
`severity=success|error|warning|info`, `variant=soft|outlined|filled`, `position=top-right|top-left|bottom-right|bottom-left|top-center|bottom-center`

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
`triggerType=button|icon|custom`, `variant=contained|outlined|text|soft|gradient`, `colorVariant=primary|success|error|warning|info|dark`, `size=small|medium|large`, `rounded=sm|md|lg`

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

---

---

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

---

---

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

---

---

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

---

## Typography

### AppText

Path: `src/components/ui/typography/AppText.jsx`  
Use for: Standard body text, descriptions, paragraphs, inline text, and custom typography.  
Replaces: MUI `Typography`

Props:  
`children: ReactNode`, `variant: string`, `color: string`, `weight: number | string`, `align: string`, `sx: object`, `...props: object`

Values:  
`variant=body1|body2|subtitle1|subtitle2|caption|overline|h1|h2|h3|h4|h5|h6`, `align=left|center|right|justify`

Example:  
`<AppText variant="body1" weight={500}>Welcome back</AppText>`

---

### AppHeading

Path: `src/components/ui/typography/AppHeading.jsx`  
Use for: Page titles, section headings, card titles, modal headings, and content headers.  
Replaces: MUI `Typography` heading variants

Props:  
`children: ReactNode`, `level: number`, `weight: number | string`, `gutterBottom: boolean`, `sx: object`, `...props: object`

Values:  
`level=1|2|3|4|5|6`, `weight=400|500|600|700|800`, `gutterBottom=true|false`

Example:  
`<AppHeading level={3} gutterBottom>User Details</AppHeading>`

---

### AppLabel

Path: `src/components/ui/typography/AppLabel.jsx`  
Use for: Form labels, field labels, filter labels, setting labels, and required field labels.  
Replaces: MUI `Typography` used as labels

Props:  
`children: ReactNode`, `required: boolean`, `sx: object`, `...props: object`

Values:  
`required=true|false`

Example:  
`<AppLabel required>Email Address</AppLabel>`

---

### AppCaption

Path: `src/components/ui/typography/AppCaption.jsx`  
Use for: Helper text, hints, metadata, muted descriptions, timestamps, and small notes.  
Replaces: MUI `Typography` caption variant

Props:  
`children: ReactNode`, `sx: object`, `...props: object`

Values:  
No fixed values.

Example:  
`<AppCaption>Last updated 2 hours ago</AppCaption>`

---

### AppLink

Path: `src/components/ui/typography/AppLink.jsx`  
Use for: Text links, navigation links, inline links, external links, and action links.  
Replaces: MUI `Link`

Props:  
`children: ReactNode`, `href: string`, `underline: string`, `sx: object`, `...props: object`

Values:  
`underline=none|hover|always`

Example:  
`<AppLink href="/settings">Manage Settings</AppLink>`

---

### Typography AI Rules

- Use `AppText` for normal text content.
- Use `AppHeading` for page titles, section titles, and card headings.
- Use `AppLabel` for form labels and required field labels.
- Use `AppCaption` for helper text, hints, timestamps, and muted notes.
- Use `AppLink` for clickable text links.
- Never use raw MUI `Typography` or `Link` directly in pages.
- Always use `AppHeading level={1}` to `level={6}` instead of manually setting heading variants.
- Always pass strings or CSS variables to color props.
- Always pass numbers or strings to weight props.
- Pass objects only to style props like `sx`.
- Pass React nodes only to `children`.
- Use `required` only on `AppLabel`.
- Use `href` only on `AppLink`.
- Keep typography styles consistent with app CSS variables.

## Layout

### AppContainer

Path: `src/components/ui/layout/AppContainer.jsx`  
Use for: Page wrappers, centered content areas, responsive containers, and max-width layouts.  
Replaces: MUI `Container`

Props:  
`children: ReactNode`, `maxWidth: string | number`, `centered: boolean`, `disablePadding: boolean`, `fluid: boolean`, `sx: object`, `...props: object`

Values:  
`maxWidth=sm|md|lg|xl|full`, `centered=true|false`, `disablePadding=true|false`, `fluid=true|false`

Example:  
`<AppContainer maxWidth="lg"><PageContent /></AppContainer>`

---

### AppBox

Path: `src/components/ui/layout/AppBox.jsx`  
Use for: Generic layout wrappers, cards, flex containers, spacing blocks, and themed surfaces.  
Replaces: MUI `Box`

Props:  
`children: ReactNode`, `display: string`, `flexDirection: string`, `alignItems: string`, `justifyContent: string`, `flexWrap: string`, `gap: number | string`, `p: number | string | object`, `px: number | string | object`, `py: number | string | object`, `m: number | string | object`, `mx: number | string | object`, `my: number | string | object`, `width: number | string`, `height: number | string`, `minHeight: number | string`, `surface: boolean`, `bordered: boolean`, `hoverable: boolean`, `rounded: boolean`, `elevation: boolean`, `sx: object`, `...props: object`

Values:  
`display=flex|block|grid|inline-flex|none`, `flexDirection=row|column|row-reverse|column-reverse`, `flexWrap=nowrap|wrap|wrap-reverse`, `surface=true|false`, `bordered=true|false`, `hoverable=true|false`, `rounded=true|false`, `elevation=true|false`

Example:  
`<AppBox surface bordered p={2}>Content</AppBox>`

---

### AppStack

Path: `src/components/ui/layout/AppStack.jsx`  
Use for: Vertical or horizontal spacing layouts, form groups, toolbar rows, and aligned content groups.  
Replaces: MUI `Stack`

Props:  
`children: ReactNode`, `direction: string`, `spacing: number | string`, `gap: number | string`, `align: string`, `justify: string`, `wrap: string`, `fullWidth: boolean`, `fullHeight: boolean`, `surface: boolean`, `bordered: boolean`, `rounded: boolean`, `elevation: boolean`, `hoverable: boolean`, `divider: ReactNode`, `sx: object`, `...props: object`

Values:  
`direction=row|column|row-reverse|column-reverse`, `align=stretch|flex-start|center|flex-end|baseline`, `justify=flex-start|center|flex-end|space-between|space-around|space-evenly`, `wrap=nowrap|wrap|wrap-reverse`, `fullWidth=true|false`, `fullHeight=true|false`, `surface=true|false`, `bordered=true|false`, `rounded=true|false`, `elevation=true|false`, `hoverable=true|false`

Example:  
`<AppStack direction="row" spacing={2} align="center">Content</AppStack>`

---

### AppGrid

Path: `src/components/ui/layout/AppGrid.jsx`  
Use for: Responsive grids, card grids, form grids, dashboard layouts, and multi-column sections.  
Replaces: CSS grid wrappers or MUI `Box` grid usage

Props:  
`children: ReactNode`, `columns: number | string`, `xs: number | string`, `sm: number | string`, `md: number | string`, `lg: number | string`, `xl: number | string`, `gap: number | string`, `rowGap: number | string`, `columnGap: number | string`, `align: string`, `justify: string`, `fullWidth: boolean`, `surface: boolean`, `bordered: boolean`, `rounded: boolean`, `sx: object`, `...props: object`

Values:  
`columns=number|string`, `xs=number|string`, `sm=number|string`, `md=number|string`, `lg=number|string`, `xl=number|string`, `align=stretch|start|center|end`, `justify=stretch|start|center|end`, `fullWidth=true|false`, `surface=true|false`, `bordered=true|false`, `rounded=true|false`

Example:  
`<AppGrid xs={1} md={2} lg={3} gap={3}>Cards</AppGrid>`

---

### AppSection

Path: `src/components/ui/layout/AppSection.jsx`  
Use for: Page sections, card-like content blocks, titled sections, settings panels, and grouped content areas.  
Built with: `AppHeading`, `AppText`, MUI `Box`, MUI `Divider`

Props:  
`children: ReactNode`, `title: string`, `description: string`, `action: ReactNode`, `padded: boolean`, `bordered: boolean`, `surface: boolean`, `rounded: boolean`, `divider: boolean`, `headerAlign: string`, `spacing: number | string`, `sx: object`, `headerSx: object`, `contentSx: object`, `...props: object`

Values:  
`padded=true|false`, `bordered=true|false`, `surface=true|false`, `rounded=true|false`, `divider=true|false`, `headerAlign=flex-start|center|flex-end|stretch`

Example:  
`<AppSection title="Profile" description="Manage user details" action={<AppButton>Edit</AppButton>}>Content</AppSection>`

---

### AppSpacer

Path: `src/components/ui/layout/AppSpacer.jsx`  
Use for: Vertical spacing, horizontal spacing, layout gaps, and controlled empty space between components.  
Replaces: Empty divs, margin hacks, and manual spacer elements

Props:  
`size: string | number`, `axis: string`, `sx: object`, `...props: object`

Values:  
`size=xs|sm|md|lg|xl|2xl|number`, `axis=vertical|horizontal`

Example:  
`<AppSpacer size="lg" />`

---

### Layout AI Rules

- Use `AppContainer` for page-level width control and responsive page wrappers.
- Use `AppBox` for generic layout wrappers and themed surface blocks.
- Use `AppStack` for one-dimensional vertical or horizontal spacing.
- Use `AppGrid` for responsive multi-column layouts.
- Use `AppSection` for titled content sections with optional description and actions.
- Use `AppSpacer` only when spacing cannot be handled cleanly with `gap`, `spacing`, `p`, or `m`.
- Never use raw MUI `Container`, `Box`, or `Stack` directly in pages.
- Prefer `AppStack` over manually applying flex styles for simple row or column layouts.
- Prefer `AppGrid` over custom CSS grid blocks.
- Prefer `AppSection` for repeated panel-like UI sections.
- Pass React elements only to props like `children`, `action`, and `divider`.
- Pass objects only to style props like `sx`, `headerSx`, and `contentSx`.
- Pass booleans only to visual props like `surface`, `bordered`, `rounded`, `elevation`, and `hoverable`.
- Use CSS variables for custom colors, borders, shadows, and surfaces.

## Notifications

### NotificationBell

Path: `src/components/features/notifications/NotificationBell.jsx`  
Use for: Notification trigger buttons, unread notification indicators, header notification icons, and notification menu toggles.  
Built with: `AppIconButton`, MUI `Badge`, MUI `Box`

Props:  
`unreadCount: number`, `onClick: function`, `loading: boolean`, `disabled: boolean`, `tooltip: string`

Values:  
`unreadCount=number`, `loading=true|false`, `disabled=true|false`

Example:  
`<NotificationBell unreadCount={5} onClick={openNotifications} />`

---

### NotificationList

Path: `src/components/features/notifications/NotificationList.jsx`  
Use for: Notification dropdowns, notification panels, notification popovers, and notification center lists.  
Built with: `NotificationItem`, `AppButton`, MUI `Box`, MUI `Typography`, MUI `Divider`

Props:  
`notifications: array`, `loading: boolean`, `emptyText: string`, `onMarkAllRead: function`, `onNotificationClick: function`

Notification shape:  
`{ id: string | number, title: string, message: string, time: string, isRead: boolean, icon: ReactNode }`

Values:  
`loading=true|false`

Example:  
`<NotificationList notifications={notifications} onMarkAllRead={markAllRead} onNotificationClick={handleNotificationClick} />`

---

### NotificationItem

Path: `src/components/features/notifications/NotificationItem.jsx`  
Use for: Single notification rows, unread notification states, notification previews, and clickable notification items.  
Built with: MUI `Box`, MUI `Typography`, MUI `CircleIcon`

Props:  
`notification: object`, `onClick: function`

Notification shape:  
`{ title: string, message: string, time: string, isRead: boolean, icon: ReactNode }`

Values:  
`isRead=true|false`

Example:  
`<NotificationItem notification={notification} onClick={handleClick} />`

---

### Notifications AI Rules

- Use `NotificationBell` for header notification icons and unread count triggers.
- Use `NotificationList` for dropdowns, popovers, drawers, and notification panels.
- Use `NotificationItem` only inside notification lists or custom notification feeds.
- Never use raw MUI `Badge` with notification logic directly in pages.
- Never manually build notification rows when `NotificationItem` can be used.
- Always pass an array to `notifications`.
- Always pass notification objects using the expected notification shape.
- Pass functions only to event props like `onClick`, `onMarkAllRead`, and `onNotificationClick`.
- Pass React elements only to icon props like `icon`.
- Use `isRead=false` for unread notifications.
- Use `unreadCount` from unread notification length when possible.
- Keep notification actions outside `NotificationItem`; use parent callbacks instead.
- Use `emptyText` to customize empty notification states.

## Forms

### AppForm

Path: `src/components/shared/forms/AppForm.jsx`  
Use for: Form wrappers, submit handling, reset handling, form validation summaries, and form action layouts.  
Built with: `AppFormActions`, `AppFormErrorSummary`, `AppFormRow`, MUI `Box`

Props:  
`children: ReactNode`, `onSubmit: function`, `onReset: function`, `errors: object`, `fieldLabels: object`, `showErrorSummary: boolean`, `errorSummaryTitle: string`, `errorSummaryMessage: string`, `showActions: boolean`, `submitText: string`, `cancelText: string`, `resetText: string`, `onCancel: function`, `submitLoading: boolean`, `submitDisabled: boolean`, `cancelDisabled: boolean`, `resetDisabled: boolean`, `showCancel: boolean`, `showReset: boolean`, `actionsAlign: string`, `actionsSticky: boolean`, `spacing: number | string`, `noValidate: boolean`, `fullWidth: boolean`, `actionsProps: object`, `errorSummaryProps: object`, `sx: object`, `...props: object`

Values:  
`showErrorSummary=true|false`, `showActions=true|false`, `showCancel=true|false`, `showReset=true|false`, `actionsAlign=left|center|right|space-between`, `actionsSticky=true|false`, `noValidate=true|false`, `fullWidth=true|false`

Example:  
`<AppForm onSubmit={handleSubmit} showActions submitText="Save">Form fields</AppForm>`

---

### AppFormField

Path: `src/components/shared/forms/AppFormField.jsx`  
Use for: Rendering common form fields with label, error, helper text, and consistent field behavior.  
Built with: `AppInput`, `AppTextarea`, `AppSelect`, `AppMultiSelect`, `AppCheckbox`, `AppRadio`, `AppSwitch`, `AppDatePicker`, `AppFileUpload`, `AppRequiredMark`, `AppFieldHint`

Props:  
`type: string`, `name: string`, `label: string`, `value: any`, `defaultValue: any`, `checked: boolean`, `defaultChecked: boolean`, `onChange: function`, `error: string | object`, `errors: object`, `helperText: string`, `required: boolean`, `disabled: boolean`, `readOnly: boolean`, `fullWidth: boolean`, `component: ReactNode`, `children: ReactNode`, `wrapperSx: object`, `labelSx: object`, `fieldSx: object`, `hintSx: object`, `...props: object`

Values:  
`type=input|textarea|select|multiselect|checkbox|radio|switch|date|file|custom`, `required=true|false`, `disabled=true|false`, `readOnly=true|false`, `fullWidth=true|false`

Example:  
`<AppFormField type="input" name="email" label="Email" required errors={errors} />`

---

### AppFormSection

Path: `src/components/shared/forms/AppFormSection.jsx`  
Use for: Grouping related form fields, titled form sections, card sections, soft sections, and form panels.  
Built with: `AppCard`, `AppFormGrid`, `AppFormRow`, `AppFieldHint`, MUI `Box`, MUI `Divider`, MUI `Typography`

Props:  
`children: ReactNode`, `title: string`, `subtitle: string`, `description: string`, `icon: ReactNode`, `actions: ReactNode`, `variant: string`, `columns: number | object`, `gap: number | string`, `spacing: number | string`, `divider: boolean`, `bordered: boolean`, `padding: string`, `rounded: string`, `shadow: string`, `fullWidth: boolean`, `disabled: boolean`, `sx: object`, `headerSx: object`, `contentSx: object`, `titleSx: object`, `subtitleSx: object`, `descriptionSx: object`, `...props: object`

Values:  
`variant=default|card|plain|soft`, `padding=sm|md|lg`, `rounded=sm|md|lg|xl`, `shadow=none|sm|md|lg`, `divider=true|false`, `bordered=true|false`, `fullWidth=true|false`, `disabled=true|false`

Example:  
`<AppFormSection title="Personal Details" columns={2} variant="card">Fields</AppFormSection>`

---

### AppFormActions

Path: `src/components/shared/forms/AppFormActions.jsx`  
Use for: Form submit, cancel, reset buttons, sticky form action bars, and form footer actions.  
Built with: `AppButton`, `AppFormRow`

Props:  
`submitText: string`, `cancelText: string`, `resetText: string`, `onSubmit: function`, `onCancel: function`, `onReset: function`, `showSubmit: boolean`, `showCancel: boolean`, `showReset: boolean`, `submitLoading: boolean`, `cancelLoading: boolean`, `resetLoading: boolean`, `submitDisabled: boolean`, `cancelDisabled: boolean`, `resetDisabled: boolean`, `align: string`, `direction: string`, `fullWidth: boolean`, `sticky: boolean`, `submitProps: object`, `cancelProps: object`, `resetProps: object`, `children: ReactNode`, `sx: object`

Values:  
`align=left|center|right|space-between`, `direction=row|column`, `showSubmit=true|false`, `showCancel=true|false`, `showReset=true|false`, `fullWidth=true|false`, `sticky=true|false`

Example:  
`<AppFormActions onSubmit={handleSave} showCancel onCancel={handleCancel} submitText="Save" />`

---

### AppFormErrorSummary

Path: `src/components/shared/forms/AppFormErrorSummary.jsx`  
Use for: Displaying grouped form validation errors, submit errors, and field-level error summaries.  
Built with: `AppAlert`, `AppFieldHint`, MUI `Box`, MUI `Typography`, MUI `ErrorOutlineRoundedIcon`

Props:  
`errors: object`, `title: string`, `message: string`, `visible: boolean`, `showIcon: boolean`, `closable: boolean`, `onClose: function`, `maxErrors: number`, `fieldLabels: object`, `variant: string`, `severity: string`, `dense: boolean`, `sx: object`, `listSx: object`, `itemSx: object`

Values:  
`visible=true|false`, `showIcon=true|false`, `closable=true|false`, `variant=soft|filled|outlined|standard`, `severity=error|warning|info|success`, `dense=true|false`

Example:  
`<AppFormErrorSummary errors={errors} fieldLabels={{ email: "Email Address" }} />`

---

### AppFormRow

Path: `src/components/shared/forms/AppFormRow.jsx`  
Use for: Horizontal form rows, responsive field rows, grouped controls, and action rows.  
Replaces: Manual flex row wrappers

Props:  
`children: ReactNode`, `gap: number | string`, `align: string`, `justify: string`, `wrap: boolean`, `className: string`, `sx: object`, `...props: object`

Values:  
`align=flex-start|center|flex-end|stretch|baseline`, `justify=flex-start|center|flex-end|space-between|space-around|space-evenly`, `wrap=true|false`

Example:  
`<AppFormRow gap={2} align="center">Fields</AppFormRow>`

---

### AppFormGrid

Path: `src/components/shared/forms/AppFormGrid.jsx`  
Use for: Responsive form field grids, multi-column form layouts, and aligned form sections.  
Replaces: Manual CSS grid wrappers

Props:  
`children: ReactNode`, `columns: object`, `gap: number | string`, `className: string`, `sx: object`, `...props: object`

Values:  
`columns={ xs: number, sm: number, md: number, lg: number }`

Example:  
`<AppFormGrid columns={{ xs: 1, sm: 2, md: 3 }}>Fields</AppFormGrid>`

---

### AppRequiredMark

Path: `src/components/shared/forms/AppRequiredMark.jsx`  
Use for: Required field indicators, custom label required marks, and required validation UI.  
Replaces: Manual required asterisk spans

Props:  
`color: string`, `children: ReactNode`, `sx: object`, `...props: object`

Values:  
No fixed values.

Example:  
`<AppRequiredMark />`

---

### AppFieldHint

Path: `src/components/shared/forms/AppFieldHint.jsx`  
Use for: Field helper text, hints, validation messages, descriptions, and muted field notes.  
Replaces: Manual caption helper text

Props:  
`children: ReactNode`, `color: string`, `className: string`, `sx: object`, `...props: object`

Values:  
No fixed values.

Example:  
`<AppFieldHint>Password must be at least 8 characters</AppFieldHint>`

---

### Forms AI Rules

- Use `AppForm` as the main wrapper for forms.
- Use `AppFormField` for standard input, textarea, select, checkbox, radio, switch, date, file, and custom field rendering.
- Use `AppFormSection` to group related form fields.
- Use `AppFormActions` for submit, cancel, and reset button rows.
- Use `AppFormErrorSummary` for grouped validation errors.
- Use `AppFormRow` for responsive horizontal form rows.
- Use `AppFormGrid` for responsive multi-column form layouts.
- Use `AppRequiredMark` only for required field indicators.
- Use `AppFieldHint` for helper text, hints, and field descriptions.
- Never manually build repeated form layouts when these components can be used.
- Never use raw MUI `Box`, `Typography`, or button groups directly for shared form structures.
- Always pass functions only to event props like `onSubmit`, `onReset`, `onCancel`, and `onChange`.
- Always pass objects only to style props like `sx`, `wrapperSx`, `fieldSx`, `labelSx`, `hintSx`, `actionsProps`, and `errorSummaryProps`.
- Always pass React elements only to props like `children`, `component`, `icon`, and `actions`.
- Always pass validation errors as an object to `errors`.
- Use `fieldLabels` when error field keys are not user-friendly.
- Use `showErrorSummary` only when the user should see all validation issues at once.
- Use `actionsSticky` or `sticky` for long forms with important submit actions.
- Use `type="custom"` in `AppFormField` only when no built-in field type matches.
- Keep form spacing controlled through `spacing`, `gap`, `columns`, and layout props instead of custom margins.

## Tables

### AppTable

Path: `src/components/shared/tables/AppTable.jsx`  
Use for: Standard desktop tables, selectable rows, loading states, empty states, row actions, and custom cell rendering.  
Replaces: Raw MUI `Table`, `TableContainer`, `TableHead`, `TableBody`, `TableRow`, and `TableCell`

Props:  
`columns: array`, `rows: array`, `getRowId: function`, `loading: boolean`, `skeleton: boolean`, `selectable: boolean`, `selectedIds: array`, `onSelectRow: function`, `onSelectAll: function`, `showRowActions: boolean`, `rowActionsProps: object`, `onView: function`, `onEdit: function`, `onDelete: function`, `onDuplicate: function`, `emptyTitle: string`, `emptyDescription: string`, `emptyVariant: string`, `emptyActionLabel: string`, `onEmptyAction: function`, `dense: boolean`, `bordered: boolean`, `rounded: boolean`, `hover: boolean`, `stickyHeader: boolean`, `minWidth: number | string`, `maxHeight: number | string`, `sx: object`, `containerSx: object`, `tableSx: object`, `headSx: object`, `bodySx: object`, `rowSx: object`, `cellSx: object`, `...props: object`

Column shape:  
`{ id: string, key: string, label: string, align: string, width: number | string, minWidth: number | string, maxWidth: number | string, hidden: boolean, noWrap: boolean, render: function, headerSx: object, cellSx: object }`

Values:  
`emptyVariant=empty|search|filter|error|permission`, `dense=true|false`, `bordered=true|false`, `rounded=true|false`, `hover=true|false`, `stickyHeader=true|false`

Example:  
`<AppTable columns={columns} rows={rows} selectable selectedIds={selectedIds} onSelectRow={handleSelectRow} />`

---

### AppTableToolbar

Path: `src/components/shared/tables/AppTableToolbar.jsx`  
Use for: Table search bars, column controls, bulk actions, export actions, and table-level toolbar actions.  
Built with: `AppTableSearch`, `AppColumnManager`, `AppBulkActions`, `AppExport`, `AppStack`, MUI `Box`

Props:  
`title: string`, `subtitle: string`, `searchValue: string`, `onSearchChange: function`, `onSearch: function`, `onSearchClear: function`, `searchPlaceholder: string`, `showSearch: boolean`, `searchProps: object`, `columns: array`, `visibleColumns: array`, `onColumnChange: function`, `showColumnManager: boolean`, `columnManagerProps: object`, `selectedRows: array`, `selectedIds: array`, `onClearSelection: function`, `bulkActions: array`, `showBulkActions: boolean`, `bulkActionsProps: object`, `exportData: array`, `exportFilename: string`, `onExport: function`, `showExport: boolean`, `exportProps: object`, `actions: ReactNode`, `leftActions: ReactNode`, `rightActions: ReactNode`, `dense: boolean`, `sticky: boolean`, `sx: object`, `leftSx: object`, `rightSx: object`, `...props: object`

Values:  
`showSearch=true|false`, `showColumnManager=true|false`, `showBulkActions=true|false`, `showExport=true|false`, `dense=true|false`, `sticky=true|false`

Example:  
`<AppTableToolbar searchValue={search} onSearchChange={handleSearchChange} columns={columns} onColumnChange={setVisibleColumns} />`

---

### AppColumnManager

Path: `src/components/shared/tables/AppColumnManager.jsx`  
Use for: Showing, hiding, resetting, and selecting visible table columns.  
Built with: `AppDropdown`, `AppCheckbox`, `AppStack`, `AppText`, `AppButton`

Props:  
`columns: array`, `visibleColumns: array`, `onChange: function`, `label: string`, `tooltip: string`, `disabled: boolean`, `loading: boolean`, `dense: boolean`, `showReset: boolean`, `resetLabel: string`, `selectAllLabel: string`, `triggerType: string`, `size: string`, `variant: string`, `colorVariant: string`, `sx: object`, `...props: object`

Column manager column shape:  
`{ key: string, label: string, required: boolean, hideFromColumnManager: boolean }`

Values:  
`triggerType=button|icon|custom`, `variant=contained|outlined|text|soft|gradient`, `colorVariant=primary|success|error|warning|info|dark`, `size=small|medium|large`, `disabled=true|false`, `loading=true|false`, `dense=true|false`, `showReset=true|false`

Example:  
`<AppColumnManager columns={columns} visibleColumns={visibleColumns} onChange={setVisibleColumns} />`

---

### AppRowActions

Path: `src/components/shared/tables/AppRowActions.jsx`  
Use for: Per-row action menus like view, edit, duplicate, and delete with confirmation.  
Built with: `AppMenu`, `ConfirmDialog`

Props:  
`row: object`, `actions: array`, `onView: function`, `onEdit: function`, `onDelete: function`, `onDuplicate: function`, `showView: boolean`, `showEdit: boolean`, `showDelete: boolean`, `showDuplicate: boolean`, `trigger: ReactNode`, `triggerTooltip: string`, `disabled: boolean`, `deleteTitle: string`, `deleteDescription: string`, `deleteAlertTitle: string`, `deleteAlertMessage: string`, `deleteConfirmText: string`, `deleteCancelText: string`, `deleteLoading: boolean`, `menuMinWidth: number | string`, `menuMaxWidth: number | string`, `onActionClick: function`

Action shape:  
`{ id: string, label: string, icon: ReactNode, type: string, danger: boolean, disabled: boolean, onClick: function }`

Values:  
`showView=true|false`, `showEdit=true|false`, `showDelete=true|false`, `showDuplicate=true|false`, `disabled=true|false`, `deleteLoading=true|false`

Example:  
`<AppRowActions row={row} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />`

---

### AppExport

Path: `src/components/shared/tables/AppExport.jsx`  
Use for: Exporting table data to CSV, Excel, PDF, or custom export handlers.  
Built with: `AppDropdown`

Props:  
`data: array`, `filename: string`, `onExport: function`, `onCsvExport: function`, `onExcelExport: function`, `onPdfExport: function`, `label: string`, `disabled: boolean`, `loading: boolean`, `dense: boolean`, `formats: array`, `triggerType: string`, `variant: string`, `colorVariant: string`, `sx: object`, `...props: object`

Values:  
`formats=csv|excel|pdf`, `triggerType=button|icon|custom`, `variant=contained|outlined|text|soft|gradient`, `colorVariant=primary|success|error|warning|info|dark`, `disabled=true|false`, `loading=true|false`, `dense=true|false`

Example:  
`<AppExport data={rows} filename="users" onExport={handleExport} />`

---

### DataTable

Path: `src/components/shared/tables/DataTable.jsx`  
Use for: Complete table screens with toolbar, search, filters, responsive table, selection, row actions, export, and pagination.  
Built with: `AppResponsiveTable`, `AppTableToolbar`, `AppTablePagination`, `FilterChipList`, MUI `Box`

Props:  
`columns: array`, `rows: array`, `getRowId: function`, `loading: boolean`, `searchable: boolean`, `searchValue: string`, `onSearchChange: function`, `onSearch: function`, `onSearchClear: function`, `searchPlaceholder: string`, `filters: array`, `onFilterRemove: function`, `onFiltersClear: function`, `showFilterChips: boolean`, `selectable: boolean`, `selectedIds: array`, `onSelectedIdsChange: function`, `showRowActions: boolean`, `rowActionsProps: object`, `onView: function`, `onEdit: function`, `onDelete: function`, `onDuplicate: function`, `pagination: boolean`, `page: number`, `pageSize: number`, `totalItems: number`, `onPageChange: function`, `onPageSizeChange: function`, `showToolbar: boolean`, `toolbarActions: ReactNode`, `leftToolbarActions: ReactNode`, `rightToolbarActions: ReactNode`, `showColumnManager: boolean`, `visibleColumns: array`, `onColumnChange: function`, `showExport: boolean`, `exportData: array`, `exportFilename: string`, `onExport: function`, `emptyTitle: string`, `emptyDescription: string`, `emptyVariant: string`, `dense: boolean`, `bordered: boolean`, `rounded: boolean`, `hover: boolean`, `stickyHeader: boolean`, `sx: object`, `toolbarSx: object`, `filterChipSx: object`, `tableSx: object`, `paginationSx: object`, `tableProps: object`, `toolbarProps: object`, `paginationProps: object`

Values:  
`emptyVariant=empty|search|filter|error|permission`, `searchable=true|false`, `showFilterChips=true|false`, `selectable=true|false`, `showRowActions=true|false`, `pagination=true|false`, `showToolbar=true|false`, `showColumnManager=true|false`, `showExport=true|false`, `dense=true|false`, `bordered=true|false`, `rounded=true|false`, `hover=true|false`, `stickyHeader=true|false`

Example:  
`<DataTable columns={columns} rows={rows} searchable selectable pagination onSearch={handleSearch} />`

---

### AppBulkActions

Path: `src/components/shared/tables/AppBulkActions.jsx`  
Use for: Bulk actions shown when rows are selected, including delete, export, approve, reject, and custom selected-row actions.  
Built with: `AppBox`, `AppStack`, `AppText`, `AppDropdown`, `AppIconButton`

Props:  
`selectedRows: array`, `selectedIds: array`, `selectedCount: number`, `actions: array`, `onClearSelection: function`, `label: string`, `clearTooltip: string`, `dense: boolean`, `disabled: boolean`, `loading: boolean`, `showCount: boolean`, `showClear: boolean`, `triggerLabel: string`, `triggerVariant: string`, `triggerColorVariant: string`, `sx: object`, `...props: object`

Bulk action shape:  
`{ label: string, icon: ReactNode, disabled: boolean, danger: boolean, onClick: function }`

Values:  
`dense=true|false`, `disabled=true|false`, `loading=true|false`, `showCount=true|false`, `showClear=true|false`, `triggerVariant=contained|outlined|text|soft|gradient`, `triggerColorVariant=primary|success|error|warning|info|dark`

Example:  
`<AppBulkActions selectedIds={selectedIds} actions={bulkActions} onClearSelection={clearSelection} />`

---

### AppTableSearch

Path: `src/components/shared/tables/AppTableSearch.jsx`  
Use for: Debounced table search, shortcut-focused search inputs, result count metadata, and clearable table filters.  
Built with: `AppSearchInput`, `AppIconButton`, `AppShortcutHint`, `AppLoader`, `AppTooltip`, MUI `Box`, MUI `Typography`

Props:  
`value: string`, `defaultValue: string`, `onChange: function`, `onSearch: function`, `onClear: function`, `placeholder: string`, `label: string`, `helperText: string`, `debounce: number`, `minLength: number`, `loading: boolean`, `disabled: boolean`, `clearable: boolean`, `fullWidth: boolean`, `width: number | string`, `size: string`, `variant: string`, `rounded: string`, `showResultCount: boolean`, `resultCount: number`, `totalCount: number`, `resultLabel: string`, `showShortcut: boolean`, `shortcutKeys: array`, `focusShortcut: boolean`, `autoFocus: boolean`, `dense: boolean`, `tooltip: string`, `sx: object`, `inputSx: object`, `wrapperSx: object`, `metaSx: object`, `...props: object`

Values:  
`size=small|medium|large`, `variant=surface|outlined|filled|standard|soft`, `rounded=sm|md|lg|full`, `loading=true|false`, `disabled=true|false`, `clearable=true|false`, `fullWidth=true|false`, `showResultCount=true|false`, `showShortcut=true|false`, `focusShortcut=true|false`, `autoFocus=true|false`, `dense=true|false`

Example:  
`<AppTableSearch value={search} onChange={handleChange} onSearch={handleSearch} showResultCount resultCount={12} />`

---

### AppTablePagination

Path: `src/components/shared/tables/AppTablePagination.jsx`  
Use for: Table pagination footers, page-size controls, compact page controls, and table result summaries.  
Built with: `AppPagination`, `AppSelect`, `AppButton`, `AppIconButton`, `AppBox`, `AppStack`, `AppText`

Props:  
`page: number`, `pageSize: number`, `totalItems: number`, `pageSizeOptions: array`, `onPageChange: function`, `onPageSizeChange: function`, `showPageSize: boolean`, `showSummary: boolean`, `showFirstLast: boolean`, `showCompactControls: boolean`, `rowsPerPageLabel: string`, `ofLabel: string`, `showingLabel: string`, `size: string`, `variant: string`, `rounded: string`, `align: string`, `compact: boolean`, `dense: boolean`, `disabled: boolean`, `loading: boolean`, `sx: object`, `summarySx: object`, `pageSizeSx: object`, `paginationSx: object`, `...props: object`

Values:  
`size=small|medium|large`, `variant=outlined|text|contained|soft`, `rounded=sm|md|lg|full`, `align=flex-start|center|flex-end|space-between|space-around|space-evenly`, `compact=true|false`, `dense=true|false`, `disabled=true|false`, `loading=true|false`, `showPageSize=true|false`, `showSummary=true|false`, `showFirstLast=true|false`, `showCompactControls=true|false`

Example:  
`<AppTablePagination page={page} pageSize={pageSize} totalItems={total} onPageChange={setPage} onPageSizeChange={setPageSize} />`

---

### AppEmptyTable

Path: `src/components/shared/tables/AppEmptyTable.jsx`  
Use for: Empty table states, no search results, no filtered results, table errors, permission states, and empty table rows.  
Built with: `AppEmptyState`, `AppBox`, `AppStack`, `AppText`, `AppButton`

Props:  
`title: string`, `description: string`, `variant: string`, `icon: ReactNode`, `action: ReactNode`, `actionLabel: string`, `onAction: function`, `actionIcon: ReactNode`, `secondaryActionLabel: string`, `onSecondaryAction: function`, `secondaryActionIcon: ReactNode`, `size: string`, `align: string`, `fullHeight: boolean`, `bordered: boolean`, `surface: boolean`, `rounded: boolean`, `minHeight: number | string`, `colSpan: number`, `asTableRow: boolean`, `sx: object`, `contentSx: object`, `actionSx: object`, `...props: object`

Values:  
`variant=empty|search|filter|error|permission`, `size=small|medium|large|page`, `align=left|center|right`, `fullHeight=true|false`, `bordered=true|false`, `surface=true|false`, `rounded=true|false`, `asTableRow=true|false`

Example:  
`<AppEmptyTable variant="search" actionLabel="Clear search" onAction={clearSearch} />`

---

### AppResponsiveTable

Path: `src/components/shared/tables/AppResponsiveTable.jsx`  
Use for: Responsive table layouts that render desktop tables and mobile card-based lists from the same data.  
Built with: `AppTable`, `AppCard`, `AppCheckbox`, `AppRowActions`, `AppEmptyTable`, `AppTableSkeleton`, `AppLoader`

Props:  
`columns: array`, `rows: array`, `getRowId: function`, `loading: boolean`, `skeleton: boolean`, `emptyTitle: string`, `emptyDescription: string`, `emptyVariant: string`, `selectable: boolean`, `selectedIds: array`, `onSelectRow: function`, `onSelectAll: function`, `showRowActions: boolean`, `rowActionsProps: object`, `onView: function`, `onEdit: function`, `onDelete: function`, `onDuplicate: function`, `mobileBreakpoint: string`, `mobileTitleKey: string`, `mobileSubtitleKey: string`, `mobileDescriptionKey: string`, `renderMobileTitle: function`, `renderMobileSubtitle: function`, `renderMobileDescription: function`, `renderMobileFooter: function`, `renderMobileCard: function`, `hideColumnsOnMobile: array`, `mobileVisibleColumnIds: array`, `dense: boolean`, `bordered: boolean`, `rounded: boolean`, `hover: boolean`, `stickyHeader: boolean`, `minWidth: number | string`, `maxHeight: number | string`, `cardVariant: string`, `cardPadding: string`, `cardShadow: string`, `sx: object`, `tableSx: object`, `mobileSx: object`, `cardSx: object`, `fieldSx: object`, `labelSx: object`, `valueSx: object`, `tableProps: object`

Mobile column shape:  
`{ id: string, key: string, label: string, mobileLabel: string, hideOnMobile: boolean, render: function, renderMobile: function, mobileLabelSx: object, mobileValueSx: object }`

Values:  
`mobileBreakpoint=xs|sm|md|lg`, `emptyVariant=empty|search|filter|error|permission`, `cardVariant=default|outlined|soft`, `cardPadding=sm|md|lg`, `cardShadow=none|sm|md|lg`, `dense=true|false`, `bordered=true|false`, `rounded=true|false`, `hover=true|false`, `stickyHeader=true|false`

Example:  
`<AppResponsiveTable columns={columns} rows={rows} mobileTitleKey="name" selectable />`

---

### Tables AI Rules

- Use `DataTable` for full table pages with toolbar, filters, export, selection, row actions, and pagination.
- Use `AppResponsiveTable` when the table must work well on mobile screens.
- Use `AppTable` for simple desktop-only data tables.
- Use `AppTableToolbar` for reusable table search, export, column manager, and bulk action controls.
- Use `AppTableSearch` for debounced table search inputs.
- Use `AppTablePagination` for table-specific pagination footers.
- Use `AppColumnManager` when users can show or hide table columns.
- Use `AppBulkActions` only when row selection is enabled.
- Use `AppRowActions` for per-row view, edit, duplicate, and delete actions.
- Use `AppExport` for CSV, Excel, PDF, or custom export menus.
- Use `AppEmptyTable` for table empty, search, filter, error, and permission states.
- Never use raw MUI table components directly in pages.
- Always pass arrays to `columns`, `rows`, `selectedIds`, `selectedRows`, `bulkActions`, `filters`, and `formats`.
- Always pass functions only to event props like `onSelectRow`, `onSelectAll`, `onSearch`, `onExport`, `onPageChange`, and row action handlers.
- Always pass objects only to style props like `sx`, `tableSx`, `toolbarSx`, `containerSx`, `cellSx`, `rowSx`, and `paginationSx`.
- Always define stable row IDs using `getRowId` when rows do not have an `id` field.
- Use `column.render` for custom desktop cell rendering.
- Use `column.renderMobile` for custom mobile card field rendering.
- Use `visibleColumns` with `AppColumnManager` or `DataTable` for user-controlled columns.
- Use `selectedIds` and `onSelectedIdsChange` for controlled selection.
- Use `emptyVariant="search"` when search returns no results.
- Use `emptyVariant="filter"` when filters return no results.
- Use `emptyVariant="error"` when table data fails to load.
- Use `emptyVariant="permission"` when access is restricted.
- Use `dense` for compact admin tables.
- Use `stickyHeader` only when the table container has a constrained height.
- Keep table actions inside toolbar, bulk actions, or row actions instead of placing scattered buttons around tables.

## Filters

### FilterBar

Path: `src/components/shared/filters/FilterBar.jsx`  
Use for: Inline page filters, table filters, list filters, search filters, status filters, saved filters, and filter action bars.  
Built with: `SearchFilter`, `SelectFilter`, `DateRangeFilter`, `StatusFilter`, `SavedFilters`, `FilterChipList`, `AppButton`, `AppStack`, MUI `Box`

Props:  
`values: object`, `onChange: function`, `filters: array`, `onRemoveFilter: function`, `onClearFilters: function`, `showSearch: boolean`, `searchName: string`, `searchLabel: string`, `searchPlaceholder: string`, `showStatus: boolean`, `statusName: string`, `statusLabel: string`, `statusOptions: array`, `showSavedFilters: boolean`, `savedFilterName: string`, `savedFilterOptions: array`, `onSavedFilterChange: function`, `selects: array`, `dateRanges: array`, `leftContent: ReactNode`, `rightContent: ReactNode`, `actions: ReactNode`, `showChips: boolean`, `showClear: boolean`, `clearLabel: string`, `dense: boolean`, `disabled: boolean`, `loading: boolean`, `sticky: boolean`, `bordered: boolean`, `surface: boolean`, `sx: object`, `fieldsSx: object`, `chipsSx: object`, `actionsSx: object`, `...props: object`

Values:  
`showSearch=true|false`, `showStatus=true|false`, `showSavedFilters=true|false`, `showChips=true|false`, `showClear=true|false`, `dense=true|false`, `disabled=true|false`, `loading=true|false`, `sticky=true|false`, `bordered=true|false`, `surface=true|false`

Example:  
`<FilterBar values={filters} onChange={setFilters} showStatus statusOptions={statusOptions} onClearFilters={clearFilters} />`

---

### DateRangeFilter

Path: `src/components/shared/filters/DateRangeFilter.jsx`  
Use for: Date range filters, created date filters, updated date filters, reporting period filters, and timeline filters.  
Built with: `AppDateRangePicker`

Props:  
`name: string`, `label: string`, `value: any`, `onChange: function`, `placeholder: string`, `size: string`, `fullWidth: boolean`, `clearable: boolean`, `disabled: boolean`, `loading: boolean`, `required: boolean`, `helperText: string`, `startIcon: ReactNode`, `variant: string`, `rounded: string`, `sx: object`, `...props: object`

Values:  
`size=small|medium|large`, `variant=surface|outlined|filled|standard|soft`, `rounded=sm|md|lg|full`, `fullWidth=true|false`, `clearable=true|false`, `disabled=true|false`, `loading=true|false`, `required=true|false`

Example:  
`<DateRangeFilter value={dateRange} onChange={setDateRange} />`

---

### AdvancedFilterPanel

Path: `src/components/shared/filters/AdvancedFilterPanel.jsx`  
Use for: Advanced filter panels, expanded filter sections, filter drawers, report filters, and multi-field filter layouts.  
Built with: `SearchFilter`, `SelectFilter`, `DateRangeFilter`, `StatusFilter`, `SavedFilters`, `FilterChipList`, `AppBox`, `AppStack`, `AppButton`, `AppText`

Props:  
`values: object`, `onChange: function`, `filters: array`, `onRemoveFilter: function`, `onClearFilters: function`, `title: string`, `description: string`, `searchable: boolean`, `searchName: string`, `searchLabel: string`, `searchPlaceholder: string`, `showStatus: boolean`, `statusName: string`, `statusLabel: string`, `statusOptions: array`, `showSavedFilters: boolean`, `savedFilterName: string`, `savedFilterOptions: array`, `onSavedFilterChange: function`, `selects: array`, `dateRanges: array`, `actions: ReactNode`, `footer: ReactNode`, `collapsible: boolean`, `collapsed: boolean`, `dense: boolean`, `disabled: boolean`, `loading: boolean`, `showChips: boolean`, `showClear: boolean`, `clearLabel: string`, `columns: number`, `sx: object`, `headerSx: object`, `fieldsSx: object`, `chipsSx: object`, `footerSx: object`, `...props: object`

Values:  
`searchable=true|false`, `showStatus=true|false`, `showSavedFilters=true|false`, `collapsible=true|false`, `collapsed=true|false`, `dense=true|false`, `disabled=true|false`, `loading=true|false`, `showChips=true|false`, `showClear=true|false`

Example:  
`<AdvancedFilterPanel values={filters} onChange={setFilters} selects={selectFilters} dateRanges={dateFilters} />`

---

### SelectFilter

Path: `src/components/shared/filters/SelectFilter.jsx`  
Use for: Dropdown filters, category filters, user filters, role filters, type filters, and single or multi-select filters.  
Built with: `AppSelect`

Props:  
`name: string`, `label: string`, `value: any`, `onChange: function`, `options: array`, `placeholder: string`, `multiple: boolean`, `clearable: boolean`, `size: string`, `fullWidth: boolean`, `disabled: boolean`, `loading: boolean`, `required: boolean`, `startIcon: ReactNode`, `helperText: string`, `variant: string`, `rounded: string`, `sx: object`, `...props: object`

Option shape:  
`{ label: string, value: string | number | boolean, disabled: boolean }`

Values:  
`multiple=true|false`, `clearable=true|false`, `size=small|medium|large`, `fullWidth=true|false`, `disabled=true|false`, `loading=true|false`, `required=true|false`, `variant=surface|outlined|filled|standard|soft`, `rounded=sm|md|lg|full`

Example:  
`<SelectFilter name="role" label="Role" value={role} options={roleOptions} onChange={handleRoleChange} />`

---

### SearchFilter

Path: `src/components/shared/filters/SearchFilter.jsx`  
Use for: Search filters, keyword filters, list search, table search, and text-based filtering.  
Built with: `AppSearchInput`

Props:  
`name: string`, `value: string`, `onChange: function`, `onSearch: function`, `onClear: function`, `label: string`, `placeholder: string`, `size: string`, `fullWidth: boolean`, `clearable: boolean`, `disabled: boolean`, `loading: boolean`, `debounce: number`, `minLength: number`, `sx: object`, `...props: object`

Values:  
`size=small|medium|large`, `fullWidth=true|false`, `clearable=true|false`, `disabled=true|false`, `loading=true|false`

Example:  
`<SearchFilter value={search} onChange={handleSearchChange} onSearch={handleSearch} />`

---

### AppTableFilters

Path: `src/components/shared/filters/AppTableFilters.jsx`  
Use for: Table-specific filter rows, table search, status filters, select filters, date range filters, filter chips, and clear filter actions.  
Built with: `SearchFilter`, `SelectFilter`, `DateRangeFilter`, `StatusFilter`, `FilterChipList`, `AppButton`, `AppStack`, MUI `Box`

Props:  
`values: object`, `onChange: function`, `onRemove: function`, `onClear: function`, `search: boolean`, `searchName: string`, `searchPlaceholder: string`, `searchLabel: string`, `status: boolean`, `statusName: string`, `statusOptions: array`, `statusLabel: string`, `selects: array`, `dateRanges: array`, `filters: array`, `showChips: boolean`, `showClear: boolean`, `clearLabel: string`, `dense: boolean`, `disabled: boolean`, `loading: boolean`, `layout: string`, `columns: number`, `sx: object`, `fieldsSx: object`, `chipsSx: object`, `actionsSx: object`, `...props: object`

Values:  
`search=true|false`, `status=true|false`, `showChips=true|false`, `showClear=true|false`, `dense=true|false`, `disabled=true|false`, `loading=true|false`, `layout=inline|grid|stack`

Example:  
`<AppTableFilters values={filters} onChange={setFilters} filters={activeFilters} onClear={clearFilters} />`

---

### StatusFilter

Path: `src/components/shared/filters/StatusFilter.jsx`  
Use for: Status dropdown filters, approval state filters, active/inactive filters, and workflow status filters.  
Built with: `SelectFilter`

Props:  
`value: any`, `onChange: function`, `options: array`, `name: string`, `label: string`, `placeholder: string`, `multiple: boolean`, `size: string`, `fullWidth: boolean`, `clearable: boolean`, `disabled: boolean`, `loading: boolean`, `sx: object`, `...props: object`

Default options:  
`Active`, `Inactive`, `Pending`, `Approved`, `Rejected`

Values:  
`multiple=true|false`, `size=small|medium|large`, `fullWidth=true|false`, `clearable=true|false`, `disabled=true|false`, `loading=true|false`

Example:  
`<StatusFilter value={status} onChange={handleStatusChange} multiple />`

---

### SavedFilters

Path: `src/components/shared/filters/SavedFilters.jsx`  
Use for: Saved filter presets, reusable filter views, saved search filters, and user-defined filter templates.  
Built with: `SelectFilter`

Props:  
`value: any`, `onChange: function`, `options: array`, `name: string`, `label: string`, `placeholder: string`, `size: string`, `fullWidth: boolean`, `clearable: boolean`, `disabled: boolean`, `loading: boolean`, `sx: object`, `...props: object`

Values:  
`size=small|medium|large`, `fullWidth=true|false`, `clearable=true|false`, `disabled=true|false`, `loading=true|false`

Example:  
`<SavedFilters value={savedFilter} onChange={handleSavedFilterChange} options={savedFilterOptions} />`

---

### FilterChipList

Path: `src/components/shared/filters/FilterChipList.jsx`  
Use for: Active filter chips, removable filter badges, selected filter summaries, and clear-all filter controls.  
Built with: `AppBadge`, `AppButton`, MUI `Stack`, MUI `Box`

Props:  
`filters: array`, `onRemove: function`, `onClearAll: function`, `clearLabel: string`, `showClearAll: boolean`, `size: string`, `colorVariant: string`, `empty: ReactNode`, `sx: object`, `...props: object`

Filter shape:  
`{ key: string, name: string, label: string, value: any, displayValue: string | array, colorVariant: string }`

Values:  
`size=small|medium|large`, `colorVariant=primary|success|error|warning|info|dark`, `showClearAll=true|false`

Example:  
`<FilterChipList filters={activeFilters} onRemove={removeFilter} onClearAll={clearFilters} />`

---

### Filters AI Rules

- Use `FilterBar` for common inline page filters.
- Use `AdvancedFilterPanel` for expanded, multi-field, or advanced filtering.
- Use `AppTableFilters` for table-specific filter controls.
- Use `SearchFilter` for keyword and text search filters.
- Use `SelectFilter` for dropdown, category, type, role, and multi-select filters.
- Use `DateRangeFilter` for date range filtering.
- Use `StatusFilter` for status-based filtering.
- Use `SavedFilters` for saved filter presets.
- Use `FilterChipList` for active filter summaries and removable filter chips.
- Never manually build repeated filter rows when these components can be used.
- Never use raw `AppSelect`, `AppSearchInput`, or `AppDateRangePicker` directly for shared filter UIs when filter wrappers exist.
- Always pass current filter state through `values`.
- Always update filter state through `onChange`.
- Always pass arrays to `filters`, `selects`, `dateRanges`, `options`, and `savedFilterOptions`.
- Always pass functions only to event props like `onChange`, `onClearFilters`, `onRemoveFilter`, `onSearch`, and `onClear`.
- Always pass React elements only to props like `leftContent`, `rightContent`, `actions`, `footer`, `startIcon`, and `empty`.
- Always pass objects only to style props like `sx`, `fieldsSx`, `chipsSx`, `actionsSx`, `headerSx`, and `footerSx`.
- Use `showChips` when users need to see active filters.
- Use `showClear` when users need one-click filter reset.
- Use `dense` for compact admin/table filter areas.
- Use `layout="grid"` for many filters.
- Use `layout="stack"` for narrow panels and drawers.
- Use `sticky` only for filters that should remain visible while scrolling.
- Use `collapsible` and `collapsed` for advanced panels hidden behind a toggle.

## Workflows

### ApprovalFlow

Path: `src/components/shared/workflows/ApprovalFlow.jsx`  
Use for: Full approval workflow cards, requester details, approver lists, approval timelines, and workflow action summaries.  
Built with: `AppCard`, `AppStack`, `AppGrid`, `AppHeading`, `AppText`, `AppStatusBadge`, `AppAvatar`, `AppTimeline`, `AppButton`

Props:  
`title: string`, `description: string`, `status: string`, `requester: object`, `approvers: array`, `steps: array`, `primaryAction: object`, `secondaryAction: object`, `showRequester: boolean`, `showApprovers: boolean`, `showTimeline: boolean`, `loading: boolean`, `emptyText: string`, `sx: object`

Requester shape:  
`{ id: string | number, name: string, role: string, avatar: string }`

Approver shape:  
`{ id: string | number, name: string, role: string, avatar: string, status: string }`

Action shape:  
`{ label: string, onClick: function, colorVariant: string, loading: boolean, disabled: boolean }`

Values:  
`status=pending|approved|rejected|cancelled|escalated|failed|draft|in_review|processing`, `showRequester=true|false`, `showApprovers=true|false`, `showTimeline=true|false`, `loading=true|false`

Example:  
`<ApprovalFlow requester={requester} approvers={approvers} steps={steps} status="pending" primaryAction={{ label: "Approve", onClick: handleApprove }} />`

---

### WorkflowActions

Path: `src/components/shared/workflows/WorkflowActions.jsx`  
Use for: Workflow action bars, approval buttons, reject/approve controls, inline workflow actions, and card-based action sections.  
Built with: `AppCard`, `AppStack`, `AppButton`, `AppText`, `AppTooltip`

Props:  
`actions: array`, `align: string`, `direction: string`, `size: string`, `variant: string`, `loading: boolean`, `disabled: boolean`, `title: string`, `description: string`, `sx: object`

Action shape:  
`{ id: string | number, label: string, variant: string, colorVariant: string, size: string, loading: boolean, disabled: boolean, startIcon: ReactNode, endIcon: ReactNode, tooltip: string, onClick: function, sx: object }`

Values:  
`align=left|center|right`, `direction=row|column`, `size=small|medium|large`, `variant=card|inline`, `loading=true|false`, `disabled=true|false`

Example:  
`<WorkflowActions actions={[{ label: "Approve", colorVariant: "success", onClick: handleApprove }]} />`

---

### ApprovalHistory

Path: `src/components/shared/workflows/ApprovalHistory.jsx`  
Use for: Approval audit history, workflow activity timelines, approval event logs, and historical approval records.  
Built with: `AppCard`, `AppTimeline`, `AppHeading`, `AppText`, `AppStack`, `AppButton`

Props:  
`title: string`, `description: string`, `items: array`, `emptyTitle: string`, `emptyDescription: string`, `showHeader: boolean`, `showFooter: boolean`, `footerAction: object`, `timelineSize: string`, `loading: boolean`, `sx: object`

Footer action shape:  
`{ label: string, onClick: function, variant: string, colorVariant: string, size: string, startIcon: ReactNode, endIcon: ReactNode, loading: boolean, disabled: boolean }`

Values:  
`timelineSize=small|medium|large`, `showHeader=true|false`, `showFooter=true|false`, `loading=true|false`

Example:  
`<ApprovalHistory items={historyItems} showFooter footerAction={{ label: "View all", onClick: handleViewAll }} />`

---

### StatusTimeline

Path: `src/components/shared/workflows/StatusTimeline.jsx`  
Use for: Status change timelines, process timelines, workflow progress history, and current status tracking.  
Built with: `AppCard`, `AppTimeline`, `AppHeading`, `AppText`, `AppStack`, `AppStatusBadge`

Props:  
`title: string`, `description: string`, `status: string`, `items: array`, `timelineSize: string`, `colorVariant: string`, `showStatus: boolean`, `showHeader: boolean`, `emptyTitle: string`, `emptyDescription: string`, `sx: object`

Values:  
`status=pending|approved|rejected|cancelled|escalated|failed|draft|in_review|processing|success|error|warning|info`, `timelineSize=small|medium|large`, `colorVariant=primary|success|error|warning|info|dark`, `showStatus=true|false`, `showHeader=true|false`

Example:  
`<StatusTimeline status="processing" items={timelineItems} />`

---

### ApprovalBadge

Path: `src/components/shared/workflows/ApprovalBadge.jsx`  
Use for: Approval status labels, workflow state badges, review status badges, and clickable approval indicators.  
Built with: `AppBadge`, `AppTooltip`

Props:  
`status: string`, `label: string`, `size: string`, `variant: string`, `rounded: string`, `showIcon: boolean`, `showDot: boolean`, `tooltip: string`, `clickable: boolean`, `onClick: function`, `sx: object`, `...props: object`

Values:  
`status=approved|pending|rejected|cancelled|escalated|failed|draft|in_review`, `size=small|medium|large`, `variant=soft|filled|outlined`, `rounded=sm|md|lg|full`, `showIcon=true|false`, `showDot=true|false`, `clickable=true|false`

Example:  
`<ApprovalBadge status="approved" showIcon tooltip="Approved by manager" />`

---

### ApprovalStepper

Path: `src/components/shared/workflows/ApprovalStepper.jsx`  
Use for: Approval progress steppers, multi-step approval flows, approver progress tracking, and workflow stage visualization.  
Built with: `AppCard`, `AppStepper`, `AppHeading`, `AppText`, `AppStack`, `AppStatusBadge`, `AppAvatar`, `AppGrid`

Props:  
`title: string`, `description: string`, `steps: array`, `activeStep: number`, `approvers: array`, `orientation: string`, `size: string`, `clickable: boolean`, `onStepClick: function`, `showApprovers: boolean`, `showHeader: boolean`, `showStepStatus: boolean`, `currentStatus: string`, `sx: object`

Approver shape:  
`{ id: string | number, name: string, role: string, avatar: string, status: string }`

Values:  
`orientation=horizontal|vertical`, `size=small|medium|large`, `clickable=true|false`, `showApprovers=true|false`, `showHeader=true|false`, `showStepStatus=true|false`, `currentStatus=pending|approved|rejected|cancelled|escalated|failed|draft|in_review|processing`

Example:  
`<ApprovalStepper steps={steps} activeStep={1} approvers={approvers} currentStatus="pending" />`

---

### Workflows AI Rules

- Use `ApprovalFlow` for complete approval workflow summaries.
- Use `WorkflowActions` for approval, reject, submit, cancel, escalate, and workflow action buttons.
- Use `ApprovalHistory` for approval history and workflow audit activity.
- Use `StatusTimeline` for general status progress and lifecycle timelines.
- Use `ApprovalBadge` for approval-specific status badges.
- Use `ApprovalStepper` for multi-step approval progress.
- Never manually build approval workflow UI when these workflow components can be used.
- Use `ApprovalFlow` when requester, approvers, actions, and timeline need to appear together.
- Use `ApprovalStepper` when approval stage progress is the main focus.
- Use `ApprovalHistory` when the main content is historical activity.
- Use `StatusTimeline` when showing status changes over time.
- Use `WorkflowActions` when only workflow buttons/actions are needed.
- Pass arrays only to `approvers`, `steps`, `items`, and `actions`.
- Pass objects only to `requester`, `primaryAction`, `secondaryAction`, `footerAction`, and `sx`.
- Pass functions only to event props like `onClick`, `onStepClick`, and action handlers.
- Pass React elements only to icon props like `startIcon` and `endIcon`.
- Use status values consistently across `ApprovalBadge`, `AppStatusBadge`, `ApprovalFlow`, `StatusTimeline`, and `ApprovalStepper`.
- Use `loading` to disable workflow actions during async operations.
- Use `showHeader=false` only when the parent layout already provides a section heading.
- Use `showApprovers=false` when approver details are shown elsewhere.
- Use `showTimeline=false` when timeline/history is handled by `ApprovalHistory` or `StatusTimeline`.

## Attachments

### AttachmentUploader

Path: `src/components/shared/attachments/AttachmentUploader.jsx`  
Use for: Uploading attachments, drag-and-drop upload sections, pending upload lists, uploaded file lists, and attachment management panels.  
Built with: `FileDropzone`, `AttachmentList`, `AppCard`, `AppStack`, `AppBox`, `AppHeading`, `AppText`, `AppCaption`, `AppButton`, `AppBadge`

Props:  
`title: string`, `description: string`, `files: array`, `value: array`, `accept: string`, `multiple: boolean`, `maxSize: number`, `maxFiles: number`, `uploadLabel: string`, `browseLabel: string`, `loading: boolean`, `disabled: boolean`, `autoUpload: boolean`, `onChange: function`, `onUpload: function`, `onReject: function`, `onPreview: function`, `onDownload: function`, `onDelete: function`, `showList: boolean`, `listLayout: string`, `sx: object`

Values:  
`multiple=true|false`, `loading=true|false`, `disabled=true|false`, `autoUpload=true|false`, `showList=true|false`, `listLayout=list|grid`

Example:  
`<AttachmentUploader files={files} onUpload={handleUpload} onPreview={handlePreview} onDelete={handleDelete} />`

---

### AttachmentList

Path: `src/components/shared/attachments/AttachmentList.jsx`  
Use for: Displaying uploaded files, attachment lists, attachment grids, empty attachment states, and attachment actions.  
Built with: `FileCard`, `AppCard`, `AppStack`, `AppGrid`, `AppBox`, `AppHeading`, `AppText`, `AppCaption`, `AppBadge`, `AppEmptyState`, `AppInlineLoader`

Props:  
`title: string`, `description: string`, `files: array`, `layout: string`, `columns: object`, `loading: boolean`, `loadingText: string`, `emptyTitle: string`, `emptyDescription: string`, `showHeader: boolean`, `showCount: boolean`, `showPreview: boolean`, `showDownload: boolean`, `showDelete: boolean`, `onPreview: function`, `onDownload: function`, `onDelete: function`, `compact: boolean`, `bordered: boolean`, `surface: boolean`, `sx: object`

Values:  
`layout=list|grid`, `loading=true|false`, `showHeader=true|false`, `showCount=true|false`, `showPreview=true|false`, `showDownload=true|false`, `showDelete=true|false`, `compact=true|false`, `bordered=true|false`, `surface=true|false`

Example:  
`<AttachmentList files={files} layout="grid" onPreview={handlePreview} onDownload={handleDownload} />`

---

### FilePreview

Path: `src/components/shared/attachments/FilePreview.jsx`  
Use for: Generic file preview dialogs, image previews, PDF previews, file metadata display, and open/download actions.  
Built with: `AppDialog`, `AppStack`, `AppBox`, `AppText`, `AppCaption`, `AppButton`, `AppBadge`

Props:  
`open: boolean`, `onClose: function`, `file: object`, `title: string`, `subtitle: string`, `showDownload: boolean`, `showOpenNew: boolean`, `onDownload: function`, `onOpenNew: function`, `maxWidth: string`, `sx: object`

File shape:  
`{ id: string | number, name: string, size: number, type: string, mimeType: string, url: string, previewUrl: string }`

Values:  
`open=true|false`, `showDownload=true|false`, `showOpenNew=true|false`, `maxWidth=xs|sm|md|lg|xl`

Example:  
`<FilePreview open={previewOpen} file={selectedFile} onClose={closePreview} onDownload={downloadFile} />`

---

### FileCard

Path: `src/components/shared/attachments/FileCard.jsx`  
Use for: Single file cards, attachment rows, file metadata display, preview/download/delete actions, and upload status display.  
Built with: `AppCard`, `AppStack`, `AppBox`, `AppText`, `AppCaption`, `AppBadge`, `AppIconButton`, `AppTooltip`

Props:  
`file: object`, `name: string`, `size: number`, `type: string`, `url: string`, `thumbnail: string`, `status: string`, `showPreview: boolean`, `showDownload: boolean`, `showDelete: boolean`, `showType: boolean`, `showSize: boolean`, `onPreview: function`, `onDownload: function`, `onDelete: function`, `disabled: boolean`, `loading: boolean`, `variant: string`, `compact: boolean`, `sx: object`

File shape:  
`{ id: string | number, name: string, size: number, type: string, mimeType: string, url: string, thumbnail: string, status: string }`

Values:  
`status=pending|uploaded|failed`, `showPreview=true|false`, `showDownload=true|false`, `showDelete=true|false`, `showType=true|false`, `showSize=true|false`, `disabled=true|false`, `loading=true|false`, `variant=default|soft|ghost`, `compact=true|false`

Example:  
`<FileCard file={file} onPreview={handlePreview} onDownload={handleDownload} onDelete={handleDelete} />`

---

### FileDropzone

Path: `src/components/shared/attachments/FileDropzone.jsx`  
Use for: Drag-and-drop file upload areas, browse file inputs, upload validation, accepted file type hints, and max file/size limits.  
Built with: `AppBox`, `AppStack`, `AppText`, `AppHeading`, `AppCaption`, `AppButton`, `AppBadge`

Props:  
`title: string`, `description: string`, `accept: string`, `multiple: boolean`, `disabled: boolean`, `loading: boolean`, `maxSize: number`, `maxFiles: number`, `browseLabel: string`, `onFilesChange: function`, `onDrop: function`, `onReject: function`, `showAcceptedTypes: boolean`, `showLimits: boolean`, `sx: object`

Values:  
`multiple=true|false`, `disabled=true|false`, `loading=true|false`, `showAcceptedTypes=true|false`, `showLimits=true|false`

Example:  
`<FileDropzone accept=".pdf,.docx,image/*" maxFiles={5} maxSize={5242880} onFilesChange={handleFilesChange} />`

---

### PdfPreview

Path: `src/components/shared/attachments/PdfPreview.jsx`  
Use for: PDF preview dialogs, embedded PDF viewing, PDF open actions, and PDF download actions.  
Built with: `AppDialog`, `AppStack`, `AppBox`, `AppText`, `AppCaption`, `AppButton`, `AppBadge`

Props:  
`open: boolean`, `onClose: function`, `file: object`, `src: string`, `title: string`, `subtitle: string`, `showDownload: boolean`, `showOpenNew: boolean`, `onDownload: function`, `onOpenNew: function`, `maxWidth: string`, `sx: object`

File shape:  
`{ id: string | number, name: string, url: string, previewUrl: string }`

Values:  
`open=true|false`, `showDownload=true|false`, `showOpenNew=true|false`, `maxWidth=xs|sm|md|lg|xl`

Example:  
`<PdfPreview open={pdfOpen} file={selectedPdf} onClose={closePdf} onDownload={downloadPdf} />`

---

### ImagePreview

Path: `src/components/shared/attachments/ImagePreview.jsx`  
Use for: Image preview dialogs, full-size image viewing, image open actions, and image download actions.  
Built with: `AppDialog`, `AppStack`, `AppBox`, `AppText`, `AppCaption`, `AppButton`, `AppBadge`

Props:  
`open: boolean`, `onClose: function`, `image: object`, `src: string`, `alt: string`, `title: string`, `subtitle: string`, `showDownload: boolean`, `showOpenNew: boolean`, `onDownload: function`, `onOpenNew: function`, `maxWidth: string`, `sx: object`

Image shape:  
`{ id: string | number, name: string, url: string, previewUrl: string, thumbnail: string }`

Values:  
`open=true|false`, `showDownload=true|false`, `showOpenNew=true|false`, `maxWidth=xs|sm|md|lg|xl`

Example:  
`<ImagePreview open={imageOpen} image={selectedImage} onClose={closeImage} onDownload={downloadImage} />`

---

### Attachments AI Rules

- Use `AttachmentUploader` for complete upload + attachment management sections.
- Use `FileDropzone` when only drag-and-drop or browse upload input is needed.
- Use `AttachmentList` to display uploaded or existing files.
- Use `FileCard` for individual attachment rows or cards.
- Use `FilePreview` for generic preview handling across file types.
- Use `ImagePreview` for image-only preview dialogs.
- Use `PdfPreview` for PDF-only preview dialogs.
- Never manually build file cards or upload dropzones when these components can be used.
- Always pass arrays to `files` and `value`.
- Always pass file objects using the expected file shape.
- Always pass functions only to event props like `onChange`, `onUpload`, `onReject`, `onPreview`, `onDownload`, `onDelete`, and `onClose`.
- Always pass objects only to style props like `sx`.
- Use `accept` to restrict uploadable file types.
- Use `maxSize` and `maxFiles` for client-side validation.
- Always validate uploads again on the server.
- Use `autoUpload=true` only when files should upload immediately after selection.
- Use `showList=false` when uploaded files are displayed elsewhere.
- Use `layout="grid"` for visual-heavy attachment lists.
- Use `layout="list"` for compact document/file lists.
- Use `FilePreview` when file type may vary.
- Use `ImagePreview` only when the selected file is known to be an image.
- Use `PdfPreview` only when the selected file is known to be a PDF.
- Use `showPreview`, `showDownload`, and `showDelete` to control available file actions.

## Activity

### ActivityFeed

Path: `src/components/shared/activity/ActivityFeed.jsx`  
Use for: Recent activity lists, user activity feeds, record timelines, audit activity summaries, and activity cards.  
Built with: `AuditTrailItem`, `AppCard`, `AppStack`, `AppBox`, `AppHeading`, `AppText`, `AppBadge`, `AppEmptyState`, `AppInlineLoader`

Props:  
`title: string`, `description: string`, `items: array`, `loading: boolean`, `loadingText: string`, `emptyTitle: string`, `emptyDescription: string`, `showHeader: boolean`, `showCount: boolean`, `compact: boolean`, `maxHeight: number | string`, `scrollable: boolean`, `itemVariant: string`, `sx: object`

Values:  
`loading=true|false`, `showHeader=true|false`, `showCount=true|false`, `compact=true|false`, `scrollable=true|false`, `itemVariant=inline|card`

Example:  
`<ActivityFeed items={activities} loading={isLoading} scrollable maxHeight={420} />`

---

### AuditLog

Path: `src/components/shared/activity/AuditLog.jsx`  
Use for: Audit log tables, system event records, compliance logs, user action logs, and security/activity records.  
Built with: `AppTable`, `AppCard`, `AppStack`, `AppBox`, `AppHeading`, `AppText`, `AppBadge`, `AppEmptyState`, `AppInlineLoader`

Props:  
`title: string`, `description: string`, `rows: array`, `columns: array`, `loading: boolean`, `loadingText: string`, `showHeader: boolean`, `showCount: boolean`, `dense: boolean`, `maxHeight: number | string`, `emptyTitle: string`, `emptyDescription: string`, `sx: object`

Audit row shape:  
`{ id: string | number, time: string, user: string | object, action: string, module: string, description: string, ipAddress: string }`

Values:  
`loading=true|false`, `showHeader=true|false`, `showCount=true|false`, `dense=true|false`

Example:  
`<AuditLog rows={auditRows} maxHeight={520} />`

---

### ChangeHistory

Path: `src/components/shared/activity/ChangeHistory.jsx`  
Use for: Field-level change history, old/new value comparisons, record edit history, and change audit sections.  
Built with: `AppCard`, `AppStack`, `AppGrid`, `AppBox`, `AppHeading`, `AppText`, `AppCaption`, `AppBadge`, `AppEmptyState`, `AppInlineLoader`

Props:  
`title: string`, `description: string`, `changes: array`, `loading: boolean`, `loadingText: string`, `emptyTitle: string`, `emptyDescription: string`, `showHeader: boolean`, `showCount: boolean`, `compact: boolean`, `sx: object`

Change shape:  
`{ id: string | number, field: string, oldValue: any, newValue: any, type: string, user: string, time: string }`

Values:  
`type=added|removed|updated`, `loading=true|false`, `showHeader=true|false`, `showCount=true|false`, `compact=true|false`

Example:  
`<ChangeHistory changes={changes} compact />`

---

### AuditTrailDrawer

Path: `src/components/shared/activity/AuditTrailDrawer.jsx`  
Use for: Side drawer audit trails, activity drawers, audit logs, change history drawers, and exportable audit panels.  
Built with: `ActivityFeed`, `AuditLog`, `ChangeHistory`, `AppDrawer`, `AppStack`, `AppBox`, `AppText`, `AppBadge`, `AppButton`, `AppEmptyState`, `AppInlineLoader`

Props:  
`open: boolean`, `onClose: function`, `title: string`, `subtitle: string`, `mode: string`, `activities: array`, `auditRows: array`, `changes: array`, `loading: boolean`, `width: number | string`, `showExport: boolean`, `onExport: function`, `sx: object`

Values:  
`mode=activity|audit|changes`, `open=true|false`, `loading=true|false`, `showExport=true|false`

Example:  
`<AuditTrailDrawer open={open} onClose={closeDrawer} mode="activity" activities={activities} onExport={exportAuditTrail} />`

---

### AuditTrailItem

Path: `src/components/shared/activity/AuditTrailItem.jsx`  
Use for: Single activity items, audit trail rows, user action cards, inline activity records, and metadata display.  
Built with: `AppCard`, `AppStack`, `AppBox`, `AppText`, `AppCaption`, `AppBadge`, `AppAvatar`, `AppTooltip`

Props:  
`item: object`, `action: string`, `title: string`, `description: string`, `user: object`, `time: string`, `module: string`, `metadata: string | object`, `variant: string`, `compact: boolean`, `showAvatar: boolean`, `showBadge: boolean`, `showMetadata: boolean`, `sx: object`

Item shape:  
`{ id: string | number, action: string, title: string, description: string, user: object, time: string, module: string, metadata: string | object }`

User shape:  
`{ name: string, avatar: string, initials: string }`

Values:  
`action=created|updated|deleted|approved|rejected|login|attachment|comment|default`, `variant=card|inline`, `compact=true|false`, `showAvatar=true|false`, `showBadge=true|false`, `showMetadata=true|false`

Example:  
`<AuditTrailItem item={activity} variant="inline" compact />`

---

### Activity AI Rules

- Use `ActivityFeed` for general activity lists.
- Use `AuditLog` for structured audit records in table format.
- Use `ChangeHistory` for field-level old/new value comparisons.
- Use `AuditTrailDrawer` when activity, audit logs, or changes should appear in a side drawer.
- Use `AuditTrailItem` for individual activity records.
- Never manually build repeated activity or audit rows when these components can be used.
- Use `mode="activity"` in `AuditTrailDrawer` for feed-style activity.
- Use `mode="audit"` in `AuditTrailDrawer` for table-based audit records.
- Use `mode="changes"` in `AuditTrailDrawer` for field-level change history.
- Always pass arrays to `items`, `rows`, `activities`, `auditRows`, and `changes`.
- Always pass objects to `item`, `user`, `metadata`, and `sx`.
- Always pass functions only to event props like `onClose` and `onExport`.
- Use `loading` when records are being fetched.
- Use `showHeader=false` when the parent layout already provides a heading.
- Use `showCount=false` when count badges are not needed.
- Use `compact` for dense activity panels.
- Use `scrollable` with `maxHeight` for long activity feeds.
- Use `itemVariant="inline"` inside drawers or compact panels.
- Use `itemVariant="card"` for standalone activity feeds.
- Use `columns` in `AuditLog` only when custom audit table columns are needed.
- Use `metadata` in `AuditTrailItem` for extra audit details.

## Page

### PageContainer

Path: `src/components/shared/page/PageContainer.jsx`  
Use for: Page-level wrappers, responsive page containers, centered page layouts, and consistent page spacing.  
Built with: `AppContainer`, `AppStack`

Props:  
`children: ReactNode`, `maxWidth: string | number`, `fluid: boolean`, `centered: boolean`, `disablePadding: boolean`, `spacing: number | string`, `minHeight: number | string`, `sx: object`, `contentSx: object`, `...props: object`

Values:  
`maxWidth=sm|md|lg|xl|full|number`, `fluid=true|false`, `centered=true|false`, `disablePadding=true|false`

Example:  
`<PageContainer maxWidth="xl"><PageContent>Content</PageContent></PageContainer>`

---

### PageContent

Path: `src/components/shared/page/PageContent.jsx`  
Use for: Main page content sections, vertical page spacing, grouped page body content, and optional content surfaces.  
Built with: `AppBox`, `AppStack`

Props:  
`children: ReactNode`, `spacing: number | string`, `surface: boolean`, `bordered: boolean`, `rounded: boolean`, `elevation: boolean`, `padded: boolean`, `sx: object`, `...props: object`

Values:  
`surface=true|false`, `bordered=true|false`, `rounded=true|false`, `elevation=true|false`, `padded=true|false`

Example:  
`<PageContent spacing={3}>Sections</PageContent>`

---

### PageActions

Path: `src/components/shared/page/PageActions.jsx`  
Use for: Page header actions, toolbar buttons, action groups, CTA rows, and aligned page controls.  
Built with: `AppStack`

Props:  
`children: ReactNode`, `align: string`, `justify: string`, `direction: string`, `wrap: string`, `spacing: number | string`, `fullWidth: boolean`, `sx: object`, `...props: object`

Values:  
`align=stretch|flex-start|center|flex-end|baseline`, `justify=flex-start|center|flex-end|space-between|space-around|space-evenly`, `direction=row|column|row-reverse|column-reverse`, `wrap=nowrap|wrap|wrap-reverse`, `fullWidth=true|false`

Example:  
`<PageActions><AppButton>Create</AppButton></PageActions>`

---

### PageToolbar

Path: `src/components/shared/page/PageToolbar.jsx`  
Use for: Page toolbar rows, filter/action bars, sticky toolbars, page-level controls, and grouped toolbar content.  
Built with: `AppBox`, `AppStack`

Props:  
`children: ReactNode`, `justify: string`, `align: string`, `wrap: string`, `spacing: number | string`, `surface: boolean`, `bordered: boolean`, `rounded: boolean`, `elevation: boolean`, `padded: boolean`, `sticky: boolean`, `top: number | string`, `zIndex: number`, `sx: object`, `...props: object`

Values:  
`justify=flex-start|center|flex-end|space-between|space-around|space-evenly`, `align=stretch|flex-start|center|flex-end|baseline`, `wrap=nowrap|wrap|wrap-reverse`, `surface=true|false`, `bordered=true|false`, `rounded=true|false`, `elevation=true|false`, `padded=true|false`, `sticky=true|false`

Example:  
`<PageToolbar sticky surface bordered><FilterBar /><PageActions>Actions</PageActions></PageToolbar>`

---

### Page AI Rules

- Use `PageContainer` as the outer wrapper for every page.
- Use `PageContent` for the main page body.
- Use `PageActions` for page-level action buttons.
- Use `PageToolbar` for toolbar rows, filters, and grouped page controls.
- Never manually build page wrappers with raw layout components when page components can be used.
- Use `PageContainer` to control page max width, padding, centering, and vertical spacing.
- Use `PageContent` to keep page sections consistently spaced.
- Use `PageActions` inside headers, toolbars, and page footers.
- Use `PageToolbar` when actions, filters, or controls need a shared horizontal container.
- Use `sticky=true` on `PageToolbar` only when toolbar controls must stay visible during scroll.
- Pass React elements only to `children`.
- Pass objects only to style props like `sx` and `contentSx`.
- Pass booleans only to visual props like `surface`, `bordered`, `rounded`, `elevation`, `padded`, `fluid`, `centered`, `disablePadding`, `fullWidth`, and `sticky`.
- Prefer `spacing` props over custom margins for page layout consistency.
- Use `fluid=true` only for full-width dashboards or data-heavy pages.
- Use `disablePadding=true` only when the parent layout already controls padding.

## Display

### SummaryCards

Path: `src/components/shared/display/SummaryCards.jsx`  
Use for: Dashboard summary cards, KPI cards, metric cards, statistic cards, trend cards, and clickable overview cards.  
Built with: `AppGrid`, `AppCard`, `AppStack`, `AppBox`, `AppBadge`, `AppStatusBadge`, `AppText`, `AppHeading`, `AppTooltip`, `AppSkeleton`, `AppIconButton`

Props:  
`items: array`, `columns: object`, `loading: boolean`, `skeletonCount: number`, `variant: string`, `cardVariant: string`, `cardPadding: string`, `rounded: string`, `shadow: string`, `bordered: boolean`, `hoverable: boolean`, `showTrend: boolean`, `showStatus: boolean`, `showFooter: boolean`, `onCardClick: function`, `sx: object`, `cardSx: object`, `...props: object`

Item shape:  
`{ key: string, id: string | number, title: string, label: string, value: ReactNode, description: string, icon: ReactNode, iconTooltip: string, colorVariant: string, change: string, trend: string, trendColor: string, trendIcon: ReactNode, badge: string, badgeColor: string, status: string, statusLabel: string, footer: string, action: object, cardVariant: string, padding: string, rounded: string, shadow: string, bordered: boolean, hoverable: boolean, disabled: boolean, uppercaseLabel: boolean, onClick: function, sx: object }`

Values:  
`variant=default|compact|detailed`, `cardVariant=default|outlined|soft|ghost`, `cardPadding=sm|md|lg`, `rounded=sm|md|lg|xl|full`, `shadow=none|sm|md|lg`, `trend=up|increase|positive|down|decrease|negative|neutral`, `showTrend=true|false`, `showStatus=true|false`, `showFooter=true|false`, `loading=true|false`, `bordered=true|false`, `hoverable=true|false`

Example:  
`<SummaryCards items={summaryItems} loading={loading} onCardClick={handleCardClick} />`

---

### StatusBadge

Path: `src/components/shared/display/StatusBadge.jsx`  
Use for: Generic status badges, display status labels, active/inactive indicators, and lightweight status wrappers.  
Built with: `AppStatusBadge`

Props:  
`status: string`, `label: string`, `size: string`, `variant: string`, `rounded: string`, `showDot: boolean`, `showIcon: boolean`, `sx: object`, `...props: object`

Values:  
`size=small|medium|large`, `variant=soft|filled|outlined|text`, `rounded=sm|md|lg|full`, `showDot=true|false`, `showIcon=true|false`

Example:  
`<StatusBadge status="active" label="Active" />`

---

### DetailsSection

Path: `src/components/shared/display/DetailsSection.jsx`  
Use for: Detail panels, record details, profile details, grouped information sections, accordion detail groups, and compact details.  
Built with: `AppSection`, `AppStack`, `AppGrid`, `AppText`, `AppButton`, `AppIconButton`, `AppDescriptionList`, `AppAccordion`, `AppSkeleton`, `AppBox`

Props:  
`title: string`, `description: string`, `items: array`, `columns: object`, `loading: boolean`, `variant: string`, `size: string`, `bordered: boolean`, `surface: boolean`, `rounded: boolean`, `divider: boolean`, `collapsible: boolean`, `defaultExpanded: boolean`, `action: ReactNode`, `actions: array`, `emptyText: string`, `contentSx: object`, `sx: object`, `...props: object`

Action shape:  
`{ key: string, label: string, iconOnly: boolean, icon: ReactNode, tooltip: string, variant: string, colorVariant: string, size: string, startIcon: ReactNode, endIcon: ReactNode, onClick: function }`

Values:  
`variant=default|accordion|compact`, `size=small|medium|large`, `bordered=true|false`, `surface=true|false`, `rounded=true|false`, `divider=true|false`, `collapsible=true|false`, `defaultExpanded=true|false`, `loading=true|false`

Example:  
`<DetailsSection title="User Details" items={details} columns={{ xs: 1, md: 2 }} />`

---

### InfoGrid

Path: `src/components/shared/display/InfoGrid.jsx`  
Use for: Information cards, overview grids, entity summaries, clickable info tiles, profile cards, and compact info displays.  
Built with: `AppGrid`, `AppCard`, `AppStack`, `AppText`, `AppHeading`, `AppBadge`, `AppStatusBadge`, `AppAvatar`, `AppTooltip`, `AppSkeleton`, `AppBox`, `AppIconButton`

Props:  
`items: array`, `columns: object`, `loading: boolean`, `skeletonCount: number`, `variant: string`, `size: string`, `cardVariant: string`, `hoverable: boolean`, `bordered: boolean`, `rounded: string`, `shadow: string`, `onItemClick: function`, `emptyText: string`, `sx: object`, `cardSx: object`, `...props: object`

Item shape:  
`{ key: string, id: string | number, title: string, subtitle: string, value: ReactNode, description: string, icon: ReactNode, avatar: object, colorVariant: string, badge: string, badgeColor: string, status: string, footer: string, meta: string, action: object, cardVariant: string, bordered: boolean, rounded: string, shadow: string, hoverable: boolean, onClick: function, sx: object }`

Values:  
`variant=default|compact|bordered`, `size=small|medium|large`, `cardVariant=default|outlined|soft|ghost`, `rounded=sm|md|lg|xl|full`, `shadow=none|sm|md|lg`, `loading=true|false`, `hoverable=true|false`, `bordered=true|false`

Example:  
`<InfoGrid items={infoItems} columns={{ xs: 1, sm: 2, md: 3 }} />`

---

### KeyValueList

Path: `src/components/shared/display/KeyValueList.jsx`  
Use for: Key-value detail lists, settings summaries, metadata lists, profile attributes, and compact record summaries.  
Built with: `AppKeyValue`, `AppStatusBadge`, `AppBadge`, `AppBox`, `AppStack`, `AppText`, `AppHeading`, `AppSkeleton`, MUI `Divider`

Props:  
`title: string`, `description: string`, `items: array`, `loading: boolean`, `skeletonCount: number`, `variant: string`, `size: string`, `direction: string`, `bordered: boolean`, `surface: boolean`, `rounded: boolean`, `divider: boolean`, `dense: boolean`, `emptyText: string`, `sx: object`, `itemSx: object`, `headerSx: object`, `...props: object`

Item shape:  
`{ key: string, label: string, value: ReactNode, icon: ReactNode, badge: string, badgeColor: string, status: string, statusLabel: string, tag: string, tagColor: string, action: ReactNode, muted: boolean, ellipsis: boolean, props: object, sx: object }`

Values:  
`variant=default|card|minimal`, `size=small|medium|large`, `direction=row|column`, `bordered=true|false`, `surface=true|false`, `rounded=true|false`, `divider=true|false`, `dense=true|false`, `loading=true|false`

Example:  
`<KeyValueList title="Metadata" items={items} direction="row" />`

---

### DescriptionList

Path: `src/components/shared/display/DescriptionList.jsx`  
Use for: Description lists, structured detail grids, read-only field summaries, metadata sections, and card/minimal detail displays.  
Built with: `AppDescriptionList`, `AppBox`, `AppStack`, `AppText`, `AppHeading`, `AppSkeleton`

Props:  
`title: string`, `description: string`, `items: array`, `columns: number | string | object`, `loading: boolean`, `skeletonCount: number`, `variant: string`, `size: string`, `bordered: boolean`, `striped: boolean`, `dense: boolean`, `emptyText: string`, `sx: object`, `headerSx: object`, `listSx: object`, `itemSx: object`, `...props: object`

Values:  
`variant=default|card|minimal`, `size=small|medium|large`, `bordered=true|false`, `striped=true|false`, `dense=true|false`, `loading=true|false`

Example:  
`<DescriptionList title="Details" items={details} columns={2} />`

---

### Display AI Rules

- Use `SummaryCards` for dashboard KPIs, metrics, totals, and overview cards.
- Use `InfoGrid` for rich information tiles and clickable entity summary cards.
- Use `DetailsSection` for grouped record details inside a page section.
- Use `KeyValueList` for simple key-value metadata lists.
- Use `DescriptionList` for structured description/detail grids.
- Use `StatusBadge` for generic status display.
- Never manually build repeated summary, info, detail, or key-value display layouts when these components can be used.
- Use `SummaryCards` when values, trends, statuses, or KPI-style metrics are the main content.
- Use `InfoGrid` when each item needs title, subtitle, icon/avatar, description, badge/status, and optional action.
- Use `DetailsSection` when details need a heading, actions, collapsible behavior, or accordion layout.
- Use `DescriptionList` when displaying read-only field summaries in a grid.
- Use `KeyValueList` when displaying label-value pairs in a simple vertical list.
- Always pass arrays to `items`.
- Always pass objects to `columns`, `sx`, `cardSx`, `headerSx`, `listSx`, `itemSx`, and `contentSx`.
- Always pass functions only to event props like `onCardClick`, `onItemClick`, and action `onClick`.
- Always pass React elements only to props like `icon`, `action`, `actions`, `startIcon`, `endIcon`, `footer`, and item values when needed.
- Use `loading` and `skeletonCount` for async detail or summary sections.
- Use `variant="compact"` for dense dashboards or side panels.
- Use `variant="minimal"` when the parent container already provides surface, border, and padding.
- Use `variant="accordion"` in `DetailsSection` when grouped details should expand/collapse.
- Use `collapsible=true` when an entire details section should collapse.
- Use `emptyText` to customize no-data states.

## Dialogs

### ConfirmDialog

Path: `src/components/shared/dialogs/ConfirmDialog.jsx`  
Use for: Generic confirmation dialogs, destructive confirmations, status confirmations, and async confirm actions.  
Built with: `AppDialog`, `AppAlert`, `AppStack`, `AppText`, `AppButton`, `AppLoadingButton`

Props:  
`open: boolean`, `onClose: function`, `onConfirm: function`, `title: string`, `description: string`, `confirmText: string`, `cancelText: string`, `severity: string`, `variant: string`, `loading: boolean`, `disabled: boolean`, `showAlert: boolean`, `alertTitle: string`, `alertMessage: string`, `maxWidth: string`, `closeOnBackdrop: boolean`, `confirmButtonProps: object`, `cancelButtonProps: object`, `children: ReactNode`, `sx: object`, `...props: object`

Values:  
`severity=warning|error|info|success`, `variant=soft|outlined|filled`, `loading=true|false`, `disabled=true|false`, `showAlert=true|false`, `closeOnBackdrop=true|false`, `maxWidth=xs|sm|md|lg|xl`

Example:  
`<ConfirmDialog open={open} onClose={closeDialog} onConfirm={handleConfirm} title="Are you sure?" />`

---

### FilterDialog

Path: `src/components/shared/dialogs/FilterDialog.jsx`  
Use for: Opening advanced filters in a dialog, applying table filters, resetting filter values, and mobile-friendly filter panels.  
Built with: `AppDialog`, `FilterBar`, `AppButton`, `AppIconButton`, `AppStack`

Props:  
`filters: array`, `values: object`, `onChange: function`, `onReset: function`, `onApply: function`, `title: string`, `subtitle: string`, `trigger: ReactNode`, `triggerText: string`, `triggerTooltip: string`, `open: boolean`, `onOpen: function`, `onClose: function`, `applyText: string`, `resetText: string`, `cancelText: string`, `disabled: boolean`, `loading: boolean`, `size: string`, `maxWidth: string`, `showSearch: boolean`, `searchKey: string`, `searchPlaceholder: string`, `showReset: boolean`, `triggerVariant: string`, `closeOnBackdrop: boolean`, `sx: object`

Values:  
`triggerVariant=button|icon`, `size=small|medium|large`, `maxWidth=xs|sm|md|lg|xl`, `showSearch=true|false`, `showReset=true|false`, `disabled=true|false`, `loading=true|false`, `closeOnBackdrop=true|false`

Example:  
`<FilterDialog filters={filters} values={filterValues} onApply={handleApplyFilters} />`

---

### DeleteConfirmDialog

Path: `src/components/shared/dialogs/DeleteConfirmDialog.jsx`  
Use for: Delete confirmations, permanent action warnings, selected item deletion, and destructive record removal dialogs.  
Built with: `AppDialog`, `AppAlert`, `AppStack`, `AppBox`, `AppText`, `AppHeading`, `AppButton`, `AppLoadingButton`, `AppBadge`

Props:  
`open: boolean`, `onClose: function`, `onConfirm: function`, `title: string`, `description: string`, `itemName: string`, `itemType: string`, `confirmText: string`, `cancelText: string`, `loading: boolean`, `disabled: boolean`, `severity: string`, `showWarning: boolean`, `warningTitle: string`, `warningMessage: string`, `showItemBadge: boolean`, `maxWidth: string`, `confirmButtonProps: object`, `cancelButtonProps: object`, `sx: object`

Values:  
`severity=error|warning|info|success`, `loading=true|false`, `disabled=true|false`, `showWarning=true|false`, `showItemBadge=true|false`, `maxWidth=xs|sm|md|lg|xl`

Example:  
`<DeleteConfirmDialog open={open} itemName="User record" onConfirm={handleDelete} onClose={closeDialog} />`

---

### UnsavedChangesDialog

Path: `src/components/shared/dialogs/UnsavedChangesDialog.jsx`  
Use for: Unsaved form changes, route leave confirmations, save-before-exit flows, discard changes prompts, and guarded navigation.  
Built with: `AppDialog`, `AppAlert`, `AppStack`, `AppBox`, `AppText`, `AppHeading`, `AppButton`, `AppLoadingButton`

Props:  
`open: boolean`, `onClose: function`, `onSave: function`, `onDiscard: function`, `onCancel: function`, `title: string`, `description: string`, `warningTitle: string`, `warningMessage: string`, `saveText: string`, `discardText: string`, `cancelText: string`, `saveLoading: boolean`, `discardLoading: boolean`, `saveDisabled: boolean`, `discardDisabled: boolean`, `showSave: boolean`, `showDiscard: boolean`, `showWarning: boolean`, `maxWidth: string`, `saveButtonProps: object`, `discardButtonProps: object`, `cancelButtonProps: object`, `sx: object`

Values:  
`saveLoading=true|false`, `discardLoading=true|false`, `saveDisabled=true|false`, `discardDisabled=true|false`, `showSave=true|false`, `showDiscard=true|false`, `showWarning=true|false`, `maxWidth=xs|sm|md|lg|xl`

Example:  
`<UnsavedChangesDialog open={hasUnsavedChanges} onSave={handleSave} onDiscard={handleDiscard} onClose={closeDialog} />`

---

### Dialogs AI Rules

- Use `ConfirmDialog` for generic confirmation flows.
- Use `DeleteConfirmDialog` for delete or permanent destructive actions.
- Use `UnsavedChangesDialog` for unsaved form, navigation, and discard/save flows.
- Use `FilterDialog` for advanced filter flows and mobile-friendly filter panels.
- Never build confirmation dialogs manually when these shared dialogs can be used.
- Never use raw MUI `Dialog` directly in pages.
- Always control dialogs with an `open` boolean.
- Always pass functions only to event props like `onClose`, `onConfirm`, `onSave`, `onDiscard`, `onCancel`, `onApply`, and `onReset`.
- Always pass objects only to style or override props like `sx`, `confirmButtonProps`, `cancelButtonProps`, `saveButtonProps`, and `discardButtonProps`.
- Always use `loading` props to prevent duplicate confirm, save, delete, or discard actions.
- Use `disabled` props when the action should be blocked.
- Use `closeOnBackdrop=false` for destructive or important confirmations.
- Use `severity="error"` for delete and destructive actions.
- Use `severity="warning"` for risky but reversible actions.
- Use `showWarning` or `showAlert` when the user needs extra context before confirming.
- Use `itemName` and `showItemBadge` in `DeleteConfirmDialog` when deleting a known record.
- Use `showSave` and `showDiscard` in `UnsavedChangesDialog` to customize save/discard flows.
- Use `triggerVariant="icon"` in `FilterDialog` for compact toolbar filter buttons.

## Permissions

### Can

Path: `src/components/shared/permissions/Can.jsx`  
Use for: Conditional UI rendering based on user roles, permissions, or both.  
Built with: `AppNoPermission`

Props:  
`children: ReactNode`, `user: object`, `roles: string | array`, `permissions: string | array`, `requireAll: boolean`, `fallback: ReactNode`, `showFallback: boolean`, `noPermissionTitle: string`, `noPermissionDescription: string`, `render: function`

User shape:  
`{ role: string, roles: array, permissions: array }`

Values:  
`requireAll=true|false`, `showFallback=true|false`

Example:  
`<Can user={user} permissions="users.create"><AppButton>Create User</AppButton></Can>`

---

### RoleGuard

Path: `src/components/shared/permissions/RoleGuard.jsx`  
Use for: Protecting pages, routes, layouts, or sections based on user roles.  
Built with: React Router `Navigate`, `AppNoPermission`

Props:  
`children: ReactNode`, `user: object`, `roles: string | array`, `requireAll: boolean`, `redirectTo: string`, `fallback: ReactNode`, `showFallback: boolean`, `noPermissionTitle: string`, `noPermissionDescription: string`, `loading: boolean`, `loadingFallback: ReactNode`

User shape:  
`{ role: string, roles: array }`

Values:  
`requireAll=true|false`, `showFallback=true|false`, `loading=true|false`

Example:  
`<RoleGuard user={user} roles={["admin", "manager"]} redirectTo="/dashboard"><AdminPage /></RoleGuard>`

---

### PermissionGuard

Path: `src/components/shared/permissions/PermissionGuard.jsx`  
Use for: Protecting pages, routes, layouts, or sections based on user permissions.  
Built with: React Router `Navigate`, `AppNoPermission`

Props:  
`children: ReactNode`, `user: object`, `permissions: string | array`, `requireAll: boolean`, `redirectTo: string`, `fallback: ReactNode`, `showFallback: boolean`, `noPermissionTitle: string`, `noPermissionDescription: string`, `loading: boolean`, `loadingFallback: ReactNode`

User shape:  
`{ permissions: array }`

Values:  
`requireAll=true|false`, `showFallback=true|false`, `loading=true|false`

Example:  
`<PermissionGuard user={user} permissions="reports.view"><ReportsPage /></PermissionGuard>`

---

### Permissions AI Rules

- Use `Can` for conditional rendering inside pages and components.
- Use `RoleGuard` for route-level or page-level role protection.
- Use `PermissionGuard` for route-level or page-level permission protection.
- Use `roles` when access depends on user role names.
- Use `permissions` when access depends on capability strings.
- Use `requireAll=false` when the user needs any one role or permission.
- Use `requireAll=true` when the user must have every required role or permission.
- Use `redirectTo` when unauthorized users should be redirected.
- Use `fallback` when unauthorized users should see custom UI.
- Use `showFallback=true` when unauthorized users should see `AppNoPermission`.
- Use `loading=true` while user access data is being fetched.
- Use `loadingFallback` for loaders or skeletons during auth loading.
- Never manually duplicate role or permission checks inside page JSX when `Can`, `RoleGuard`, or `PermissionGuard` can be used.
- Never use `RoleGuard` for permission-only checks.
- Never use `PermissionGuard` for role-only checks.
- Always pass strings or arrays to `roles` and `permissions`.
- Always pass functions only to `render`.
- Always pass React elements only to `children`, `fallback`, and `loadingFallback`.
- Keep permission names consistent with backend capability keys.

## Import Export

### ImportWizard

Path: `src/components/shared/import-export/ImportWizard.jsx`  
Use for: Multi-step import flows, file upload imports, preview-before-import workflows, and import completion dialogs.  
Built with: `AppDialog`, `AppStepper`, `AppFileUpload`, `AppTable`, `AppAlert`, `AppButton`, `AppLoadingButton`, `AppCard`, `AppBox`, `AppStack`, `AppHeading`, `AppText`, `AppEmptyState`

Props:  
`open: boolean`, `onClose: function`, `title: string`, `subtitle: string`, `steps: array`, `acceptedFileTypes: string`, `file: File | object`, `onFileChange: function`, `columns: array`, `rows: array`, `loading: boolean`, `importing: boolean`, `error: string`, `successMessage: string`, `onImport: function`, `onBack: function`, `importButtonText: string`, `nextButtonText: string`, `backButtonText: string`, `maxWidth: string`, `sx: object`

Step shape:  
`{ label: string, description: string }`

Values:  
`acceptedFileTypes=.csv,.xlsx,.xls`, `loading=true|false`, `importing=true|false`, `maxWidth=xs|sm|md|lg|xl`

Example:  
`<ImportWizard open={open} file={file} onFileChange={setFile} columns={columns} rows={rows} onImport={handleImport} onClose={closeWizard} />`

---

### ExportButton

Path: `src/components/shared/import-export/ExportButton.jsx`  
Use for: Export buttons, async export actions, CSV/Excel/PDF download triggers, and report export CTAs.  
Wraps: `AppLoadingButton`

Props:  
`children: ReactNode`, `onClick: function`, `loading: boolean`, `disabled: boolean`, `format: string`, `loadingText: string`, `variant: string`, `colorVariant: string`, `size: string`, `rounded: string`, `startIcon: ReactNode`, `sx: object`, `...props: object`

Values:  
`format=CSV|Excel|PDF`, `variant=contained|outlined|text|soft|gradient`, `colorVariant=primary|success|error|warning|info|dark`, `size=small|medium|large`, `rounded=sm|md|lg|full`, `loading=true|false`, `disabled=true|false`

Example:  
`<ExportButton loading={isExporting} onClick={handleExport}>Export CSV</ExportButton>`

---

### CsvTemplateDownload

Path: `src/components/shared/import-export/CsvTemplateDownload.jsx`  
Use for: CSV template downloads, import format guidance, required column previews, and template download cards.  
Built with: `AppButton`, `AppCard`, `AppStack`, `AppHeading`, `AppText`, `AppAlert`

Props:  
`title: string`, `description: string`, `fileName: string`, `templateUrl: string`, `columns: array`, `buttonText: string`, `variant: string`, `colorVariant: string`, `showColumns: boolean`, `disabled: boolean`, `onDownload: function`, `sx: object`

Values:  
`variant=default|outlined|soft|elevated`, `colorVariant=primary|success|error|warning|info|dark`, `showColumns=true|false`, `disabled=true|false`

Example:  
`<CsvTemplateDownload templateUrl="/templates/users.csv" columns={["name", "email", "role"]} />`

---

### ImportPreviewTable

Path: `src/components/shared/import-export/ImportPreviewTable.jsx`  
Use for: Previewing imported records, showing row import statuses, import validation errors, warnings, and paginated preview tables.  
Built with: `AppCard`, `AppStack`, `AppHeading`, `AppText`, `AppAlert`, `AppTable`, `AppTablePagination`, `AppEmptyState`, `AppStatusBadge`

Props:  
`title: string`, `description: string`, `columns: array`, `rows: array`, `page: number`, `pageSize: number`, `totalItems: number`, `onPageChange: function`, `onPageSizeChange: function`, `loading: boolean`, `errors: array`, `warnings: array`, `selectable: boolean`, `selectedIds: array`, `onSelectRow: function`, `onSelectAll: function`, `showRowStatus: boolean`, `bordered: boolean`, `rounded: boolean`, `sx: object`

Values:  
`loading=true|false`, `selectable=true|false`, `showRowStatus=true|false`, `bordered=true|false`, `rounded=true|false`

Example:  
`<ImportPreviewTable columns={columns} rows={previewRows} errors={errors} warnings={warnings} />`

---

### Import Export AI Rules

- Use `ImportWizard` for complete multi-step import flows.
- Use `CsvTemplateDownload` before import flows when users need a sample/template CSV.
- Use `ImportPreviewTable` when imported rows must be reviewed before confirmation.
- Use `ExportButton` for simple one-click export actions.
- Use table-level `AppExport` when export belongs inside a table toolbar.
- Never build custom import wizards manually when `ImportWizard` can be used.
- Never use raw file inputs for import flows when `AppFileUpload` or `ImportWizard` can be used.
- Always pass arrays to `columns`, `rows`, `steps`, `errors`, and `warnings`.
- Always pass functions only to event props like `onClose`, `onFileChange`, `onImport`, `onBack`, `onDownload`, `onClick`, `onPageChange`, and `onPageSizeChange`.
- Always pass objects only to style props like `sx`.
- Use `loading` while parsing or previewing files.
- Use `importing` while the final import request is running.
- Use `errors` for invalid import records or blocking validation issues.
- Use `warnings` for non-blocking import issues.
- Use `showRowStatus=true` when preview rows include import status values.
- Use `acceptedFileTypes` to restrict supported import file types.
- Use `templateUrl` for direct downloadable templates.
- Use `onDownload` when template generation is handled in code.
- Use `ExportButton` for standalone exports outside tables.
- Use `format` to make export button text clear when no custom children are passed.
