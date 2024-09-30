# HippyRecyclerView
forked from [Flipkart/recyclerlistview](https://github.com/Flipkart/recyclerlistview)

[![npm version](https://img.shields.io/npm/v/hippy-recycler-view.svg)](https://www.npmjs.com/package/hippy-recycler-view)
[![License](https://img.shields.io/badge/License-Apache%202.0-brightgreen.svg)](https://opensource.org/licenses/Apache-2.0)

如果这个项目对您有帮助，请用星星:star2:支持我们。

This is a high performance listview for React Native and Web with support for complex layouts. JS only with no native dependencies, inspired by both RecyclerView on Android
and UICollectionView on iOS.
这是适用于 Hippy 和 Web 的高性能列表视图，支持复杂布局。仅使用 JS，没有本机依赖项，灵感来自 Android 上的 RecyclerView 和 iOS 上的 UICollectionView。

`npm install --save hippy-recycler-view`

For latest beta:  
`npm install --save hippy-recycler-view@beta`

* **[概述和特点](#概述和特点)**
* **[为什么？](#为什么)**
* **[示例](#示例)**
* **[Props](#props)**
* **[Typescript](#typescript)**
* **[指南](#指南)**
* **[License](#license)**
* **[联系我们](#联系我们)**

注意：文档将很快升级，目前请检查代码注释以了解其清晰度并探索功能。此组件也正在使用 Hippy-Web 进行积极测试。

## 概述和特点
HippyRecyclerView 使用“单元格回收”来重用不再可见的视图来呈现项目，而不是创建新的视图对象。
创建对象非常昂贵，并且会产生内存开销，这意味着当您滚动列表时，内存占用量会不断增加。
从内存中释放不可见的对象是另一种技术，但这会导致创建更多对象和大量垃圾收集。回收是呈现无限列表的最佳方式，不会影响性能或内存效率。

除了性能优势之外，HippyRecyclerView 还具有以下出色的功能：
- 跨平台，可在 Web 上运行
- 支持交错网格布局
- 即使无法预先确定尺寸，也支持可变高度项目（prop - `forceNonDeterministicRendering`）
- 即时布局切换，如从 GridView 切换到 ListView 或反之亦然
- 末端到达检测
- 横向模式
- 可见性事件
- 初始渲染偏移/索引支持
- 页脚支持
- 容器尺寸改变时支持重排，并保留第一个可见项目
- 滚动位置保存
- 网页窗口滚动支持
- （新）添加了 ItemAnimator 接口，可根据您的意愿自定义 RLV 处理布局更改的方式。允许您修改移动单元格的动画。您可以执行诸如当某个单元格的高度发生变化时将项目平滑地移动到新位置之类的操作。
- （新）稳定 ID 支持，能够将稳定 ID 与项目关联。将启用漂亮的添加/删除动画，并在 DataProvider 更新时优化重新渲染。
- （新）粘性回收物品，可粘在顶部或底部。

## 为什么？

HippyRecyclerView 在构建时就考虑到了性能，这意味着快速滚动或掉帧时不会出现空白。
HippyRecyclerView 鼓励您为需要渲染的项目设置确定的高度。
这并不意味着您需要让所有项目具有相同的高度和内容，您所需要的只是一种查看数据并预先计算高度的方法， 以便 HippyRecyclerView 可以一次性计算布局，而不是等待绘制完成。
您仍然可以使用不同类型的项目来制作各种 GridView 和 ListView，这些项目都以最佳方式回收。基于类型的回收非常容易实现，而且开箱即用。

如果您无法提前确定项目的高度，只需在 HippyRecyclerView 上将 `forceNonDeterministicRendering` prop 设置为 `true`。
它将把给定的尺寸视为估计值并让项目调整大小。尝试给出好的估计值以改善体验。

## 示例

**Production Flipkart Grocery Demo Video (or try the app):** https://youtu.be/6YqEqP3MmoU  
**Infinite Loading/View Change (Expo):** https://snack.expo.io/@naqvitalha/rlv-demo  
**Mixed ViewTypes:** https://snack.expo.io/B1GYad52b  
**extendedState,stableIDs and ItemAnimator (Expo):** https://snack.expo.io/@arunreddy10/19bb8e  
**Sample project:** https://github.com/naqvitalha/travelMate  
**Web Sample (Using RNW):** https://codesandbox.io/s/k54j2zx977, https://jolly-engelbart-8ff0d0.netlify.com/  
**Context Preservation Sample:** https://github.com/naqvitalha/recyclerlistview-context-preservation-demo

**Other Video:** https://www.youtube.com/watch?v=Tnv4HMmPgMc

[![Watch Video](https://img.youtube.com/vi/Tnv4HMmPgMc/0.jpg)](https://www.youtube.com/watch?v=Tnv4HMmPgMc)

## Props

| Prop | 必填  | 参数类型 | 描述 |
| --- | --- | --- | --- |
| layoutProvider | Yes | `BaseLayoutProvider` | 定义每个元素的布局（高度/宽度）的构造函数 |
| dataProvider | Yes | `DataProvider` | 构造函数定义每个元素的数据 |
| contextProvider | No  | `ContextProvider` | 用于在视图被破坏的情况下维持滚动位置，这通常发生在后退导航中 |
| rowRenderer | Yes | `(type: string / number, data: any, index: number) => JSX.Element / JSX.Element[] / null` | 返回要渲染的 React 组件的方法。回调中会获取视图的类型、数据、索引和扩展状态 | 
| initialOffset | No  | `number` | 您想要开始渲染的初始偏移量；如果您想跨页面维护滚动上下文，这非常有用。| 
| renderAheadOffset | No  | `number` | 指定您希望视图提前渲染多少像素。增加此值有助于减少空白（如果有）。但是，保持尽可能低的值才是目的。更高的值也会增加重新渲染计算 |
| isHorizontal | No  | `boolean` | 如果为 `true`，列表将水平运行，而不是垂直运行 | 
| onScroll | No  | `(rawEvent: ScrollEvent, offsetX: number, offsetY: number) => void` | 当用户滚动时执行的滚动回调函数 |
| onRecreate | No  | `(params: OnRecreateParams) => void` | 从上下文提供程序重新创建回收站视图时执行的回调函数 |
| externalScrollView | No  | `{ new (props: ScrollViewDefaultProps): BaseScrollView }` | 使用它来传递 `BaseScrollView` 的实现 |
| onEndReached | No  | `() => void` | 当视图触底时执行的回调函数 |
| onEndReachedThreshold | No  | `number` | 指定 `onEndReached` 回调的提前像素数 |
| onEndReachedThresholdRelative | No  | `number` | 指定列表底部边缘必须距离内容末尾多远（以列表可见长度为单位）才能触发 `onEndReached` 回调 |
| onVisibleIndicesChanged | No  | `TOnItemStatusChanged` | 提供可见索引；有助于发送展示事件 |
| onVisibleIndexesChanged | No  | `TOnItemStatusChanged` | （2.0 beta 版已弃用）提供可见索引；有助于发送展示事件 |
| renderFooter | No  | `() => JSX.Element / JSX.Element[] / null` | 如果要呈现页脚，请提供此方法。有助于在进行增量加载时显示加载器 |
| initialRenderIndex | No  | `number` | 指定要从其开始渲染的初始项目索引。如果同时指定，则优先于 `initialOffset` |
| scrollThrottle | No  | `number` | 滚动节流时间 |
| canChangeSize | No  | `boolean` | 指定尺寸是否可以改变 |
| distanceFromWindow | No  | `number` | **(已弃用)** 使用 `applyWindowCorrection()` API 的 `windowShift`. **[用法?](#applywindowcorrection-usage)** |
| applyWindowCorrection | No  | `(offset: number, windowCorrection: WindowCorrection) => void` | (API 增强/替换 `distanceFromWindow`) 允许根据传递的校正值更新可见的 windowBounds。用户可以指定 **windowShift**；如果整个 RecyclerListWindow 需要向下/向上移动，**startCorrection**；如果顶部窗口边界需要移动，例如要向下移动的顶部窗口边界是与 RecyclerListView 顶部边缘重叠的内容， **endCorrection**：用于更改底部窗口边界以用于类似用例。**[用法?](#applywindowcorrection-usage)** |
| useWindowScroll | No  | `boolean` | 仅限 Web；在窗口中布局元素，而不是可滚动的 div |
| disableRecycling | No  | `boolean` | 关闭回收功能 |
| forceNonDeterministicRendering | No  | `boolean` | 默认值为 `false`；如果启用，布局提供程序中提供的尺寸将不会严格执行。如果无法准确确定项目尺寸，请使用此选项 |
| extendedState | No  | `object` | 在某些情况下，在行级别传递的数据可能不包含该项目所依赖的所有信息，您可以将所有其他信息保留在外部并通过此属性向下传递。更改此对象将导致所有内容重新渲染。请确保不要经常更改它以确保性能。重新渲染很繁重。|
| itemAnimator | No  | `ItemAnimator` | 启用 HippyRecyclerView 项目单元格动画（移动、添加、删除等）|
| style | No  | `object` | 将样式传递给内部 `ScrollView` |
| scrollViewProps | No  | `object` | 对于所有需要代理到内部/外部滚动视图的 `props`。将它们放在一个对象中，它们将被传播并传递下去。|
| layoutSize | No  | `Dimension` | 将防止计算列表视图的大小所需的初始空渲染，并使用这些尺寸在第一次渲染时渲染列表项。这对于服务器端渲染等情况很有用。如果渲染后可以更改大小，则必须将 prop `canChangeSize` 设置为 `true`。请注意，这不是滚动视图大小，仅用于布局。|
| onItemLayout | No  | `number` | 当 HippyRecyclerView 中的某项（位于索引处）布局完毕后执行的回调函数。这也可以用作 itemsRendered 类回调的代理。 |
| windowCorrectionConfig | No  | `object` | 用于指定窗口校正配置以及是否应将其应用于某些滚动事件 |

要查看完整功能集，请查看[HippyRecyclerView](https://github.com/linjinze999/hippy-recycler-view/blob/21049cc89ad606ec9fe8ea045dc73732ff29eac9/src/core/RecyclerListView.tsx#L540-L634)的 prop 定义 （文件底部）。所有`ScrollView`功能如`RefreshControl`均可立即使用。

### applyWindowCorrection usage

`applyWindowCorrection` 用于动态更改 HippyRecyclerView 的可见窗口边界。HippyRecyclerView 的 `windowCorrection` 以及当前滚动偏移量均会显示给用户。该`windowCorrection`对象由 3 个数值组成：
 - `windowShift`        - 直接替换`distanceFromWindow`参数。窗口偏移是 HippyRecyclerView 整体在 `StickyContainer` 内偏移的偏移值，使用此参数指定第一个列表项距离窗口顶部有多远。此值可校正 `StickyObjects` 和 `HippyRecyclerView` 的滚动偏移。
 - `startCorrection`    - `startCorrection` 用于指定顶部可见窗口边界的偏移，这样即使有外部因素（如 CoordinatorLayout 工具栏）用户也可以接收到正确的 Sticky 标头实例。
 - `endCorrection`      - `endCorrection` 用于指定底部可见窗口边界的偏移，当外部因素（如底部应用栏）改变可见视图边界时，用户可以接收正确的 Sticky Footer 实例。

如下例所示：

![Alt Text](/docs/images/getWindowCorrection_demo.gif)

## Typescript

Typescript 开箱即用。唯一的例外是继承的 Scrollview 属性。
为了让 Typescript 能够使用继承的 Scrollview 属性，您必须将所述继承的 Scrollview 属性放置在 scrollViewProps 属性内。

```javascript
<RecyclerListView
  rowRenderer={this.rowRenderer}
  dataProvider={queue}
  layoutProvider={this.layoutProvider}
  onScroll={this.checkRefetch}
  renderFooter={this.renderFooter}
  scrollViewProps={{
    refreshControl: (
      <RefreshControl
        refreshing={loading}
        onRefresh={async () => {
          this.setState({ loading: true });
          analytics.logEvent('Event_Stagg_pull_to_refresh');
          await refetchQueue();
          this.setState({ loading: false });
        }}
      />
    )
  }}
/>
```

## 指南
* **[Sample Code](https://github.com/linjinze999/hippy-recycler-view/tree/master/docs/guides/samplecode)**
* **[Performance](https://github.com/linjinze999/hippy-recycler-view/tree/master/docs/guides/performance)**
* **[Sticky Guide](https://github.com/linjinze999/hippy-recycler-view/tree/master/docs/guides/sticky)**
* **Web 支持：** 开箱即用，可与 React Native Web 配合使用。要与 ReactJS 配合使用，请从 `recyclerlistview/web` 导入，例如 `import { RecyclerListView } from "recyclerlistview/web"`。 。如果要保留导入路径，请使用别名。只有平台特定的代码才是构建的一部分，因此您的应用不会附带不必要的代码。
* **Polyfills Needed:** `requestAnimationFrame`, `ResizeObserver`

## License
**[Apache v2.0](https://github.com/Flipkart/recyclerlistview/blob/master/LICENSE.md)**

## 联系我们
如果您遇到任何问题，请新建 issue 描述。
