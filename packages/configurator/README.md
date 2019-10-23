# ConfiguratOR
A powerfull configuration manager that supports dynamic updates in a consistent and safe manner.

## Reading the configuration
The configuration object is stored internally in the `ConfiguratOR` class instance. It is not meant to be accessed directly. To read the current configuration use the `get` method on the class. Each `get` call will return a copy of the configuration object. This ensures that no piece of code accidentally changes the config state in an inconsistent manner.

## Change pipeline
Every configuration change including initial loading passes through the **config change pipeline**. The pipeline inspects the object, triggers placeholder handlers and notifies subscribers that the configuration has changed. The pipeline is heavily inspired by the **Flux** pattern for change updates.

Any `set` operation on the configuration manager can be thought of as dispatching an action to the underlying storage mechanism. Dispatching multiple such actions by calling `set` multiple times within the same stack instance will result in a single update to the configuration state. Any `get` calls on the configuration object will return old values until the thread is released. This ensures that no object will get an inconsistent configuration object or one containing placeholder values. This is also consistent with the **Flux** pattern in that changes are 

After every set operation is complete the resulting configuration object is parsed for placeholders that are in turn handed over to their respective handlers. If no handler is found for a placeholder an error is thrown, and the configuration object is not updated.

All setters return a promise for the final, set configuration. The promise resolves with the configuration after all queued set operations have been completed. If any placholder handler fails during setup the promise is rejected with that error. The error is also reported to the handler provided in the `onSetError` method.

## Placeholders
The primary purpose of placeholders is to augment the config object with data from the runtime environment or external sources. The configuration object may contain placeholder values that are resolved asynchronously at runtime once the configuration object has been partially constructed. Such values are called `placeholder values` and must be prefixed with a unique key that you can register a `placeholder handler` for. Once the configuration is parsed any found placeholders will invoke their respective handler before proceeding as part of the setter step. The handler must then return a new value for this specific property in the configuration object. Placeholders are processed every time the configuration object changes ensuring that the final config object is always free of placeholder values.

Placeholders are string values in the configuration object comprised of a `prefix`, `placeholder name` and zero or more segments.
- The prefix is a configurable substring that serves as an indicator that the value is a placeholder. The default prefix is `::`.
- The placeholder name is a generic string that indicates which `placeholder handler` should be triggered for this placeholder. If no handler is found for the defined name a `PlaceholderError` object will be thrown. The placeholder name may not contain spaces.
- The segments are a set of space separated strings. They are inteded as data to the placeholder handler and may be parsed however the handler wishes. To include spaces within a segment wrap the segment in single quotes `'`. Single quotes are NOT stripped from the segment value when passed to the handler.

The library comes with a pre-defined placeholder handler for looking up configuration values in environment variables. See documentation on the handler for more information. Below is an example of using this handler:

```typescript
import Configurator, { envPlaceholderHandler } from "@aio/configurator"
const config = new ConfiguratOR()
config.setPlaceholderHandler("env", envPlaceholderHandler)
config.set({
	"port": "::env APPSETTING_APP_PORT APP_PORT '1337'"
})

config.get().port // 1337 (if no env variables are present)
```

### Placeholder handler errors
If a placeholder handler throws an error the config object will NOT be updated, the error is wrapped in a `PlaceholderError` instance and passed to the error handler currently configured for the manager. If no error handler is defined the error is simply throw out of the configuration instance to the calling code and execution is halted.

## Change listeners
The configuration manager can be set up to notify you once changes occur to the configuration object or a subset of it. To set up such notifications use the `on` methods. Listeners can be registered with a case sensitive, `path` parameter indicating they should be called when a specific subtree changes as opposed to the entire config object.

```typescript
// Listen for changes to any part of the config object.
inst.on((opts) => {
	// Handle the change here
})
```

```typescript
// Listen for changes to the `server` subtree of the config object.
inst.on("server", (opts) => {
	// Handle the change here
})
```

If multiple listeners are registered for a specific path they will be called in the order they were registered. If multiple separate paths are affected by the change the order of execution between paths is not guaranteed. However they will all be called with an identitcal copy of the config object.

Listeners may be asynchronous if needed. However, the manager will not wait for 