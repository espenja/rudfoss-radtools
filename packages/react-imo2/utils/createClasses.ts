import { createUseStyles, DefaultTheme } from "react-jss"
import { Properties } from "csstype"

interface Styles {
	[key: string]: Properties | undefined
}
type ThemeStyles<Theme> = (theme: Theme) => Styles

/**
 * Creates scoped classes for a component with full type support.
 * @param styles
 */
export const createClasses = <Theme = DefaultTheme>(
	styles: Styles | ThemeStyles<Theme>
) => createUseStyles(styles as any)
