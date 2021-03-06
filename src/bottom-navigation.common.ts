import { AddChildFromBuilder, View } from 'tns-core-modules/ui/core/view';
import { CssProperty, Property } from 'tns-core-modules/ui/core/properties';
import { EventData } from 'tns-core-modules/data/observable';
import { Style } from 'tns-core-modules/ui/styling/style';
import { Color } from 'tns-core-modules/color';
import { booleanConverter } from 'tns-core-modules/ui/core/view-base';

/**
 * Event interface for tab selected event
 */
export interface OnTabSelectedEventData extends EventData {
  oldIndex: number;
  newIndex: number;
}

export abstract class BottomNavigationBase extends View implements AddChildFromBuilder {

  /**
   * Get or set the Bottom Navigation tabs
   * @type {Array<BottomNavigationTabBase>}
   */
  public tabs: BottomNavigationTabBase[];

  /**
   * Get or set the current selected tab index
   *
   * @type {number}
   */
  public selectedTabIndex: number = 0;

  /**
   * Get or set the color of the icon and title of the selected tab.
   *
   * @type {string}
   */
  public activeColor: string = 'blue';

  /**
   * Get or set the color of the icon and title of not selected tabs.
   *
   * @type {string}
   */
  public inactiveColor: string = 'gray';

  /**
   * Get or set the backgroundColor of the bottomNavigation
   *
   * @type {string}
   */
  public backgroundColor: string = 'white';

  /**
   * Get or set the keyLineColor of the bottomNavigation only for iOS
   *
   * @type {string}
   */
  public keyLineColor: string = '#eeeeee';

  /**
   * Method allowing to manually select a tab
   *
   * @param {number} index
   */
  public selectTab(index: number): void {
    if (index !== this.selectedTabIndex) {
      this.selectTabNative(index);
    }
  }

  public onTabSelected(index: number): boolean {
    let eventData: OnTabSelectedEventData = {
      eventName: 'tabSelected',
      object: this,
      oldIndex: this.selectedTabIndex || 0,
      newIndex: index
    };
    if (this.tabs[index].selectable) { this.selectedTabIndex = index; }
    this.notify(eventData);

    return this.tabs[index].selectable;
  }

  _addChildFromBuilder(name: string, value: any): void {
    if (name === 'BottomNavigationTab') {
      if (!this.tabs) {
        this.tabs = <BottomNavigationTabBase[]>[];
      }
      this.tabs.push(<BottomNavigationTabBase>value);
    }
  }

  protected abstract selectTabNative(index: number): void;
}

export const tabsProperty = new Property<BottomNavigationBase, BottomNavigationTabBase[]>(
  {
    name: 'tabs',
    equalityComparer: (a: any[], b: any[]) => !a && !b && a.length === b.length
  }
);

tabsProperty.register(BottomNavigationBase);

export const activeColorProperty = new Property<BottomNavigationBase, string>(
  {
    name: 'activeColor'
  }
);

activeColorProperty.register(BottomNavigationBase);

export const activeColorCssProperty = new CssProperty<Style, Color>(
  {
    name: 'tabActiveColor',
    cssName: 'tab-active-color',
    equalityComparer: Color.equals,
    valueConverter: (v) => new Color(v)
  });
activeColorCssProperty.register(Style);

export const inactiveColorProperty = new Property<BottomNavigationBase, string>(
  {
    name: 'inactiveColor'
  }
);

inactiveColorProperty.register(BottomNavigationBase);

export const inactiveColorCssProperty = new CssProperty<Style, Color>(
  {
    name: "tabInactiveColor",
    cssName: "tab-inactive-color",
    equalityComparer: Color.equals,
    valueConverter: (v) => new Color(v)
  }
);
inactiveColorCssProperty.register(Style);

export const backgroundColorProperty = new Property<BottomNavigationBase, string>(
  {
    name: 'backgroundColor'
  }
);

backgroundColorProperty.register(BottomNavigationBase);

export const backgroundColorCssProperty = new CssProperty<Style, Color>(
  {
    name: 'tabBackgroundColor',
    cssName: 'tab-background-color',
    equalityComparer: Color.equals,
    valueConverter: v => new Color(v)
  }
);
backgroundColorCssProperty.register(Style);

export const keyLineColorProperty = new Property<BottomNavigationBase, string>(
  {
    name: 'keyLineColor'
  }
);

keyLineColorProperty.register(BottomNavigationBase);

export const keyLineColorCssProperty = new CssProperty<Style, Color>(
  {
    name: 'tabKeyLineColor',
    cssName: 'tab-keyline-color',
    equalityComparer: Color.equals,
    valueConverter: v => new Color(v)
  }
);

keyLineColorCssProperty.register(Style);

export class BottomNavigationTabBase {

  constructor(title: string, icon: string, selectable?: boolean, parent?: WeakRef<BottomNavigationBase>) {
    this._title = title;
    this._icon = icon;
    if (selectable) { this._selectable = selectable; }
    if (parent) { this._parent = parent; }
  }

  private _title: string;

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    if (this.title !== value) {
      this._title = value;
    }
  }

  private _icon: string;

  get icon(): string {
    return this._icon;
  }

  set icon(value: string) {
    if (this._icon !== value) {
      this._icon = value;
    }
  }

  private _selectable: boolean = true;

  get selectable(): boolean {
    return booleanConverter(<any>this._selectable);
  }

  set selectable(value: boolean) {
    this._selectable = value;
  }

  private _parent?: WeakRef<BottomNavigationBase>;

  get parent(): WeakRef<BottomNavigationBase> {
    return this._parent;
  }

  set parent(value: WeakRef<BottomNavigationBase>) {
    if (this._parent !== value) {
      this._parent = value;
    }
  }
}
