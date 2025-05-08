declare module 'antd' {
  import * as React from 'react';

  export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    size?: 'small' | 'middle' | 'large';
    addonBefore?: React.ReactNode;
    addonAfter?: React.ReactNode;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    onSearch?: (value: string, event?: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>) => void;
    loading?: boolean;
    bordered?: boolean;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }

  export class Input extends React.Component<InputProps, any> {
    static Search: typeof Input.Search;
    focus(): void;
  }

  namespace Input {
    interface SearchProps extends InputProps {
      onSearch?: (value: string, event?: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>) => void;
      enterButton?: React.ReactNode;
      loading?: boolean;
    }
    class Search extends React.Component<SearchProps, any> {}
  }

  export interface ButtonProps {
    type?: 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | 'default';
    size?: 'small' | 'middle' | 'large';
    loading?: boolean | { delay: number };
    prefixCls?: string;
    className?: string;
    ghost?: boolean;
    danger?: boolean;
    icon?: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLElement>;
    children?: React.ReactNode;
    disabled?: boolean;
    title?: string;
  }

  export class Button extends React.Component<ButtonProps, any> {}

  export interface TagProps {
    color?: string;
    closable?: boolean;
    closeIcon?: React.ReactNode;
    onClose?: (e: React.MouseEvent<HTMLElement>) => void;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    children?: React.ReactNode;
  }

  export class Tag extends React.Component<TagProps, any> {}

  export interface AvatarProps {
    size?: number | 'large' | 'small' | 'default';
    shape?: 'circle' | 'square';
    src?: string;
    icon?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
  }

  export class Avatar extends React.Component<AvatarProps, any> {}

  export interface ListProps<T> {
    bordered?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    dataSource?: T[];
    grid?: any;
    itemLayout?: string;
    loading?: boolean;
    loadMore?: React.ReactNode;
    pagination?: any;
    renderItem?: (item: T, index: number) => React.ReactNode;
    rowKey?: ((item: T) => string) | string;
    size?: 'small' | 'default' | 'large';
    split?: boolean;
    header?: React.ReactNode;
    footer?: React.ReactNode;
  }

  export class List<T = any> extends React.Component<ListProps<T>, any> {
    static Item: typeof List.Item;
  }

  namespace List {
    interface ListItemProps {
      actions?: React.ReactNode[];
      className?: string;
      children?: React.ReactNode;
      style?: React.CSSProperties;
      extra?: React.ReactNode;
    }

    class Item extends React.Component<ListItemProps, any> {
      static Meta: typeof Item.Meta;
    }

    namespace Item {
      interface ListItemMetaProps {
        avatar?: React.ReactNode;
        className?: string;
        children?: React.ReactNode;
        description?: React.ReactNode;
        style?: React.CSSProperties;
        title?: React.ReactNode;
      }

      class Meta extends React.Component<ListItemMetaProps, any> {}
    }
  }

  // Add missing components

  export interface SliderProps {
    className?: string;
    disabled?: boolean;
    dots?: boolean;
    included?: boolean;
    marks?: Record<number, React.ReactNode>;
    max?: number;
    min?: number;
    range?: boolean;
    step?: number;
    tipFormatter?: null | ((value: number) => React.ReactNode);
    value?: number | [number, number];
    defaultValue?: number | [number, number];
    vertical?: boolean;
    onAfterChange?: (value: number | [number, number]) => void;
    onChange?: (value: number | [number, number]) => void;
    tooltip?: any;
  }

  export class Slider extends React.Component<SliderProps, any> {}

  export interface TabPaneProps {
    tab?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
    children?: React.ReactNode;
    key?: string;
    closable?: boolean;
    closeIcon?: React.ReactNode;
  }

  export class TabPane extends React.Component<TabPaneProps, any> {}

  export interface TabsProps {
    activeKey?: string;
    defaultActiveKey?: string;
    hideAdd?: boolean;
    onChange?: (activeKey: string) => void;
    onTabClick?: (key: string, event: React.MouseEvent | React.KeyboardEvent) => void;
    tabBarExtraContent?: React.ReactNode;
    tabBarGutter?: number;
    tabBarStyle?: React.CSSProperties;
    tabPosition?: 'top' | 'right' | 'bottom' | 'left';
    type?: 'line' | 'card' | 'editable-card';
    size?: 'large' | 'default' | 'small';
    centered?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    items?: Array<{
      key: string;
      label: React.ReactNode;
      children: React.ReactNode;
      disabled?: boolean;
      closable?: boolean;
      closeIcon?: React.ReactNode;
      className?: string;
      style?: React.CSSProperties;
    }>;
  }

  export class Tabs extends React.Component<TabsProps, any> {
    static TabPane: typeof TabPane;
  }

  export interface SpaceProps {
    align?: 'start' | 'end' | 'center' | 'baseline';
    direction?: 'vertical' | 'horizontal';
    size?: 'small' | 'middle' | 'large' | number;
    split?: React.ReactNode;
    wrap?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  export class Space extends React.Component<SpaceProps, any> {}

  export interface TooltipProps {
    title?: React.ReactNode;
    placement?: 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';
    trigger?: 'hover' | 'focus' | 'click' | 'contextMenu' | Array<'hover' | 'focus' | 'click' | 'contextMenu'>;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    mouseEnterDelay?: number;
    mouseLeaveDelay?: number;
    overlayClassName?: string;
    overlayStyle?: React.CSSProperties;
    color?: string;
    getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
    children?: React.ReactNode;
  }

  export class Tooltip extends React.Component<TooltipProps, any> {}

  export interface RadioChangeEvent {
    target: {
      value: any;
      checked: boolean;
    };
    preventDefault: () => void;
    stopPropagation: () => void;
    nativeEvent: MouseEvent;
  }

  export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    autoFocus?: boolean;
    checked?: boolean;
    defaultChecked?: boolean;
    value?: any;
    disabled?: boolean;
    onChange?: (e: RadioChangeEvent) => void;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  export interface RadioGroupProps {
    buttonStyle?: 'outline' | 'solid';
    defaultValue?: any;
    disabled?: boolean;
    name?: string;
    options?: Array<string | number | { label: React.ReactNode, value: string | number, disabled?: boolean }>;
    optionType?: 'default' | 'button';
    size?: 'large' | 'middle' | 'small';
    value?: any;
    onChange?: (e: RadioChangeEvent) => void;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  export class Radio extends React.Component<RadioProps, any> {
    static Group: React.ComponentClass<RadioGroupProps>;
    static Button: React.ComponentClass<RadioProps>;
  }

  export interface CardProps {
    actions?: React.ReactNode[];
    activeTabKey?: string;
    bordered?: boolean;
    cover?: React.ReactNode;
    defaultActiveTabKey?: string;
    extra?: React.ReactNode;
    headStyle?: React.CSSProperties;
    bodyStyle?: React.CSSProperties;
    hoverable?: boolean;
    loading?: boolean;
    size?: 'default' | 'small';
    tabBarExtraContent?: React.ReactNode;
    tabList?: Array<{ key: string; tab: React.ReactNode }>;
    tabProps?: object;
    title?: React.ReactNode;
    type?: 'inner';
    onTabChange?: (key: string) => void;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  export class Card extends React.Component<CardProps, any> {}

  export interface DividerProps {
    className?: string;
    dashed?: boolean;
    orientation?: 'left' | 'right' | 'center';
    plain?: boolean;
    style?: React.CSSProperties;
    type?: 'horizontal' | 'vertical';
    children?: React.ReactNode;
  }

  export class Divider extends React.Component<DividerProps, any> {}

  export interface SpinProps {
    delay?: number;
    indicator?: React.ReactNode;
    size?: 'small' | 'default' | 'large';
    spinning?: boolean;
    tip?: React.ReactNode;
    wrapperClassName?: string;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }

  export class Spin extends React.Component<SpinProps, any> {}

  export interface EmptyProps {
    description?: React.ReactNode;
    image?: React.ReactNode | string;
    imageStyle?: React.CSSProperties;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  export class Empty extends React.Component<EmptyProps, any> {}

  export interface SelectProps<T = any> {
    allowClear?: boolean;
    autoClearSearchValue?: boolean;
    autoFocus?: boolean;
    defaultActiveFirstOption?: boolean;
    defaultOpen?: boolean;
    defaultValue?: T;
    disabled?: boolean;
    dropdownClassName?: string;
    dropdownMatchSelectWidth?: boolean | number;
    dropdownRender?: (menu: React.ReactElement) => React.ReactElement;
    dropdownStyle?: React.CSSProperties;
    filterOption?: boolean | ((inputValue: string, option: React.ReactElement) => boolean);
    getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
    labelInValue?: boolean;
    listHeight?: number;
    loading?: boolean;
    maxTagCount?: number;
    maxTagPlaceholder?: React.ReactNode | ((omittedValues: any[]) => React.ReactNode);
    maxTagTextLength?: number;
    menuItemSelectedIcon?: React.ReactNode;
    mode?: 'multiple' | 'tags';
    notFoundContent?: React.ReactNode;
    open?: boolean;
    optionFilterProp?: string;
    optionLabelProp?: string;
    options?: Array<{ label: React.ReactNode, value: T, disabled?: boolean }>;
    placeholder?: React.ReactNode;
    showArrow?: boolean;
    showSearch?: boolean;
    size?: 'large' | 'middle' | 'small';
    suffixIcon?: React.ReactNode;
    removeIcon?: React.ReactNode;
    clearIcon?: React.ReactNode;
    menuItemSelectedIcon?: React.ReactNode;
    tokenSeparators?: string[];
    value?: T;
    virtual?: boolean;
    onBlur?: () => void;
    onChange?: (value: T, option: React.ReactElement | React.ReactElement[]) => void;
    onClear?: () => void;
    onDeselect?: (value: T, option: React.ReactElement) => void;
    onDropdownVisibleChange?: (open: boolean) => void;
    onFocus?: () => void;
    onInputKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
    onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
    onPopupScroll?: React.UIEventHandler<HTMLDivElement>;
    onSearch?: (value: string) => void;
    onSelect?: (value: T, option: React.ReactElement) => void;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  export class Select extends React.Component<SelectProps, any> {
    static Option: React.ComponentClass<any>;
    static OptGroup: React.ComponentClass<any>;
  }

  export interface SwitchProps {
    autoFocus?: boolean;
    checked?: boolean;
    checkedChildren?: React.ReactNode;
    className?: string;
    defaultChecked?: boolean;
    disabled?: boolean;
    loading?: boolean;
    size?: 'small' | 'default';
    unCheckedChildren?: React.ReactNode;
    onChange?: (checked: boolean, event: React.MouseEvent<HTMLButtonElement>) => void;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    style?: React.CSSProperties;
  }

  export class Switch extends React.Component<SwitchProps, any> {}

  export interface ProgressProps {
    type?: 'line' | 'circle' | 'dashboard';
    format?: (percent: number) => React.ReactNode;
    percent?: number;
    showInfo?: boolean;
    status?: 'success' | 'exception' | 'normal' | 'active';
    strokeColor?: string | { from: string; to: string; direction: string };
    strokeLinecap?: 'round' | 'square';
    strokeWidth?: number;
    success?: { percent: number; strokeColor: string };
    trailColor?: string;
    width?: number;
    gapDegree?: number;
    gapPosition?: 'top' | 'bottom' | 'left' | 'right';
    size?: 'default' | 'small';
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  export class Progress extends React.Component<ProgressProps, any> {}
}

declare module '@ant-design/icons' {
  import * as React from 'react';

  export interface IconComponentProps {
    className?: string;
    style?: React.CSSProperties;
    spin?: boolean;
    rotate?: number;
    twoToneColor?: string;
  }

  export type IconComponent = React.ForwardRefExoticComponent<
    IconComponentProps & React.RefAttributes<HTMLSpanElement>
  >;

  // Specific icon components
  export const StarOutlined: IconComponent;
  export const StarFilled: IconComponent;
  export const DownloadOutlined: IconComponent;
  export const LinkOutlined: IconComponent;
  export const BookOutlined: IconComponent;
  export const SearchOutlined: IconComponent;
  export const FireOutlined: IconComponent;
  export const HistoryOutlined: IconComponent;
  export const BulbOutlined: IconComponent;
  export const RobotOutlined: IconComponent;
  export const CameraOutlined: IconComponent;
  export const ScissorOutlined: IconComponent;
  export const FullscreenOutlined: IconComponent;
  export const ExpandOutlined: IconComponent;
  export const RulerOutlined: IconComponent;
  export const EyeOutlined: IconComponent;
  export const CodeOutlined: IconComponent;
  export const SettingOutlined: IconComponent;
  export const ReloadOutlined: IconComponent;
  export const CaretUpOutlined: IconComponent;
  export const CaretDownOutlined: IconComponent;
  export const InfoCircleOutlined: IconComponent;
  export const LoadingOutlined: IconComponent;
  export const BarChartOutlined: IconComponent;
  export const LineChartOutlined: IconComponent;
  export const DotChartOutlined: IconComponent;
  export const FileTextOutlined: IconComponent;
  export const ExperimentOutlined: IconComponent;
} 