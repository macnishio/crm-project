import { Plugin, PluginAPI } from './plugin-system';
import React from 'react';

export default class SamplePlugin implements Plugin {
  name = 'Sample Plugin';
  version = '1.0.0';
  description = 'A sample plugin to demonstrate the plugin system';

  async initialize(api: PluginAPI): Promise<void> {
    api.registerHook('afterCreateContact', this.afterCreateContact);
    api.registerMenuItem('main', {
      label: 'Sample Plugin',
      path: '/sample-plugin',
    });
    api.registerRoute('/sample-plugin', SamplePluginComponent);
  }

  async activate(): Promise<void> {
    console.log('Sample plugin activated');
  }

  async deactivate(): Promise<void> {
    console.log('Sample plugin deactivated');
  }

  private async afterCreateContact(data: unknown): Promise<void> {
    console.log('Contact created:', data);
  }
}

function SamplePluginComponent(): React.ReactElement {
  return <div>This is a sample plugin component</div>;
}

export const samplePlugin = {
  name: 'Sample Plugin',
  version: '1.0.0',
  description: 'A sample plugin for demonstration purposes',
};
