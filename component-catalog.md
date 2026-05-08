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
Props: `title`, `value`, `subtitle`, `icon`, `trend`, `trendDirection`, `colorVariant`, `loading`, `sx`  
Values: `colorVariant=primary|success|error|warning|info|dark|neutral`, `trendDirection=up|down|neutral`  
Example: `<AppKpiCard title="Revenue" value="$24,500" trend="+12%" trendDirection="up" colorVariant="success" />`

---

### AppBarChart

Path: `src/components/ui/charts/AppBarChart.jsx`  
Use for: Category comparisons, grouped metrics, stacked totals, ranking charts, horizontal comparisons.  
Replaces: Direct `@mui/x-charts/BarChart` usage in pages.  
Props: `data`, `bars`, `xKey`, `title`, `subtitle`, `height`, `variant`, `layout`, `showLegend`, `showGrid`, `loading`, `emptyText`, `valueFormatter`, `sx`  
Bar shape: `{ key, label, colorVariant }`  
Values:

- `variant=grouped|stacked`
- `layout=vertical|horizontal`
- `colorVariant=primary|success|error|warning|info|dark|neutral`

Example:

```jsx
<AppBarChart
  title="Monthly Revenue"
  subtitle="Q1 Performance"
  data={[
    { month: "Jan", sales: 4000, profit: 2400 },
    { month: "Feb", sales: 3000, profit: 1398 },
    { month: "Mar", sales: 5000, profit: 3200 },
  ]}
  xKey="month"
  bars={[
    {
      key: "sales",
      label: "Sales",
      colorVariant: "primary",
    },
    {
      key: "profit",
      label: "Profit",
      colorVariant: "success",
    },
  ]}
  variant="grouped"
  layout="vertical"
/>
```

---

### AppLineChart

Path: `src/components/ui/charts/AppLineChart.jsx`  
Use for: Trends over time, analytics timelines, comparative growth charts, activity monitoring.  
Replaces: Direct `@mui/x-charts/LineChart` usage in pages.  
Props: `data`, `lines`, `xKey`, `title`, `subtitle`, `height`, `curve`, `showLegend`, `showGrid`, `showArea`, `stacked`, `loading`, `emptyText`, `valueFormatter`, `xValueFormatter`, `sx`  
Line shape: `{ key, label, colorVariant, curve, area, showMark, stacked }`  
Values: `curve=linear|monotone|step|stepBefore|stepAfter|natural`, `colorVariant=primary|success|error|warning|info|dark|neutral`  
Example: `<AppLineChart title="Visitors" data={visitorData} xKey="date" lines={[{ key: "visitors", label: "Visitors", colorVariant: "info" }]} />`

---

### AppAreaChart

Path: `src/components/ui/charts/AppAreaChart.jsx`  
Use for: Filled trend charts, cumulative metrics, stacked area comparisons, volume-over-time visuals.  
Replaces: Direct `@mui/x-charts/LineChart` usage when area styling is required.  
Props: `data`, `areas`, `xKey`, `title`, `subtitle`, `height`, `curve`, `showLegend`, `showGrid`, `stacked`, `showMark`, `loading`, `emptyText`, `valueFormatter`, `xValueFormatter`, `maxWidth`, `sx`, `chartSx`  
Area shape: `{ key, label, colorVariant, color, curve, stacked, showMark }`  
Values: `curve=linear|monotone|step|stepBefore|stepAfter|natural`, `colorVariant=primary|success|error|warning|info|dark|neutral`  
Example: `<AppAreaChart title="Revenue Trend" data={revenueData} xKey="month" stacked areas={[{ key: "product", label: "Product", colorVariant: "primary" }]} />`

---

### AppPieChart

Path: `src/components/ui/charts/AppPieChart.jsx`  
Use for: Category distribution, percentage breakdowns, donut charts, single-series share visuals.  
Replaces: Direct `@mui/x-charts/PieChart` usage in pages.  
Props: `data`, `title`, `subtitle`, `height`, `variant`, `innerRadius`, `outerRadius`, `paddingAngle`, `cornerRadius`, `startAngle`, `endAngle`, `showLegend`, `showLabels`, `labelType`, `loading`, `emptyText`, `valueFormatter`, `sx`, `chartSx`  
Data shape: `{ id, label, value, colorVariant, color }`  
Values: `variant=pie|donut`, `labelType=value|percent|both`, `colorVariant=primary|success|error|warning|info|dark|neutral`  
Example: `<AppPieChart title="Lead Sources" data={[{ label: "Organic", value: 45, colorVariant: "primary" }]} variant="donut" />`

---

### Chart AI Rules

- Use `AppKpiCard` for single metrics before building custom stat cards.
- Use `AppBarChart` for category comparisons, grouped bars, stacked totals, and horizontal ranking charts.
- Use `AppLineChart` for trend lines and time-series comparisons.
- Use `AppAreaChart` for filled trend charts and stacked volume/cumulative views.
- Use `AppPieChart` only for simple part-to-whole distribution charts.
- Do not use raw `@mui/x-charts` components directly in pages when these wrappers fit.
- Pass semantic chart colors through `colorVariant`; avoid hardcoded colors in page code.
- Keep chart data normalized as arrays of objects and configure series through `bars`, `lines`, or `areas`.
- Use `loading` and `emptyText` states instead of rendering ad hoc placeholders around charts.
- Use `sx` or `chartSx` only for page-specific layout overrides.
