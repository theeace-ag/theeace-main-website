import {
    Children,
    useLayoutEffect,
    useEffect,
    useState,
    useRef,
    useMemo,
    createRef,
    useCallback,
    cloneElement,
    forwardRef,
} from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import {
    motion,
    animate,
    useMotionValue,
    useInView,
    useTransform,
    LayoutGroup,
    wrap,
    sync,
    mix,
} from "framer-motion"
import { resize } from "@motionone/dom"
import { usePageVisibility } from "./UsePageVisibility.tsx"

// Using opacity: 0.001 instead of 0 as an LCP hack. (opacity: 0.001 is still 0
// to a human eye but makes Google think the elements are visible)
const OPACITY_0 = 0.001

/**
 *
 * SLIDESHOW
 * V2 with Drag
 * By Benjamin and Matt
 *
 * @framerIntrinsicWidth 400
 * @framerIntrinsicHeight 200
 *
 * @framerDisableUnlink
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function Slideshow(props) {
    /**
     * Properties
     */
    const {
        slots,
        startFrom,
        direction,
        effectsOptions,
        autoPlayControl,
        dragControl,
        alignment,
        gap,
        padding,
        paddingPerSide,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        itemAmount,
        fadeOptions,
        intervalControl,
        transitionControl,
        arrowOptions,
        borderRadius,
        progressOptions,
        style,
    } = props

    const {
        effectsOpacity,
        effectsScale,
        effectsRotate,
        effectsPerspective,
        effectsHover,
    } = effectsOptions

    const { fadeContent, overflow, fadeWidth, fadeInset, fadeAlpha } =
        fadeOptions

    const {
        showMouseControls,
        arrowSize,
        arrowRadius,
        arrowFill,
        leftArrow,
        rightArrow,
        arrowShouldSpace = true,
        arrowShouldFadeIn = false,
        arrowPosition,
        arrowPadding,
        arrowGap,
        arrowPaddingTop,
        arrowPaddingRight,
        arrowPaddingBottom,
        arrowPaddingLeft,
    } = arrowOptions

    const {
        showProgressDots,
        dotSize,
        dotsInset,
        dotsRadius,
        dotsPadding,
        dotsGap,
        dotsFill,
        dotsBackground,
        dotsActiveOpacity,
        dotsOpacity,
        dotsBlur,
    } = progressOptions

    const paddingValue = paddingPerSide
        ? `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`
        : `${padding}px`

    /**
     * Checks
     */
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    // Remove empty slots (such as hidden layers)
    const filteredSlots = slots.filter(Boolean)
    const hasChildren = Children.count(filteredSlots) > 0
    const isHorizontal = direction === "left" || direction === "right"
    const isInverted = direction === "right" || direction === "bottom"

    /**
     * Empty state for Canvas
     */
    if (!hasChildren) {
        return (
            <section style={placeholderStyles}>
                <div style={emojiStyles}>⭐️</div>
                <p style={titleStyles}>Connect to Content</p>
                <p style={subtitleStyles}>
                    Add layers or components to make infinite auto-playing
                    slideshows.
                </p>
            </section>
        )
    }

    /**
     * Refs, State
     */
    const parentRef = useRef(null)
    const childrenRef = useMemo(() => {
        return filteredSlots.map((index) => createRef<HTMLElement>())
    }, [filteredSlots])

    const timeoutRef = useRef(undefined)

    const [size, setSize] = useState({
        parent: null,
        children: null,
        item: null,
        itemWidth: null,
        itemHeight: null,
        viewportLength: null,
    })

    /* For pausing on hover */
    const [isHovering, setIsHovering] = useState(false)
    const [shouldPlayOnHover, setShouldPlayOnHover] = useState(autoPlayControl)

    /* For cursor updates */
    const [isMouseDown, setIsMouseDown] = useState(false)

    /* Check if resizing */
    const [isResizing, setIsResizing] = useState(false)

    /**
     * Array for children
     */
    const dupedChildren = []
    let duplicateBy = 4

    if (isCanvas) {
        duplicateBy = 1
    }

    /**
     * Measure parent, child, items
     */
    const measure = useCallback(() => {
        if (hasChildren && parentRef.current) {
            const total = filteredSlots.length - 1
            const parentLength = isHorizontal
                ? parentRef.current.offsetWidth
                : parentRef.current.offsetHeight

            const start = childrenRef[0].current
                ? isHorizontal
                    ? childrenRef[0].current.offsetLeft
                    : childrenRef[0].current.offsetTop
                : 0

            const end = childrenRef[total].current
                ? isHorizontal
                    ? childrenRef[total].current.offsetLeft +
                      childrenRef[total].current.offsetWidth
                    : childrenRef[total].current.offsetTop +
                      childrenRef[total].current.offsetHeight
                : 0

            const childrenLength = end - start + gap
            const itemSize = childrenRef[0].current
                ? isHorizontal
                    ? childrenRef[0].current.offsetWidth
                    : childrenRef[0].current.offsetHeight
                : 0

            const itemWidth = childrenRef[0].current
                ? childrenRef[0].current.offsetWidth
                : 0

            const itemHeight = childrenRef[0].current
                ? childrenRef[0].current.offsetHeight
                : 0

            const viewportLength = isHorizontal
                ? Math.max(
                      document.documentElement.clientWidth || 0,
                      window.innerWidth || 0,
                      parentRef.current.offsetWidth
                  )
                : Math.max(
                      document.documentElement.clientHeight || 0,
                      window.innerHeight || 0,
                      parentRef.current.offsetHeight
                  )

            setSize({
                parent: parentLength,
                children: childrenLength,
                item: itemSize,
                itemWidth,
                itemHeight,
                viewportLength,
            })
        }
    }, [hasChildren])

    const scheduleMeasure = useCallback(() => {
        sync.read(measure)
    }, [measure])

    /**
     * Add refs to all children
     * Added itemAmount for resizing
     */
    useLayoutEffect(() => {
        if (hasChildren) scheduleMeasure()
    }, [hasChildren, itemAmount])

    /**
     * Track whether this is the initial resize event. By default this will fire on mount,
     * which we do in the useEffect. We should only fire it on subsequent resizes.
     */
    let initialResize = useRef(true)
    useEffect(() => {
        return resize(parentRef.current, ({ contentSize }) => {
            if (
                !initialResize.current &&
                (contentSize.width || contentSize.height)
            ) {
                scheduleMeasure()
                setIsResizing(true)
            }
            initialResize.current = false
        })
    }, [])

    useEffect(() => {
        if (isResizing) {
            const timer = setTimeout(() => setIsResizing(false), 500)
            return () => clearTimeout(timer)
        }
    }, [isResizing])

    /**
     * Animation, pagination
     */
    const totalItems = filteredSlots?.length
    const childrenSize = isCanvas ? 0 : size?.children
    const itemWithGap = size?.item + gap
    const itemOffset = startFrom * itemWithGap
    const [currentItem, setCurrentItem] = useState(startFrom + totalItems)
    const [isDragging, setIsDragging] = useState(false)

    /* Check for browser window visibility */
    /* Otherwise, it will re-play all the item increments */
    const visibilityRef = useRef(null)
    const isInView = useInView(visibilityRef)
    const isVisible = usePageVisibility() && isInView
    const factor = isInverted ? 1 : -1

    /* The x and y values to start from */
    const xOrY = useMotionValue(childrenSize)

    /* For canvas only. Using xOrY is slower upon page switching */
    const canvasPosition = isHorizontal
        ? -startFrom * (size?.itemWidth + gap)
        : -startFrom * (size?.itemHeight + gap)

    /* Calculate the new value to animate to */
    const newPosition = () => factor * currentItem * itemWithGap

    /* Wrapped values for infinite looping */
    /* Instead of 0 to a negative full duplicated row, we start with an offset */
    const wrappedValue = !isCanvas
        ? useTransform(xOrY, (value) => {
              const wrapped = wrap(-childrenSize, -childrenSize * 2, value)
              return isNaN(wrapped) ? 0 : wrapped
          })
        : 0
    /* Convert the current item to a wrapping index for dots */
    const wrappedIndex = wrap(0, totalItems, currentItem)
    const wrappedIndexInverted = wrap(0, -totalItems, currentItem)

    /* Update x or y with the provided starting point */
    /* The subtraction of a full row of children is for overflow */
    useLayoutEffect(() => {
        if (size?.children === null) return

        /* Initial measure */
        // if (initialResize.current) {
        //     xOrY.set((childrenSize + itemOffset) * factor)
        // }

        /* Subsequent resizes */
        if (!initialResize.current && isResizing) {
            xOrY.set(newPosition())
        }
    }, [
        size,
        childrenSize,
        factor,
        itemOffset,
        currentItem,
        itemWithGap,
        isResizing,
    ])

    /**
     * Page item methods
     * Switching, deltas, autoplaying
     */

    /* Next and previous function, animates the X */
    const switchPages = () => {
        if (isCanvas || !hasChildren || !size.parent || isDragging) return

        if (xOrY.get() !== newPosition()) {
            animate(xOrY, newPosition(), transitionControl)
        }

        if (autoPlayControl && shouldPlayOnHover) {
            timeoutRef.current = setTimeout(() => {
                setCurrentItem(currentItem + 1)
                switchPages()
            }, intervalControl * 1000)
        }
    }

    /* Page navigation functions */
    const setDelta = (delta) => {
        if (!isInverted) {
            setCurrentItem(currentItem + delta)
        } else {
            setCurrentItem(currentItem - delta)
        }
    }

    const setPage = (index) => {
        const currentItemWrapped = wrap(0, totalItems, currentItem)
        const currentItemWrappedInvert = wrap(0, -totalItems, currentItem)

        const goto = index - currentItemWrapped
        const gotoInverted = index - Math.abs(currentItemWrappedInvert)

        if (!isInverted) {
            setCurrentItem(currentItem + goto)
        } else {
            setCurrentItem(currentItem - gotoInverted)
        }
    }

    /**
     * Drag
     */
    const handleDragStart = () => {
        setIsDragging(true)
    }
    const handleDragEnd = (event, { offset, velocity }) => {
        setIsDragging(false)

        const offsetXorY = isHorizontal ? offset.x : offset.y
        const velocityThreshold = 200 // Based on testing, can be tweaked or could be 0
        const velocityXorY = isHorizontal ? velocity.x : velocity.y

        const isHalfOfNext = offsetXorY < -size.item / 2
        const isHalfOfPrev = offsetXorY > size.item / 2

        /* In case you drag more than 1 item left or right */
        const normalizedOffset = Math.abs(offsetXorY)
        const itemDelta = Math.round(normalizedOffset / size.item)

        /* Minimum delta is 1 to initiate a page switch */
        /* For velocity use only */
        const itemDeltaFromOne = itemDelta === 0 ? 1 : itemDelta

        /* For quick flicks, even with low offsets */
        if (velocityXorY > velocityThreshold) {
            setDelta(-itemDeltaFromOne)
        } else if (velocityXorY < -velocityThreshold) {
            setDelta(itemDeltaFromOne)
        } else {
            /* For dragging over half of the current item with 0 velocity */
            if (isHalfOfNext) {
                setDelta(itemDelta)
            }
            if (isHalfOfPrev) {
                setDelta(-itemDelta)
            }
        }
    }

    /* Kickstart the auto-playing once we have all the children */
    useEffect(() => {
        if (!isVisible || isResizing) return
        switchPages()

        return () => timeoutRef.current && clearTimeout(timeoutRef.current)
    }, [dupedChildren, isVisible, isResizing])

    /* Create copies of our children to create a perfect loop */
    let childCounter = 0

    /**
     * Sizing
     * */
    let columnOrRowValue = `calc(${100 / itemAmount}% - ${gap}px + ${
        gap / itemAmount
    }px)`

    /**
     * Nested array to create duplicates of the children for infinite looping
     * These are wrapped around, and start at a full "page" worth of offset
     * as defined above.
     */
    for (let index = 0; index < duplicateBy; index++) {
        dupedChildren.push(
            ...Children.map(filteredSlots, (child, childIndex) => {
                let ref
                if (childIndex === 0) {
                    ref = childrenRef[0]
                }
                if (childIndex === filteredSlots.length - 1) {
                    ref = childrenRef[1]
                }

                return (
                    <Slide
                        ref={childrenRef[childIndex]}
                        key={index + childIndex + "lg"}
                        slideKey={index + childIndex + "lg"}
                        index={index}
                        width={
                            isHorizontal
                                ? itemAmount > 1
                                    ? columnOrRowValue
                                    : "100%"
                                : "100%"
                        }
                        height={
                            !isHorizontal
                                ? itemAmount > 1
                                    ? columnOrRowValue
                                    : "100%"
                                : "100%"
                        }
                        size={size}
                        child={child}
                        numChildren={filteredSlots?.length}
                        wrappedValue={wrappedValue}
                        childCounter={childCounter++}
                        gap={gap}
                        isCanvas={isCanvas}
                        isHorizontal={isHorizontal}
                        effectsOpacity={effectsOpacity}
                        effectsScale={effectsScale}
                        effectsRotate={effectsRotate}
                    >
                        {index + childIndex}
                    </Slide>
                )
            })
        )
    }

    /**
     * Fades with masks
     */
    const fadeDirection = isHorizontal ? "to right" : "to bottom"
    const fadeWidthStart = fadeWidth / 2
    const fadeWidthEnd = 100 - fadeWidth / 2
    const fadeInsetStart = clamp(fadeInset, 0, fadeWidthStart)
    const fadeInsetEnd = 100 - fadeInset

    const fadeMask = `linear-gradient(${fadeDirection}, rgba(0, 0, 0, ${fadeAlpha}) ${fadeInsetStart}%, rgba(0, 0, 0, 1) ${fadeWidthStart}%, rgba(0, 0, 0, 1) ${fadeWidthEnd}%, rgba(0, 0, 0, ${fadeAlpha}) ${fadeInsetEnd}%)`

    /**
     * Dots
     */
    const dots = []
    const dotsBlurStyle: React.CSSProperties = {}

    if (showProgressDots) {
        for (let i = 0; i < filteredSlots?.length; i++) {
            dots.push(
                <Dot
                    key={i}
                    dotStyle={{
                        ...dotStyle,
                        width: dotSize,
                        height: dotSize,
                        backgroundColor: dotsFill,
                    }}
                    buttonStyle={baseButtonStyles}
                    selectedOpacity={dotsActiveOpacity}
                    opacity={dotsOpacity}
                    onClick={() => setPage(i)}
                    wrappedIndex={wrappedIndex}
                    wrappedIndexInverted={wrappedIndexInverted}
                    total={totalItems}
                    index={i}
                    gap={dotsGap}
                    padding={dotsPadding}
                    isHorizontal={isHorizontal}
                    isInverted={isInverted}
                />
            )
        }

        if (dotsBlur > 0) {
            dotsBlurStyle.backdropFilter =
                dotsBlurStyle.WebkitBackdropFilter =
                dotsBlurStyle.MozBackdropFilter =
                    `blur(${dotsBlur}px)`
        }
    }

    const dragProps = dragControl
        ? {
              drag: isHorizontal ? "x" : "y",
              onDragStart: handleDragStart,
              onDragEnd: handleDragEnd,
              dragDirectionLock: true,
              values: { x: xOrY, y: xOrY },
              dragMomentum: false,
          }
        : {}

    const arrowHasTop =
        arrowPosition === "top-left" ||
        arrowPosition === "top-mid" ||
        arrowPosition === "top-right"

    const arrowHasBottom =
        arrowPosition === "bottom-left" ||
        arrowPosition === "bottom-mid" ||
        arrowPosition === "bottom-right"

    const arrowHasLeft =
        arrowPosition === "top-left" || arrowPosition === "bottom-left"

    const arrowHasRight =
        arrowPosition === "top-right" || arrowPosition === "bottom-right"

    const arrowHasMid =
        arrowPosition === "top-mid" ||
        arrowPosition === "bottom-mid" ||
        arrowPosition === "auto"

    return (
        <section
            style={{
                ...containerStyle,
                padding: paddingValue,
                WebkitMaskImage: fadeContent ? fadeMask : undefined,
                MozMaskImage: fadeContent ? fadeMask : undefined,
                maskImage: fadeContent ? fadeMask : undefined,
                opacity: size?.item !== null ? 1 : OPACITY_0,
                userSelect: "none",
            }}
            onMouseEnter={() => {
                setIsHovering(true)
                if (!effectsHover) setShouldPlayOnHover(false)
            }}
            onMouseLeave={() => {
                setIsHovering(false)
                if (!effectsHover) setShouldPlayOnHover(true)
            }}
            onMouseDown={(event) => {
                // Preventdefault fixes the cursor switching to text on drag on safari
                event.preventDefault()
                setIsMouseDown(true)
            }}
            onMouseUp={() => setIsMouseDown(false)}
            ref={visibilityRef}
        >
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    margin: 0,
                    padding: "inherit",
                    position: "absolute",
                    inset: 0,
                    overflow: overflow ? "visible" : "hidden",
                    borderRadius: borderRadius,
                    userSelect: "none",
                    perspective: isCanvas ? "none" : effectsPerspective, // Adding the perspective onto the motion.ul directly causes issues on Safari where you can see the layers clip.
                }}
            >
                <motion.ul
                    ref={parentRef}
                    {...dragProps}
                    style={{
                        ...containerStyle,
                        gap: gap,
                        placeItems: alignment,
                        x: isHorizontal
                            ? isCanvas
                                ? canvasPosition
                                : wrappedValue
                            : 0,
                        y: !isHorizontal
                            ? isCanvas
                                ? canvasPosition
                                : wrappedValue
                            : 0,
                        flexDirection: isHorizontal ? "row" : "column",
                        transformStyle:
                            effectsRotate !== 0 && !isCanvas
                                ? "preserve-3d"
                                : undefined,
                        cursor: dragControl
                            ? isMouseDown
                                ? "grabbing"
                                : "grab"
                            : "auto",
                        userSelect: "none",
                        ...style,
                    }}
                >
                    {dupedChildren}
                </motion.ul>
            </div>

            <fieldset
                style={{
                    ...controlsStyles,
                }}
                aria-label="Slideshow pagination controls"
                className="framer--slideshow-controls"
            >
                <motion.div
                    style={{
                        position: "absolute",
                        display: "flex",
                        flexDirection: isHorizontal ? "row" : "column",
                        justifyContent: arrowShouldSpace
                            ? "space-between"
                            : "center",
                        gap: arrowShouldSpace ? "unset" : arrowGap,
                        opacity: arrowShouldFadeIn ? OPACITY_0 : 1,
                        alignItems: "center",
                        inset: arrowPadding,
                        top: arrowShouldSpace
                            ? arrowPadding
                            : arrowHasTop
                              ? arrowPaddingTop
                              : "unset",
                        left: arrowShouldSpace
                            ? arrowPadding
                            : arrowHasLeft
                              ? arrowPaddingLeft
                              : arrowHasMid
                                ? 0
                                : "unset",
                        right: arrowShouldSpace
                            ? arrowPadding
                            : arrowHasRight
                              ? arrowPaddingRight
                              : arrowHasMid
                                ? 0
                                : "unset",
                        bottom: arrowShouldSpace
                            ? arrowPadding
                            : arrowHasBottom
                              ? arrowPaddingBottom
                              : "unset",
                    }}
                    animate={
                        arrowShouldFadeIn && {
                            opacity: isHovering ? 1 : OPACITY_0,
                        }
                    }
                    transition={transitionControl}
                >
                    <motion.button
                        type="button"
                        style={{
                            ...baseButtonStyles,
                            backgroundColor: arrowFill,
                            width: arrowSize,
                            height: arrowSize,
                            borderRadius: arrowRadius,
                            rotate: !isHorizontal ? 90 : 0,
                            display: showMouseControls ? "block" : "none",
                            pointerEvents: "auto",
                        }}
                        onClick={() => setDelta(-1)}
                        aria-label="Previous"
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                    >
                        <img
                            decoding="async"
                            width={arrowSize}
                            height={arrowSize}
                            src={
                                leftArrow ||
                                "https://framerusercontent.com/images/6tTbkXggWgQCAJ4DO2QEdXXmgM.svg"
                            }
                            alt={"Back Arrow"}
                        />
                    </motion.button>
                    <motion.button
                        type="button"
                        style={{
                            ...baseButtonStyles,

                            backgroundColor: arrowFill,
                            width: arrowSize,
                            height: arrowSize,
                            borderRadius: arrowRadius,
                            rotate: !isHorizontal ? 90 : 0,
                            display: showMouseControls ? "block" : "none",
                            pointerEvents: "auto",
                        }}
                        onClick={() => setDelta(1)}
                        aria-label="Next"
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                    >
                        <img
                            decoding="async"
                            width={arrowSize}
                            height={arrowSize}
                            src={
                                rightArrow ||
                                "https://framerusercontent.com/images/11KSGbIZoRSg4pjdnUoif6MKHI.svg"
                            }
                            alt={"Next Arrow"}
                        />
                    </motion.button>
                </motion.div>
                {dots.length > 1 ? (
                    <div
                        style={{
                            ...dotsContainerStyle,
                            left: isHorizontal ? "50%" : dotsInset,
                            top: !isHorizontal ? "50%" : "unset",
                            transform: isHorizontal
                                ? "translateX(-50%)"
                                : "translateY(-50%)",
                            flexDirection: isHorizontal ? "row" : "column",
                            bottom: isHorizontal ? dotsInset : "unset",
                            borderRadius: dotsRadius,
                            backgroundColor: dotsBackground,
                            userSelect: "none",
                            ...dotsBlurStyle,
                        }}
                    >
                        {dots}
                    </div>
                ) : null}
            </fieldset>
        </section>
    )
}

/* Default Properties */
Slideshow.defaultProps = {
    direction: "left",
    dragControl: false,
    startFrom: 0,
    itemAmount: 1,
    infinity: true,
    gap: 10,
    padding: 10,
    autoPlayControl: true,
    effectsOptions: {
        effectsOpacity: 1,
        effectsScale: 1,
        effectsRotate: 0,
        effectsPerspective: 1200,
        effectsHover: true,
    },
    transitionControl: {
        type: "spring",
        stiffness: 200,
        damping: 40,
    },

    fadeOptions: {
        fadeContent: false,
        overflow: false,
        fadeWidth: 25,
        fadeAlpha: 0,
        fadeInset: 0,
    },
    arrowOptions: {
        showMouseControls: true,
        arrowShouldFadeIn: false,
        arrowShouldSpace: true,
        arrowFill: "rgba(0,0,0,0.2)",
        arrowSize: 40,
    },
    progressOptions: {
        showProgressDots: true,
    },
}

/* Property Controls */
addPropertyControls(Slideshow, {
    slots: {
        type: ControlType.Array,
        title: "Content",
        control: { type: ControlType.ComponentInstance },
    },
    direction: {
        type: ControlType.Enum,
        title: "Direction",
        options: ["left", "right", "top", "bottom"],
        optionIcons: [
            "direction-left",
            "direction-right",
            "direction-up",
            "direction-down",
        ],
        optionTitles: ["Left", "Right", "Top", "Bottom"],
        displaySegmentedControl: true,
        defaultValue: Slideshow.defaultProps.direction,
    },
    autoPlayControl: {
        type: ControlType.Boolean,
        title: "Auto Play",
        defaultValue: true,
    },
    intervalControl: {
        type: ControlType.Number,
        title: "Interval",
        defaultValue: 1.5,
        min: 0.5,
        max: 10,
        step: 0.1,
        displayStepper: true,
        unit: "s",
        hidden: (props) => !props.autoPlayControl,
    },
    dragControl: {
        type: ControlType.Boolean,
        title: "Draggable",
        defaultValue: false,
    },
    startFrom: {
        type: ControlType.Number,
        title: "Current",
        min: 0,
        max: 10,
        displayStepper: true,
        defaultValue: Slideshow.defaultProps.startFrom,
    },
    effectsOptions: {
        type: ControlType.Object,
        title: "Effects",
        controls: {
            effectsOpacity: {
                type: ControlType.Number,
                title: "Opacity",
                defaultValue:
                    Slideshow.defaultProps.effectsOptions.effectsOpacity,
                min: 0,
                max: 1,
                step: 0.01,
                displayStepper: true,
            },
            effectsScale: {
                type: ControlType.Number,
                title: "Scale",
                defaultValue:
                    Slideshow.defaultProps.effectsOptions.effectsScale,
                min: 0,
                max: 1,
                step: 0.01,
                displayStepper: true,
            },
            effectsPerspective: {
                type: ControlType.Number,
                title: "Perspective",
                defaultValue:
                    Slideshow.defaultProps.effectsOptions.effectsPerspective,
                min: 200,
                max: 2000,
                step: 1,
            },
            effectsRotate: {
                type: ControlType.Number,
                title: "Rotate",
                defaultValue:
                    Slideshow.defaultProps.effectsOptions.effectsRotate,
                min: -180,
                max: 180,
                step: 1,
            },
            effectsHover: {
                type: ControlType.Boolean,
                title: "On Hover",
                enabledTitle: "Play",
                disabledTitle: "Pause",
                defaultValue:
                    Slideshow.defaultProps.effectsOptions.effectsHover,
            },
        },
    },
    alignment: {
        type: ControlType.Enum,
        title: "Align",
        options: ["flex-start", "center", "flex-end"],
        optionIcons: {
            direction: {
                right: ["align-top", "align-middle", "align-bottom"],
                left: ["align-top", "align-middle", "align-bottom"],
                top: ["align-left", "align-center", "align-right"],
                bottom: ["align-left", "align-center", "align-right"],
            },
        },
        defaultValue: "center",
        displaySegmentedControl: true,
    },
    itemAmount: {
        type: ControlType.Number,
        title: "Items",
        min: 1,
        max: 10,
        displayStepper: true,
        defaultValue: Slideshow.defaultProps.itemAmount,
    },
    gap: {
        type: ControlType.Number,
        title: "Gap",
        min: 0,
    },
    padding: {
        title: "Padding",
        type: ControlType.FusedNumber,
        toggleKey: "paddingPerSide",
        toggleTitles: ["Padding", "Padding per side"],
        defaultValue: 0,
        valueKeys: [
            "paddingTop",
            "paddingRight",
            "paddingBottom",
            "paddingLeft",
        ],
        valueLabels: ["T", "R", "B", "L"],
        min: 0,
    },
    borderRadius: {
        type: ControlType.Number,
        title: "Radius",
        min: 0,
        max: 500,
        displayStepper: true,
        defaultValue: 0,
    },
    transitionControl: {
        type: ControlType.Transition,
        defaultValue: Slideshow.defaultProps.transitionControl,
        title: "Transition",
    },

    fadeOptions: {
        type: ControlType.Object,
        title: "Clipping",
        controls: {
            fadeContent: {
                type: ControlType.Boolean,
                title: "Fade",
                defaultValue: false,
            },
            overflow: {
                type: ControlType.Boolean,
                title: "Overflow",
                enabledTitle: "Show",
                disabledTitle: "Hide",
                defaultValue: false,
                hidden(props) {
                    return props.fadeContent === true
                },
            },
            fadeWidth: {
                type: ControlType.Number,
                title: "Width",
                defaultValue: 25,
                min: 0,
                max: 100,
                unit: "%",
                hidden(props) {
                    return props.fadeContent === false
                },
            },
            fadeInset: {
                type: ControlType.Number,
                title: "Inset",
                defaultValue: 0,
                min: 0,
                max: 100,
                unit: "%",
                hidden(props) {
                    return props.fadeContent === false
                },
            },
            fadeAlpha: {
                type: ControlType.Number,
                title: "Opacity",
                defaultValue: 0,
                min: 0,
                max: 1,
                step: 0.05,
                hidden(props) {
                    return props.fadeContent === false
                },
            },
        },
    },
    arrowOptions: {
        type: ControlType.Object,
        title: "Arrows",
        controls: {
            showMouseControls: {
                type: ControlType.Boolean,
                title: "Show",
                defaultValue:
                    Slideshow.defaultProps.arrowOptions.showMouseControls,
            },
            arrowFill: {
                type: ControlType.Color,
                title: "Fill",
                hidden: (props) => !props.showMouseControls,
                defaultValue: Slideshow.defaultProps.arrowOptions.arrowFill,
            },
            leftArrow: {
                type: ControlType.Image,
                title: "Previous",
                hidden: (props) => !props.showMouseControls,
            },
            rightArrow: {
                type: ControlType.Image,
                title: "Next",
                hidden: (props) => !props.showMouseControls,
            },
            arrowSize: {
                type: ControlType.Number,
                title: "Size",
                min: 0,
                max: 200,
                displayStepper: true,
                defaultValue: Slideshow.defaultProps.arrowOptions.arrowSize,
                hidden: (props) => !props.showMouseControls,
            },
            arrowRadius: {
                type: ControlType.Number,
                title: "Radius",
                min: 0,
                max: 500,
                defaultValue: 40,
                hidden: (props) => !props.showMouseControls,
            },
            arrowShouldFadeIn: {
                type: ControlType.Boolean,
                title: "Fade In",
                defaultValue: false,
                hidden: (props) => !props.showMouseControls,
            },
            arrowShouldSpace: {
                type: ControlType.Boolean,
                title: "Distance",
                enabledTitle: "Space",
                disabledTitle: "Group",
                defaultValue:
                    Slideshow.defaultProps.arrowOptions.arrowShouldSpace,
                hidden: (props) => !props.showMouseControls,
            },
            arrowPosition: {
                type: ControlType.Enum,
                title: "Position",
                options: [
                    "auto",
                    "top-left",
                    "top-mid",
                    "top-right",
                    "bottom-left",
                    "bottom-mid",
                    "bottom-right",
                ],
                optionTitles: [
                    "Center",
                    "Top Left",
                    "Top Middle",
                    "Top Right",
                    "Bottom Left",
                    "Bottom Middle",
                    "Bottom Right",
                ],
                hidden: (props) =>
                    !props.showMouseControls || props.arrowShouldSpace,
            },
            arrowPadding: {
                type: ControlType.Number,
                title: "Inset",
                min: -100,
                max: 100,
                defaultValue: 20,
                displayStepper: true,
                hidden: (props) =>
                    !props.showMouseControls || !props.arrowShouldSpace,
            },

            arrowPaddingTop: {
                type: ControlType.Number,
                title: "Top",
                min: -500,
                max: 500,
                defaultValue: 0,
                displayStepper: true,
                hidden: (props) =>
                    !props.showMouseControls ||
                    props.arrowShouldSpace ||
                    props.arrowPosition === "auto" ||
                    props.arrowPosition === "bottom-mid" ||
                    props.arrowPosition === "bottom-left" ||
                    props.arrowPosition === "bottom-right",
            },
            arrowPaddingBottom: {
                type: ControlType.Number,
                title: "Bottom",
                min: -500,
                max: 500,
                defaultValue: 0,
                displayStepper: true,
                hidden: (props) =>
                    !props.showMouseControls ||
                    props.arrowShouldSpace ||
                    props.arrowPosition === "auto" ||
                    props.arrowPosition === "top-mid" ||
                    props.arrowPosition === "top-left" ||
                    props.arrowPosition === "top-right",
            },
            arrowPaddingRight: {
                type: ControlType.Number,
                title: "Right",
                min: -500,
                max: 500,
                defaultValue: 0,
                displayStepper: true,
                hidden: (props) =>
                    !props.showMouseControls ||
                    props.arrowShouldSpace ||
                    props.arrowPosition === "auto" ||
                    props.arrowPosition === "top-left" ||
                    props.arrowPosition === "top-mid" ||
                    props.arrowPosition === "bottom-left" ||
                    props.arrowPosition === "bottom-mid",
            },
            arrowPaddingLeft: {
                type: ControlType.Number,
                title: "Left",
                min: -500,
                max: 500,
                defaultValue: 0,
                displayStepper: true,
                hidden: (props) =>
                    !props.showMouseControls ||
                    props.arrowShouldSpace ||
                    props.arrowPosition === "auto" ||
                    props.arrowPosition === "top-right" ||
                    props.arrowPosition === "top-mid" ||
                    props.arrowPosition === "bottom-right" ||
                    props.arrowPosition === "bottom-mid",
            },
            arrowGap: {
                type: ControlType.Number,
                title: "Gap",
                min: 0,
                max: 100,
                defaultValue: 10,
                displayStepper: true,
                hidden: (props) =>
                    !props.showMouseControls || props.arrowShouldSpace,
            },
        },
    },
    progressOptions: {
        type: ControlType.Object,
        title: "Dots",
        controls: {
            showProgressDots: {
                type: ControlType.Boolean,
                title: "Show",
                defaultValue: false,
            },
            dotSize: {
                type: ControlType.Number,
                title: "Size",
                min: 1,
                max: 100,
                defaultValue: 10,
                displayStepper: true,
                hidden: (props) =>
                    !props.showProgressDots || props.showScrollbar,
            },
            dotsInset: {
                type: ControlType.Number,
                title: "Inset",
                min: -100,
                max: 100,
                defaultValue: 10,
                displayStepper: true,
                hidden: (props) =>
                    !props.showProgressDots || props.showScrollbar,
            },
            dotsGap: {
                type: ControlType.Number,
                title: "Gap",
                min: 0,
                max: 100,
                defaultValue: 10,
                displayStepper: true,
                hidden: (props) =>
                    !props.showProgressDots || props.showScrollbar,
            },
            dotsPadding: {
                type: ControlType.Number,
                title: "Padding",
                min: 0,
                max: 100,
                defaultValue: 10,
                displayStepper: true,
                hidden: (props) =>
                    !props.showProgressDots || props.showScrollbar,
            },
            dotsFill: {
                type: ControlType.Color,
                title: "Fill",
                defaultValue: "#fff",
                hidden: (props) =>
                    !props.showProgressDots || props.showScrollbar,
            },
            dotsBackground: {
                type: ControlType.Color,
                title: "Backdrop",
                defaultValue: "rgba(0,0,0,0.2)",
                hidden: (props) =>
                    !props.showProgressDots || props.showScrollbar,
            },
            dotsRadius: {
                type: ControlType.Number,
                title: "Radius",
                min: 0,
                max: 200,
                defaultValue: 50,
                hidden: (props) =>
                    !props.showProgressDots || props.showScrollbar,
            },
            dotsOpacity: {
                type: ControlType.Number,
                title: "Opacity",
                min: 0,
                max: 1,
                defaultValue: 0.5,
                step: 0.1,
                displayStepper: true,
                hidden: (props) =>
                    !props.showProgressDots || props.showScrollbar,
            },
            dotsActiveOpacity: {
                type: ControlType.Number,
                title: "Current",
                min: 0,
                max: 1,
                defaultValue: 1,
                step: 0.1,
                displayStepper: true,
                hidden: (props) =>
                    !props.showProgressDots || props.showScrollbar,
            },
            dotsBlur: {
                type: ControlType.Number,
                title: "Blur",
                min: 0,
                max: 50,
                defaultValue: 0,
                step: 1,
                hidden: (props) =>
                    !props.showProgressDots || props.showScrollbar,
            },
        },
    },
})

/* Placeholder Styles */
const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "100%",
    maxWidth: "100%",
    maxHeight: "100%",
    placeItems: "center",
    margin: 0,
    padding: 0,
    listStyleType: "none",
    textIndent: "none",
}

/* Component Styles */
const placeholderStyles: React.CSSProperties = {
    display: "flex",
    width: "100%",
    height: "100%",
    placeContent: "center",
    placeItems: "center",
    flexDirection: "column",
    color: "#96F",
    background: "rgba(136, 85, 255, 0.1)",
    fontSize: 11,
    overflow: "hidden",
    padding: "20px 20px 30px 20px",
}

const emojiStyles: React.CSSProperties = {
    fontSize: 32,
    marginBottom: 10,
}

const titleStyles: React.CSSProperties = {
    margin: 0,
    marginBottom: 10,
    fontWeight: 600,
    textAlign: "center",
}

const subtitleStyles: React.CSSProperties = {
    margin: 0,
    opacity: 0.7,
    maxWidth: 180,
    lineHeight: 1.5,
    textAlign: "center",
}

/* Control Styles */
const baseButtonStyles: React.CSSProperties = {
    border: "none",
    display: "flex",
    placeContent: "center",
    placeItems: "center",
    overflow: "hidden",
    background: "transparent",
    cursor: "pointer",
    margin: 0,
    padding: 0,
}

const controlsStyles: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    pointerEvents: "none",
    userSelect: "none",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    border: 0,
    padding: 0,
    margin: 0,
}

/* Clamp function, used for fadeInset */
const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

/* Slide Component */
const Slide = forwardRef(function Component(props, ref) {
    const {
        slideKey,
        width,
        height,
        child,
        size,
        gap,
        wrappedValue,
        numChildren,
        childCounter,
        isCanvas,
        effects,
        effectsOpacity,
        effectsScale,
        effectsRotate,
        isHorizontal,
        isLast,
        index,
    } = props

    /**
     * Unique offsets + scroll range [0, 1, 1, 0]
     */
    const childOffset = (size?.item + gap) * childCounter
    const scrollRange = [
        -size?.item,
        0,
        size?.parent - size?.item + gap,
        size?.parent,
    ].map((val) => val - childOffset)

    /**
     * Effects
     */
    const rotateY =
        !isCanvas &&
        useTransform(wrappedValue, scrollRange, [
            -effectsRotate,
            0,
            0,
            effectsRotate,
        ])
    const rotateX =
        !isCanvas &&
        useTransform(wrappedValue, scrollRange, [
            effectsRotate,
            0,
            0,
            -effectsRotate,
        ])
    const opacity =
        !isCanvas &&
        useTransform(wrappedValue, scrollRange, [
            effectsOpacity,
            1,
            1,
            effectsOpacity,
        ])
    const scale =
        !isCanvas &&
        useTransform(wrappedValue, scrollRange, [
            effectsScale,
            1,
            1,
            effectsScale,
        ])
    const originXorY =
        !isCanvas && useTransform(wrappedValue, scrollRange, [1, 1, 0, 0])

    const isVisible =
        !isCanvas &&
        useTransform(
            wrappedValue,
            (latest) => latest >= scrollRange[1] && latest <= scrollRange[2]
        )

    useEffect(() => {
        if (!isVisible) return
        return isVisible.onChange((newValue) => {
            ref.current?.setAttribute("aria-hidden", !newValue)
        })
    }, [])

    const visibility = isCanvas
        ? "visible"
        : useTransform(
              wrappedValue,
              [
                  scrollRange[0] - size.viewportLength,
                  mix(scrollRange[1], scrollRange[2], 0.5), // Mid-point between its effectless scroll offsets
                  scrollRange[3] + size.viewportLength,
              ],
              ["hidden", "visible", "hidden"]
          )

    return (
        <LayoutGroup inherit="id">
            <li
                style={{ display: "contents" }}
                aria-hidden={index === 0 ? false : true}
            >
                {cloneElement(
                    child,
                    {
                        ref: ref,
                        key: slideKey + "child",
                        style: {
                            ...child.props?.style,
                            flexShrink: 0,
                            userSelect: "none",
                            width,
                            height,
                            opacity: opacity,
                            scale: scale,
                            originX: isHorizontal ? originXorY : 0.5,
                            originY: !isHorizontal ? originXorY : 0.5,
                            rotateY: isHorizontal ? rotateY : 0,
                            rotateX: !isHorizontal ? rotateX : 0,
                            visibility,
                        },
                        layoutId: child.props.layoutId
                            ? child.props.layoutId + "-original-" + index
                            : undefined,
                    },
                    child.props?.children
                )}
            </li>
        </LayoutGroup>
    )
})

/* Dot Component */
interface DotProps {
    dotStyle: React.CSSProperties
    buttonStyle: React.CSSProperties
    onClick: () => void
    wrappedIndex: number
    wrappedIndexInverted: number
    selectedOpacity: number
    opacity: number
    total: number
    index: number
    gap: number
    padding: number
    isHorizontal: boolean
    isInverted: boolean
}

function Dot({
    selectedOpacity,
    opacity,
    total,
    index,
    wrappedIndex,
    wrappedIndexInverted,
    dotStyle,
    buttonStyle,
    gap,
    padding,
    isHorizontal,
    isInverted,
    ...props
}: DotProps) {
    /* Check active item */
    /* Go 0—1—2—3—4—5—0 */
    let isSelected = wrappedIndex === index

    /* Go 0—5—4—3—2—1—0—5 instead when inverted */
    if (isInverted) {
        isSelected = Math.abs(wrappedIndexInverted) === index
    }

    const inlinePadding = gap / 2
    let top = !isHorizontal && index > 0 ? inlinePadding : padding
    let bottom = !isHorizontal && index !== total - 1 ? inlinePadding : padding
    let right = isHorizontal && index !== total - 1 ? inlinePadding : padding
    let left = isHorizontal && index > 0 ? inlinePadding : padding

    return (
        <button
            aria-label={`Scroll to page ${index + 1}`}
            type="button"
            {...props}
            style={{
                ...buttonStyle,
                padding: `${top}px ${right}px ${bottom}px ${left}px`,
            }}
        >
            <motion.div
                style={{
                    ...dotStyle,
                }}
                initial={false}
                animate={{
                    opacity: isSelected ? selectedOpacity : opacity,
                }}
                transition={{ duration: 0.3 }}
            />
        </button>
    )
}

/* Dot Styles */
const dotsContainerStyle: React.CSSProperties = {
    display: "flex",
    placeContent: "center",
    placeItems: "center",
    overflow: "hidden",
    position: "absolute",
    pointerEvents: "auto",
}

const dotStyle: React.CSSProperties = {
    borderRadius: "50%",
    background: "white",
    cursor: "pointer",
    border: "none",
    placeContent: "center",
    placeItems: "center",
    padding: 0,
}
