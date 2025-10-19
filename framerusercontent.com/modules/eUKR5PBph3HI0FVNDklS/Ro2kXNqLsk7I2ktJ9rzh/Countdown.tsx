import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { useState, useEffect } from "react"
import { EmptyState } from "https://framer.com/m/Shared-8iGD.js@9bbvaZD8RsNyj0rYVQ4z"

/**
 * @framerDisableUnlink
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */

const unitNames = ["years", "months", "days", "hours", "minutes", "seconds"]
const unitSizes = [365, 12, 30, 24, 60, 60]
const finishedIndex = 6

function getDateWithTime(date, hour, minute, second, ampm) {
    const newDate = new Date(date)
    newDate.setHours(hour + (ampm === "PM" && hour !== 12 ? 12 : 0))
    newDate.setMinutes(minute)
    newDate.setSeconds(second)
    return newDate
}

export default function Countdown(props) {
    const { time, labels, units } = props
    const targetDate = getDateWithTime(
        props.date,
        time.hour,
        time.minute,
        time.second,
        time.time
    )
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)
        return () => clearTimeout(timer)
    })

    if (isCanvas && !props.date) {
        return (
            <EmptyState
                title="Set a date value."
                subtitle="Use the properties panel to choose a target date."
                maxWidth={500}
            />
        )
    }

    function calculateTimeLeft() {
        const now = new Date()
        const difference = targetDate.getTime() - now.getTime()
        const timeLeftValue = Array(7).fill(null)

        if (difference > 0) {
            timeLeftValue[0] = Math.floor(
                difference / (1000 * 60 * 60 * 24 * 365)
            )
            timeLeftValue[1] = Math.floor(
                (difference / (1000 * 60 * 60 * 24 * 30)) % 12
            )
            timeLeftValue[2] = Math.floor(
                (difference / (1000 * 60 * 60 * 24)) % 30
            )
            timeLeftValue[3] = Math.floor((difference / (1000 * 60 * 60)) % 24)
            timeLeftValue[4] = Math.floor((difference / 1000 / 60) % 60)
            timeLeftValue[5] = Math.floor((difference / 1000) % 60)
            timeLeftValue[6] = true

            for (let i = 0; i < unitNames.length - 1; i++) {
                if (!units[unitNames[i]]) {
                    timeLeftValue[i + 1] += timeLeftValue[i] * unitSizes[i + 1]
                    timeLeftValue[i] = null
                }
            }

            if (!units.seconds) timeLeftValue[5] = null

            if (!units.zeroUnits) {
                for (let i = 0; i < unitNames.length; i++) {
                    if (timeLeftValue[i] <= 0) timeLeftValue[i] = null
                    else break
                }
            }
        } else {
            timeLeftValue[finishedIndex] = false
        }

        return timeLeftValue
    }

    const textStyle = {
        fontSize: props.font?.fontSize || 22,
        fontWeight: "600",
        color: props.fontColor || "#ffffff",
    }

    const labelStyle = {
        fontSize: labels?.font?.fontSize || 14,
        fontWeight: labels?.font?.fontWeight || "normal",
        lineHeight: labels?.font?.lineHeight || 1.2,
        color: labels?.fontColor || "#999999",
        textTransform: labels?.case || "capitalize",
        marginTop: 4,
    }

    const validUnits = unitNames
        .map((unit, index) => ({ unit, value: timeLeft[index] }))
        .filter((item) => item.value != null)

    const segments = []

    // Determine if orientation is vertical
    const isVertical = props.orientation === "vertical"

    validUnits.forEach((item, i) => {
        if (i > 0 && props.showLine && !props.boxStyle) {
            segments.push(
                <div
                    key={`line-${i}`}
                    style={{
                        width: isVertical
                            ? props.lineLength || 48
                            : props.lineThickness || 2,
                        height: isVertical
                            ? props.lineThickness || 2
                            : props.lineLength || 48,
                        backgroundColor: props.lineColor || "#ccc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: isVertical
                            ? `${props.gap / 2 || 8}px 0`
                            : `0 ${props.gap / 2 || 8}px`,
                    }}
                ></div>
            )
        }

        const paddedValue = String(item.value).padStart(2, "0")

        segments.push(
            <div
                key={item.unit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: props.boxStyle
                        ? props.boxColor
                        : "transparent",
                    borderRadius: props.boxStyle ? props.boxRadius : 0,
                    padding: `${props.boxPadding || 12}px`,
                    minWidth: 50,
                    margin: isVertical ? "4px 0" : "0 4px",
                }}
            >
                <span style={textStyle}>{paddedValue}</span>
                {props.showUnitLabels && (
                    <span style={labelStyle}>{labelText(item)}</span>
                )}
            </div>
        )
    })

    function labelText(item) {
        if (!props.showUnitLabels) return ""
        if (labels?.style === "short") return item.unit[0].toUpperCase()
        return item.unit
    }

    if (!timeLeft[finishedIndex]) {
        return props.finishedStyle === "text" ? (
            <p style={{ color: props.fontColor, ...props.font }}>
                {props.finishedText}
            </p>
        ) : (
            props.finished
        )
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: isVertical ? "column" : "row",
                justifyContent: "center",
                alignItems: "center",
                userSelect: props.textSelect ? "auto" : "none",
                lineHeight: 1.2,
            }}
        >
            {segments}
        </div>
    )
}

addPropertyControls(Countdown, {
    date: { type: ControlType.Date },
    time: {
        type: ControlType.Object,
        controls: {
            hour: {
                type: ControlType.Number,
                min: 1,
                max: 12,
                defaultValue: 12,
            },
            minute: {
                type: ControlType.Number,
                min: 0,
                max: 59,
                defaultValue: 0,
            },
            second: {
                type: ControlType.Number,
                min: 0,
                max: 59,
                defaultValue: 0,
            },
            time: {
                type: ControlType.Enum,
                options: ["AM", "PM"],
                defaultValue: "PM",
            },
        },
    },
    orientation: {
        type: ControlType.Enum,
        options: ["horizontal", "vertical"],
        defaultValue: "horizontal",
        title: "Orientation",
    },
    units: {
        type: ControlType.Object,
        controls: unitNames.reduce(
            (acc, unit) => {
                acc[unit] = { type: ControlType.Boolean, defaultValue: true }
                return acc
            },
            {
                zeroUnits: {
                    type: ControlType.Boolean,
                    defaultValue: false,
                    enabledTitle: "Show",
                    disabledTitle: "Hide",
                    description: "Hide zero-value units on the left.",
                },
            }
        ),
    },
    labels: {
        type: ControlType.Object,
        optional: true,
        controls: {
            location: {
                type: ControlType.Enum,
                options: ["inline", "above", "below"],
                defaultValue: "below",
            },
            style: {
                type: ControlType.Enum,
                options: ["full", "short"],
                defaultValue: "full",
            },
            case: {
                type: ControlType.Enum,
                options: ["capitalize", "uppercase", "lowercase"],
                defaultValue: "capitalize",
            },
            fontColor: { type: ControlType.Color, defaultValue: "#FFF" },
            font: { type: "font", controls: "extended" },
        },
    },
    fontColor: { type: ControlType.Color, defaultValue: "#ffffff" },
    font: { type: "font", controls: "extended" },
    textSelect: { type: ControlType.Boolean, defaultValue: false },
    gap: { type: ControlType.Number, defaultValue: 16 },
    showLine: {
        type: ControlType.Boolean,
        defaultValue: false,
        title: "Show Line Between",
    },
    lineColor: {
        type: ControlType.Color,
        defaultValue: "#ccc",
        title: "Line Color",
    },
    lineLength: {
        type: ControlType.Number,
        defaultValue: 48,
        min: 4,
        title: "Line Height",
    },
    finishedStyle: {
        type: ControlType.Enum,
        options: ["text", "layer"],
        defaultValue: "text",
        title: "Finished Display",
    },
    finishedText: {
        type: ControlType.String,
        defaultValue: "Countdown finished!",
        hidden: (props) => props.finishedStyle !== "text",
    },
    finished: {
        type: ControlType.ComponentInstance,
        hidden: (props) => props.finishedStyle !== "layer",
    },
    boxStyle: {
        type: ControlType.Boolean,
        defaultValue: false,
        title: "Box Around Units",
    },
    boxColor: {
        type: ControlType.Color,
        defaultValue: "#ffffff",
        hidden: (props) => !props.boxStyle,
    },
    boxPadding: {
        type: ControlType.Number,
        defaultValue: 8,
        hidden: (props) => !props.boxStyle,
        title: "Box Padding",
    },
    boxRadius: {
        type: ControlType.Number,
        defaultValue: 12,
        hidden: (props) => !props.boxStyle,
        title: "Box Radius",
    },
    showUnitLabels: {
        type: ControlType.Boolean,
        defaultValue: true,
        title: "Show Unit Labels",
    },
})
