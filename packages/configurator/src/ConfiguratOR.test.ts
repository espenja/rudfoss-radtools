// tslint:disable: no-string-literal

import ConfiguratOR from "./ConfiguratOR"

const mockConfig = () => ({
	stringValue: "this is a string value",
	numericValue: 1234,
	zero: 0,
	boolFalse: false,
	boolValue: true,
	arrayValue: [
		"this",
		"is",
		"an",
		{
			value: "array",
			placeholder: "::foo BAR1 bar2 'bar 3'"
		}
	],
	parent: {
		child: {
			leaf: {
				value: 42,
				anotherValue: "123abc"
			}
		},
		anArray: [
			"::bar FEE FI FOO FUM"
		]
	}
})

describe("ConfiguratOR", () => {
	it("is defined", () => {
		expect(typeof ConfiguratOR).toBe("function")
	})

	it("instantiates correctly", () => {
		expect(() => new ConfiguratOR()).not.toThrow()
	})
	it("is set with correct default settings", () => {
		const inst = new ConfiguratOR()
		expect(inst["_settings"]).toEqual({
			placeholderPrefix: "::",
			throwListenerErrors: false,
			waitForAsyncListeners: false,
			writeProtect: false,
			ignoreUnknownPlaceholders: false
		})
	})
	it("allows override of all settings", () => {
		const settings = {
			onSetError: () => "",
			placeholderPrefix: "//",
			throwListenerErrors: true,
			waitForAsyncListeners: true,
			writeProtect: true,
			ignoreUnknownPlaceholders: true
		}
		const inst = new ConfiguratOR(settings)
		expect(inst["_settings"]).toEqual(settings)
	})

	describe("set()", () => {
		it("supports setting config", async () => {
			const inst = new ConfiguratOR({
				ignoreUnknownPlaceholders: true
			})
			const config = mockConfig()
			await inst.set(config)
			expect(inst.get()).toEqual(config)
		})
		it("sets in an immutable way", async () => {
			const inst = new ConfiguratOR()
			const config = {
				parent: "parent",
				child: {
					child: "child",
					leaf: {
						leaf: "leaf"
					}
				}
			}
			await inst.set(config)
			const getConfig = inst.get()
			expect(getConfig).not.toBe(config)
			expect(getConfig).toEqual(config)

			await inst.set("child.child", "changed")
			expect(inst.get()).not.toBe(config)
			expect(inst.get()).not.toEqual(getConfig)
			expect(inst.get().child.leaf).toBe(getConfig.child.leaf)
		})

		it("supports setting subset of config without modifying untouched config segments", async () => {
			const inst = new ConfiguratOR({
				ignoreUnknownPlaceholders: true
			})
			const config = mockConfig() as any

			await inst.set(config)
			expect(inst.get("parent.child")).toBe(config.parent.child)
			await inst.set("parent.child", { secretValue: 42 })
			expect(inst.get("parent.child")).not.toEqual(config.parent.child)
			expect(inst.get("parent.child")).toEqual({secretValue: 42})
			expect(inst.get("arrayValue")).toBe(config.arrayValue)
		})
		it("processes setters only once per stack", async () => {
			const inst = new ConfiguratOR({
				ignoreUnknownPlaceholders: true
			})
			const config = mockConfig() as any

			const mockHandler = inst["_handleSetterQueue"] = jest.fn(inst["_handleSetterQueue"].bind(inst))
			const promise = inst.set(config)
			const secondPromise = inst.set({
				floatValue: 123.456
			})
			expect(promise).toBe(secondPromise)
			expect(mockHandler.mock.calls.length).toBe(1)
			await promise
			expect(inst.get()).toEqual({
				...config,
				floatValue: 123.456
			})
		})
		it("returns old config in same stack", async () => {
			const inst = new ConfiguratOR()
			const config = {
				alpha: "one",
				bravo: 2
			}
			expect(inst.get()).toEqual({})
			const promise = inst.set(config)
			expect(inst.get()).toEqual({})
			await promise
			expect(inst.get()).toEqual(config)
		})
	})

	describe("get()", () => {
		it("supports getting config by path", async () => {
			const inst = new ConfiguratOR({
				ignoreUnknownPlaceholders: true
			})
			const config = mockConfig() as any
			await inst.set(config)

			expect(inst.get("*")).toEqual(config)
			expect(inst.get("stringValue")).toBe(config.stringValue)
			expect(inst.get("numericValue")).toBe(config.numericValue)
			expect(inst.get("arrayValue[0]")).toBe(config.arrayValue[0])
			expect(inst.get("arrayValue[3].value")).toBe(config.arrayValue[3].value)
			expect(inst.get("parent.child.leaf.anotherValue")).toBe(config.parent.child.leaf.anotherValue)

			expect(inst.get("notSet")).toBe(undefined)
			expect(inst.get("notSet.subset.subset")).toBe(undefined)
			expect(inst.get("parent.child.leaf.secretValue")).toBe(undefined)
			expect(inst.get("arrayValue[999]")).toBe(undefined)
		})
		it("returns default value if path is undefined", async () => {
			const inst = new ConfiguratOR({
				ignoreUnknownPlaceholders: true
			})
			const config = mockConfig() as any
			await inst.set(config)
			expect(inst.get("boolFalse")).toBe(false)
			expect(inst.get("not.defined", {default: "value"})).toEqual({default: "value"})
			expect(inst.get("arrayValue[0]", {default: "value"})).toEqual("this")
			expect(inst.get("arrayValue[10]", {default: "value"})).toEqual({default: "value"})
		})
	})

	describe("has()", () => {
		it("returns true for defined values", async () => {
			const inst = new ConfiguratOR({
				ignoreUnknownPlaceholders: true
			})
			await inst.set(mockConfig())
			expect(inst.has("numericValue")).toBe(true)
			expect(inst.has("zero")).toBe(true)
			expect(inst.has("boolFalse")).toBe(true)
			expect(inst.has("arrayValue")).toBe(true)
			expect(inst.has("arrayValue[0]")).toBe(true)
			expect(inst.has("parent.child.leaf")).toBe(true)
		})
		it("returns false for undefined values", async () => {
			const inst = new ConfiguratOR({
				ignoreUnknownPlaceholders: true
			})
			await inst.set(mockConfig())
			expect(inst.has("numericValue2")).toBe(false)
			expect(inst.has("one")).toBe(false)
			expect(inst.has("boolTrueFalse")).toBe(false)
			expect(inst.has("not.defined.array")).toBe(false)
			expect(inst.has("not.defined.object")).toBe(false)
			expect(inst.has("parent.child.not")).toBe(false)
		})
	})

	describe("listeners", () => {
		let instance: ConfiguratOR
		beforeEach(() => {
			instance = new ConfiguratOR()
		})
		it("notifies global listeners on any change", async () => {
			const config = {
				alpha: "bravo",
				charlie: {
					delta: "echo"
				}
			}

			const listenerOne = jest.fn()
			const listenerTwo = jest.fn()
			instance.on(listenerOne)
			instance.on(listenerTwo)
			await instance.set(config)
			expect(listenerOne.mock.calls.length).toEqual(1)
			expect(listenerOne.mock.calls[0][0]).toMatchObject({
				path: "*",
				config,
				fullConfig: config,
				reader: instance
			})
			expect(listenerTwo.mock.calls.length).toEqual(1)
			expect(listenerTwo.mock.calls[0][0]).toMatchObject({
				path: "*",
				config,
				fullConfig: config,
				reader: instance
			})
		})
		it("does not notify global listeners once they are removed", async () => {
			const config = {
				alpha: "bravo",
				charlie: {
					delta: "echo"
				}
			}

			const listenerOne = jest.fn()
			const listenerTwo = jest.fn()
			instance.on(listenerOne)
			instance.on(listenerTwo)
			await instance.set(config)
			expect(listenerOne.mock.calls.length).toEqual(1)
			expect(listenerOne.mock.calls[0][0]).toMatchObject({
				path: "*",
				config,
				fullConfig: config,
				reader: instance
			})
			expect(listenerTwo.mock.calls.length).toEqual(1)
			expect(listenerTwo.mock.calls[0][0]).toMatchObject({
				path: "*",
				config,
				fullConfig: config,
				reader: instance
			})

			instance.off(listenerOne)
			await instance.set(config)
			expect(listenerOne.mock.calls.length).toEqual(1)
			expect(listenerTwo.mock.calls.length).toEqual(2)
			expect(listenerTwo.mock.calls[1][0]).toMatchObject({
				path: "*",
				config,
				fullConfig: config,
				reader: instance
			})
		})
		it("notifies correct local listeners", async () => {
			const globalListener = jest.fn()
			const localListener = jest.fn()
			const config = {
				local: "test",
				sub: {
					another: "value",
					object: {
						level: "test"
					}
				}
			}

			instance.on(globalListener)
			instance.on("sub.object", localListener)
			await instance.set(config)
			expect(instance.get()).toEqual(config)
			expect(globalListener.mock.calls.length).toBe(1)
			expect(localListener.mock.calls.length).toBe(1)

			await instance.set("local", "updatedValue")
			expect(instance.get().local).toEqual("updatedValue")
			expect(instance.get("local")).toEqual("updatedValue")
			expect(globalListener.mock.calls.length).toEqual(2)
			expect(localListener.mock.calls.length).toEqual(1)
		})
	})

	describe("placeholders", () => {
		it("if setting with undefined placeholders", async () => {
			const inst = new ConfiguratOR()
			const config = mockConfig()
			await inst.set(config).catch((err) => {
				expect(err).toBeDefined()
			})
		})
	})
})
