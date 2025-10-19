import { addPropertyControls, ControlType } from "framer"
import { motion } from "framer-motion"

export const borderPropertyControl = (hidden = null) => ({
    type: ControlType.Object,
    optional: true,
    hidden,
    controls: {
        color: {
            type: ControlType.Color,
            defaultValue: "#222",
        },
        width: {
            type: ControlType.FusedNumber,
            defaultValue: 1,
            toggleKey: "widthIsMixed",
            toggleTitles: ["All", "Individual"],
            valueKeys: ["widthTop", "widthRight", "widthBottom", "widthLeft"],
            valueLabels: ["T", "R", "B", "L"],
            min: 0,
        },
        style: {
            type: ControlType.Enum,
            defaultValue: "solid",
            options: ["solid", "dashed", "dotted", "double"],
            optionTitles: ["Solid", "Dashed", "Dotted", "Double"],
        },
    },
})

export function Border({
    width,
    widthIsMixed,
    widthTop,
    widthRight,
    widthBottom,
    widthLeft,
    style,
    color,
    transition,
}) {
    return (
        <motion.div
            animate={{
                borderColor: color,
            }}
            style={{
                position: "absolute",
                inset: 0,
                borderWidth: widthIsMixed
                    ? `${widthTop}px ${widthRight}px ${widthBottom}px ${widthLeft}px`
                    : `${width}px`,
                borderStyle: style,
                borderRadius: "inherit",
                pointerEvents: "none",
            }}
            initial={false}
            transition={transition}
        />
    )
}

export function EmptyState({ title, subtitle, maxWidth = 0 }) {
    return (
        <div
            style={{
                display: "flex",
                width: "100%",
                height: "100%",
                placeContent: "center",
                placeItems: "center",
                flexDirection: "column",
                gap: 16,
                backgroundColor: "rgba(136, 85, 255, 0.1)",
                borderRadius: 6,
                border: "1px dashed rgb(136, 85, 255)",
                color: "rgb(136, 85, 255)",
                fontSize: 16,
                padding: 20,
                minHeight: 200,
                maxWidth: maxWidth || undefined,
            }}
        >
            <p
                style={{
                    margin: 0,
                    fontWeight: 600,
                    textAlign: "center",
                }}
            >
                {title}
            </p>
            <p
                style={{
                    margin: 0,
                    opacity: 0.7,
                    // maxWidth: 500,
                    lineHeight: 1.5,
                    textAlign: "center",
                }}
            >
                {subtitle}
            </p>
        </div>
    )
}

EmptyState.displayName = "Empty State"
