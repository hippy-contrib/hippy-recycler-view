import * as React from "react";
import { CSSProperties } from "react";
import { Dimension } from "../dependencies/LayoutProvider";

export interface ScrollViewDefaultProps {
    onScroll: (event: ScrollEvent) => void;
    onSizeChanged: (dimensions: Dimension) => void;
    horizontal: boolean;
    canChangeSize: boolean;
    style?: CSSProperties | null;
    useWindowScroll: boolean;
}
export interface ScrollEvent {
    contentOffset: { x: number; y: number };
    contentInset?: { top: number; left: number; bottom: number; right: number };
    contentSize?: Dimension;
    layoutMeasurement?: Dimension;
}
export default abstract class BaseScrollView extends React.Component<ScrollViewDefaultProps, {}> {
    constructor(props: ScrollViewDefaultProps) {
        super(props);
    }

    public abstract scrollTo(scrollInput: { x: number, y: number, animated: boolean }): void;
}
