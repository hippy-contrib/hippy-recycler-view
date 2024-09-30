import * as React from "react";
import { LayoutEvent, ScrollView, View } from "@hippy/react";
import BaseScrollComponent, { ScrollComponentProps } from "../../../core/scrollcomponent/BaseScrollComponent";
import TSCast from "../../../utils/TSCast";
import { ScrollEvent } from "../../../core/scrollcomponent/BaseScrollView";
import { transferStyle } from "../../../utils/Style";

/***
 * The responsibility of a scroll component is to report its size, scroll events and provide a way to scroll to a given offset.
 * RecyclerListView works on top of this interface and doesn't care about the implementation. To support web we only had to provide
 * another component written on top of web elements
 */
export default class ScrollComponent extends BaseScrollComponent {
    public static defaultProps = {
        contentHeight: 0,
        contentWidth: 0,
        externalScrollView: TSCast.cast(ScrollView), //TSI
        isHorizontal: false,
        scrollThrottle: 16,
    };

    private _height: number;
    private _width: number;
    private _offset: number;
    private _isSizeChangedCalledOnce: boolean;
    private _scrollViewRef: ScrollView | null = null;

    constructor(args: ScrollComponentProps) {
        super(args);
        this._height = (args.layoutSize && args.layoutSize.height) || 0;
        this._width = (args.layoutSize && args.layoutSize.width) || 0;
        this._offset = 0;
        this._isSizeChangedCalledOnce = false;
    }

    public scrollTo(x: number, y: number, isAnimated: boolean): void {
        if (this._scrollViewRef) {
            this._scrollViewRef.scrollTo({ x, y, animated: isAnimated });
        }
    }

    public getScrollableNode(): number | null {
        // if (this._scrollViewRef && this._scrollViewRef.getScrollableNode) {
        //   return this._scrollViewRef.getScrollableNode();
        // }
        return null;
    }

    public getNativeScrollRef(): ScrollView | null {
        return this._scrollViewRef;
    }

    public render(): JSX.Element {
        const Scroller: ScrollView = TSCast.cast<ScrollView>(this.props.externalScrollView); //TSI
        const renderContentContainer = this.props.renderContentContainer ? this.props.renderContentContainer : this._defaultContainer;
        const contentContainerProps = {
            style: {
                height: this.props.contentHeight,
                width: this.props.contentWidth,
            },
            horizontal : this.props.isHorizontal,
            scrollOffset : this._offset,
            renderAheadOffset: this.props.renderAheadOffset,
            windowSize: (this.props.isHorizontal ? this._width : this._height) + this.props.renderAheadOffset,
        };
        //TODO:Talha
        const {
            useWindowScroll,
            contentHeight,
            contentWidth,
            externalScrollView,
            canChangeSize,
            renderFooter,
            isHorizontal,
            scrollThrottle,
            layoutSize,
            renderAheadOffset,
            onSizeChanged,
            onLayout,
            renderContentContainer: _r,
            ...props} = this.props;
        return (
          // @ts-ignore
            <Scroller ref={this._getScrollViewRef}
                removeClippedSubviews={false}
                clipChildren={false}
                scrollEventThrottle={scrollThrottle}
                {...props}
              style={transferStyle([{overflow: "visible"}, props.style])}
                horizontal={isHorizontal}
                onScroll={this._onScroll}
                onLayout={(!this._isSizeChangedCalledOnce || this.props.canChangeSize) ? this._onLayout : this.props.onLayout}>
                {/*// @ts-ignore*/}
                <View style={{ flexDirection: this.props.isHorizontal ? "row" : "column", overflow: "visible" }}>
                    {renderContentContainer(contentContainerProps, this.props.children)}
                    {renderFooter ? renderFooter() : null}
                </View>
            </Scroller>
        );
    }

    private _defaultContainer(props: object, children: React.ReactNode): React.ReactNode | null {
        return (
            <View {...props}>
                {/*// @ts-ignore*/}
                {children}
            </View>
        );
    }

    private _getScrollViewRef = (scrollView: any) => { this._scrollViewRef = scrollView as (ScrollView | null); };

    private _onScroll = (event?: ScrollEvent): void => {
        if (event) {
            const contentOffset = event.contentOffset;
            this._offset = this.props.isHorizontal ? contentOffset.x : contentOffset.y;
            this.props.onScroll(contentOffset.x, contentOffset.y, event as any);
        }
    }

    private _onLayout = (event: LayoutEvent): void => {
        const layout = event.layout;
        if (this._height !== layout.height || this._width !== layout.width) {
            this._height = layout.height;
            this._width = layout.width;
            if (this.props.onSizeChanged) {
                this._isSizeChangedCalledOnce = true;
                this.props.onSizeChanged(layout);
            }
        }
        if (this.props.onLayout) {
            this.props.onLayout(event);
        }
    }
}
