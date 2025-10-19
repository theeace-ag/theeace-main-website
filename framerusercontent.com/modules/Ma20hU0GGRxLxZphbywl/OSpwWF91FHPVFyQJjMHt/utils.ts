import * as React from "react"
import { useMemo, forwardRef } from "react"
import { PropertyControls, ControlType } from "framer"

/*
 ** ICON UTILS
 ** Pull as much re-usable logic into here as possible
 ** This will make it easier to replace in all icon components
 */

export const containerStyles: React.CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
}

export const defaultEvents: PropertyControls = {
    onClick: {
        type: ControlType.EventHandler,
    },
    onMouseDown: {
        type: ControlType.EventHandler,
    },
    onMouseUp: {
        type: ControlType.EventHandler,
    },
    onMouseEnter: {
        type: ControlType.EventHandler,
    },
    onMouseLeave: {
        type: ControlType.EventHandler,
    },
}

const findByArray = (arr: any[], search: string) =>
    arr.find((a) => a.toLowerCase().includes(search))

export function getIconSelection<T>(
    iconKeys,
    selectByList,
    iconSearch = "",
    iconSelection,
    lowercaseIconKeyPairs
): T {
    // gotta get the exact match first THEN find
    // have a set and try to access ?
    if (selectByList) return iconSelection
    if (iconSearch == null || iconSearch?.length === 0) return null

    const iconSearchTerm = iconSearch.toLowerCase().replace(/-|\s/g, "")

    // check for exact match, otherwise use .find
    const searchResult =
        lowercaseIconKeyPairs[iconSearchTerm] ??
        findByArray(iconKeys, iconSearchTerm)

    return searchResult
}

export function useIconSelection<T>(
    iconKeys,
    selectByList,
    iconSearch = "",
    iconSelection,
    lowercaseIconKeyPairs
): T {
    // Clean search term
    const iconSearchResult = useMemo(() => {
        if (iconSearch == null || iconSearch?.length === 0) return null
        const iconSearchTerm = iconSearch.toLowerCase().replace(/-|\s/g, "")

        // check for exact match, otherwise use .find
        const searchResult =
            lowercaseIconKeyPairs[iconSearchTerm] ??
            findByArray(iconKeys, iconSearchTerm)

        return searchResult
    }, [iconSelection, iconSearch])

    const name = selectByList ? iconSelection : iconSearchResult

    return name
}
