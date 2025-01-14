//
// databasepanel.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { Box } from "@mui/material"
import { StorybookDecorator } from "../components/storybook"
import { DatabasePanel } from "../components/panels/databasepanel"
import { fake_connection1 } from "./fakedata"

export default {
  title: "Database/DatabasePanel",
  component: DatabasePanel,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
  args: {
    title: "Database",
    connection: fake_connection1,
  },
  parameters: {
    grid: { cellSize: 8 },
  },
} as ComponentMeta<typeof DatabasePanel>

const Template: ComponentStory<typeof DatabasePanel> = (args) => {
  return (
    <Box sx={{ height: 800, width: 1 }}>
      <DatabasePanel {...args} />
    </Box>
  )
}

export const Primary = Template.bind({})
