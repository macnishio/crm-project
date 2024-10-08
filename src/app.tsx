import React from 'react'
import { usePlugins } from './plugin-system'

export default function App() {
  const plugins = usePlugins()

  return (
    <div>
      <h1>CRM Application</h1>
      {plugins.map((plugin, index) => (
        <div key={index}>
          <h2>{plugin.name}</h2>
          <plugin.component />
        </div>
      ))}
    </div>
  )
}