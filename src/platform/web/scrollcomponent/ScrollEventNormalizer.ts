import { ScrollEvent } from "../../../core/scrollcomponent/BaseScrollView";

export class ScrollEventNormalizer {
    public divEvent: ScrollEvent;
    public windowEvent: ScrollEvent;
    constructor(target: HTMLDivElement) {
        this.divEvent = {
            contentOffset: {
                get x(): number {
                    return target.scrollLeft;
                },
                get y(): number {
                    return target.scrollTop;
                },
            },
            contentSize: {
                get height(): number {
                    return target.scrollHeight;
                },
                get width(): number {
                    return target.scrollWidth;
                },
            },
            layoutMeasurement: {
                get height(): number {
                    return target.offsetHeight;
                },
                get width(): number {
                    return target.offsetWidth;
                },
            },
        };
        this.windowEvent = {
            contentOffset: {
                get x(): number {
                    return target.scrollLeft;
                },
                get y(): number {
                    return target.scrollTop;
                },
            },
            contentSize: {
                get height(): number {
                    return target.offsetHeight;
                },
                get width(): number {
                    return target.offsetWidth;
                },
            },
            layoutMeasurement: {
                get height(): number {
                    return window.innerHeight;
                },
                get width(): number {
                    return window.innerWidth;
                },
            },
        };
    }
}
