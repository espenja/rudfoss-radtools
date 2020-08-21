# React YAFL

React YAFL (Yet Another Form Library) is a small hook-, and context-based form library inspired by [React Hook Form](https://react-hook-form.com/) that, unlike React Hook Form does not assume anything about the actual input elements. This makes it easier to use with custom UI libraries.

## Usage

A simple form setup with no custom child-components works like this:

```tsx
import { useForm, useField, FormProvider } from "@rudfoss/react-yafl"

export const MyForm: React.FC = () => {
	const form = useForm()
	const { value: firstName, set: setFirstName } = useField("firstname", form)
	const { value: lastName, set: setLastName } = useField("lastname", form)

	return (
		<form>
			<input type="text" value={firstName || ""} onChange={(evt) => setFirstName(evt.target.value)} />
			<input type="text" value={lastName || ""} onChange={(evt) => setLastName(evt.target.value)} />
		</form>
	)
}
```

However in most scenarios where you build forms you probably require some form of custom component for the individual input elements. This may be for styling, accessibility or other logic. In such scenarios React YAFL makes it easy to separate the field logic:

```tsx
import { useForm, useField, FormProvider } from "@rudfoss/react-yafl"

interface MyTextInputProps {
	label: string
	name: string
}
const MyTextInput: React.FC = ({ name, label }) => {
	const { value = "", set, errors } = useField(name)

	return (
		<div>
			<label htmlFor={name}>{label}</label>
			<input type="text" value={value} onChange={(evt) => set(evt.target.value)} />
			{errors && (<p>{errors[0].message</p>)}
		</div>
	)
}

export const MyForm: React.FC = () => {
	const form = useForm()

	return (
		<form>
			<MyTextInput name="firstname" label="First name" />
			<MyTextInput name="lastname" label="Last name" />
		</form>
	)
}
```

## Differences from React Hook Form

The core idea for React YAFL is to use context and hooks to access a generic API for managing form state in an efficient and fast manner. React Hook Form does a lot of magic behind the scenes in order to detect things like whether the component is a checkbox input or not. However when working with UI libraries such as Material UI you often cannot detect this immediately because the actual html input is not directly accesible.

One of the most annoying things I've encountered is the fact that if a value or default value in the form is a `boolean` it is assumed that the change handler should check for `evt.target.checked`. This works for the primitive `<input type="checkbox">` scenario, but I never usually work directly with these inputs so it became a hassle for me to work around.

As an example here is how you connect a Material UI checkbox to the form using the React YAFL:

```tsx
import { useField } from "@rudfoss/react-yafl"
// ...

const { value, set } = useField("approval")

return <Checkbox value={value} onChange={(evt, checked) => set(checked)} />
```

and using React Hook Form:

```tsx
import { useFormContext, Controller } from "react-hook-form"
// ...

const { control } = useFormContext()

// Now we must wrap the checkbox in a controller and ensure that magical props are mapped accordingly
return <Controller control={control} name="approval" defaultValue={false} as={Checkbox} />
```

All of this simply because React Hook Form attempts to "detect" the type of input you want. This gets even more complex once you start having more complex values in your form state.

React YAFL is only concerned with storing the form state and validation information. Everything else is up to you to implement. With that said more features are planned for the library over time, though in such a way as to not obstruct the core API.

Validation is also centralized and optimized so that you can easily perform validation for one, many or all fields depending on the type of state change that occurred.

Because the API only cares about the raw data you are free to hook up any library or element you wish to it. There is no magical behind-the-scenes detection of types meaning that data is treated as just data. You don't need to know that boolean values are different from other types of values. They are all values as far as React YAFL is concerned.
