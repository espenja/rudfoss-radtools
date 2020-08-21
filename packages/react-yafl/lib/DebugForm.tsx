import React, { useMemo, useState, useEffect } from "react"
import { useValueWatcher, useErrorWatcher } from "./useField"
import { useFormContext } from "./useForm"

interface DebugFormProps {
	names?: string | string[]
}

export const DebugForm: React.FC<DebugFormProps> = (props) => {
	const [visible, setVisible] = useState(false)
	const toggleVisible = (evt: MouseEvent) => {
		if (evt.ctrlKey && evt.shiftKey) {
			setVisible(!visible)
		}
	}

	const form = useFormContext()
	const values = useValueWatcher(props.names)
	const errors = useErrorWatcher(props.names)

	const data = useMemo(() => {
		if (props.names && !Array.isArray(props.names)) {
			const data = { [props.names]: values }
			if (errors && errors.length > 0) {
				data[props.names] = `${data[props.names]} - ${errors[0].message}`
			}
			return data
		}

		const internalData: any = {}
		for (const [key, value] of Object.entries(values)) {
			internalData[key] = value
		}
		for (const [key, value] of Object.entries(errors)) {
			if (!value) continue // Ignore undefined values

			if (internalData[key]) {
				internalData[key] = `${internalData[key]} - ${errors[key][0].message}`
				continue
			}

			internalData[key] = value
		}
		return internalData
	}, [values, errors, props.names])

	const onSave = () => {
		window.localStorage.setItem("formstate", JSON.stringify(form.getState()))
	}
	const onLoad = (silent = false) => () => {
		const state = window.localStorage.getItem("formstate")
		if (state) {
			form.setState(JSON.parse(state), silent)
		}
	}
	const onValidate = async () => {
		const result = await form.validate()
		console.log("validation result", result)
	}
	const onCheck = () => form.check()
	const onReset = () => form.reset()
	const onDump = () => console.log("STATE DUMP", form.getState())

	useEffect(() => {
		document.body.addEventListener("dblclick", toggleVisible)
		return () => {
			document.body.removeEventListener("dblclick", toggleVisible)
		}
	}, [visible])

	if (!visible) {
		return null
	}

	return (
		<div>
			<hr />
			<h3>Controls</h3>
			<div>
				<button type="button" onClick={onSave}>
					Save
				</button>
				<button type="button" onClick={onLoad()}>
					Load
				</button>
				<button type="button" onClick={onLoad(true)}>
					Load silent
				</button>
				<button type="button" onClick={onValidate}>
					Validate
				</button>
				<button type="button" onClick={onCheck}>
					Check
				</button>
				<button type="button" onClick={onDump}>
					Dump
				</button>
				<button type="button" onClick={onReset}>
					Reset
				</button>
			</div>
			<h3>State</h3>
			<pre>
				<code>{JSON.stringify(data, null, 1)}</code>
			</pre>
			<hr />
		</div>
	)
}

export default DebugForm
