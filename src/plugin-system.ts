import { ReactElement } from 'react';

export interface Plugin {
  name: string;
  version: string;
  description: string;
  initialize: (api: PluginAPI) => Promise<void>;
  activate: () => Promise<void>;
  deactivate: () => Promise<void>;
}

export interface PluginAPI {
  registerHook: (hookName: string, callback: (data: unknown) => Promise<void>) => void;
  registerMenuItem: (location: string, item: MenuItem) => void;
  registerRoute: (path: string, component: () => ReactElement) => void;
}

interface MenuItem {
  label: string;
  path: string;
}

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private hooks: Map<string, Array<(data: unknown) => Promise<void>>> = new Map();
  private menuItems: Map<string, MenuItem[]> = new Map();
  private routes: Map<string, () => ReactElement> = new Map();

  async loadPlugin(plugin: Plugin): Promise<void> {
    this.plugins.set(plugin.name, plugin);
    await plugin.initialize(this.createPluginAPI(plugin));
  }

  private createPluginAPI(plugin: Plugin): PluginAPI {
    return {
      registerHook: (hookName: string, callback: (data: unknown) => Promise<void>) => {
        if (!this.hooks.has(hookName)) {
          this.hooks.set(hookName, []);
        }
        this.hooks.get(hookName)?.push(callback);
      },
      registerMenuItem: (location: string, item: MenuItem) => {
        if (!this.menuItems.has(location)) {
          this.menuItems.set(location, []);
        }
        this.menuItems.get(location)?.push(item);
      },
      registerRoute: (path: string, component: () => ReactElement) => {
        this.routes.set(path, component);
      },
    };
  }

  async executeHook(hookName: string, data: unknown): Promise<void> {
    const callbacks = this.hooks.get(hookName) || [];
    await Promise.all(callbacks.map(callback => callback(data)));
  }

  getMenuItems(location: string): MenuItem[] {
    return this.menuItems.get(location) || [];
  }

  getRoutes(): Map<string, () => ReactElement> {
    return this.routes;
  }
}

export const pluginManager = new PluginManager();
