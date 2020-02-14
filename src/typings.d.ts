/* SystemJS module definition */
declare const IsWayland: boolean, MainWindowId: number;
declare var nodeModule: NodeModule;
interface NodeModule {
  id: string;
}
interface Window {
  process: any;
  require: any;
}
