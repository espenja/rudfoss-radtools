# React-YAFL

This folder contains Yet Another Form Library. This was built due to the extensive complications that arose from using `react-hook-form`. Allthough that library was easy to get started with it did fail in key areas once we started using it for more advanced scenarios. It was also cumbersome to use with ui libraries as it made many assumptions on the types of fields by looking at other stuff.

This library tries to keep to the simple principles of `react-hook-form` while avoiding some of the pitfalls it introduces.

## Usage

The library is based around React Context. Each field is specified by using a "useField" hook that attempts to resolve the context value. Thus it is not suited for forms that contain both the context and the fields within one control. This is intentional as it makes for cleaner components if you separate the top-form logic from the individual fields.
