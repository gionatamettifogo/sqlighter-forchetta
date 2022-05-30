//
// querytab.tsx - panel used to edit and run database queries, show results
//

import React, { ReactElement } from "react"
import { useState } from "react"
import { parseISO, format } from "date-fns"

import { Allotment } from "allotment"
import "allotment/dist/style.css"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"

import { Command, CommandEvent } from "../commands"
import { DataConnection } from "../../lib/sqltr/connections"
import { generateId } from "../../lib/items/items"

import { Icon } from "../ui/icon"
import { Panel, PanelProps, PanelElement } from "../navigation/panel"
import { Tabs } from "../navigation/tabs"

import { ConnectionsMenu } from "./connectionsmenu"
import { SqlEditor } from "../editor/sqleditor"
import { QueryResultsPanel, QueryResultsPanelProps } from "./queryresultspanel"

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

export interface QueryTabProps extends PanelProps {
  /** Currently selected connection */
  connection?: DataConnection

  /** All available data connections */
  connections?: DataConnection[]

  /** Initial value for SQL query string shown in editor */
  sql: string

  /** Results are shown below query or to the side (default, bottom) */
  variant?: "bottom" | "right"

  /** Callback used to dispatch application level commands generated by the panel */
  onCommand?: CommandEvent
}

export function QueryTab(props: QueryTabProps) {
  // currently selected result tab
  const [tabId, setTabId] = useState<string>()
  // list of available results (shown in tabs)
  const [tabs, setTabs] = useState<PanelElement[]>([])

  const [sql, setSql] = useState<string>(props.sql)

  //
  // handlers
  //

  async function handleRunQuery(e: React.SyntheticEvent) {
    console.debug(`handleRunQuery - ${sql}`)

    // create a tab that is shown while the query is being executed to display progress, etc.
    let updatedTabs = [...tabs]
    const startedOn = new Date()
    const runningProps: QueryResultsPanelProps = {
      id: generateId("tab_"),
      title: startedOn.toLocaleTimeString(),
      status: "running",
      startedOn,
    }
    updatedTabs = [<QueryResultsPanel {...runningProps} />, ...updatedTabs]
    setTabs(updatedTabs)
    setTabId(runningProps.id)

    try {
      const queryResults = await props.connection.getResults(sql)
      await delay(500) // TODO remove, only used to see updating cycle
      console.debug(`risultato query[0]`, queryResults[0])

      // first query completed normally
      runningProps.status = "completed"
      runningProps.columns = queryResults[0].columns
      runningProps.values = queryResults[0].values

      if (queryResults.length > 1) {
        runningProps.title += " (1)"

        for (let i = 1; i < queryResults.length; i++) {
          const additionalTab = (
            <QueryResultsPanel
              id={generateId("tab_")}
              title={`${startedOn.toLocaleTimeString()} (${i + 1})`}
              startedOn={startedOn}
              completedOn={new Date()}
              status="completed"
              columns={queryResults[i].columns}
              values={queryResults[i].values}
            />
          )
          updatedTabs.splice(i, 0, additionalTab)
        }
      }
    } catch (exception) {
      // an error was thrown during query execution
      runningProps.status = "error"
      runningProps.error = exception.toString()
    }

    // update first tab with first result of current query
    // refresh entire list also adding any new additional tabs
    runningProps.completedOn = new Date()
    updatedTabs.splice(0, 1, <QueryResultsPanel {...runningProps} />)
    setTabs([...updatedTabs])
  }

  async function handleCommand(e: React.SyntheticEvent, command: Command) {
    console.debug(`QueryPanel.handleCommand - ${command.command}`, command)
    switch (command.command) {
      case "editor.changeValue":
        // TODO should debounce calls
        setSql(command.args.value)
        break

      case "tabs.changeTabs":
        setTabId(command.args.tabId)
        setTabs(command.args.tabs)
        break
    }
  }

  //
  // render
  //

  const HEADER_HEIGHT = 150
  const MAIN_HEIGHT = 200
  const variant = "vertical"

  function renderHeader() {
    return (
      <Box className="PanelWithResults-header" sx={{ display: "flex", height: HEADER_HEIGHT, m: 1 }}>
        <Box className="QueryTab-header-left" sx={{ flexGrow: 1 }}>
          <Box>
            <TextField id="outlined-basic" variant="outlined" value={props.title} />
          </Box>
        </Box>
        <Box className="QueryTab-header-right">
          <Box sx={{ display: "flex" }}>
            <Button variant="contained" onClick={handleRunQuery} startIcon={<Icon>play</Icon>} sx={{ mr: 1 }}>
              Run all
            </Button>
          </Box>
          <ConnectionsMenu connection={props.connection} connections={props.connections} />
        </Box>
      </Box>
    )
  }

  function renderEditor() {
    return <SqlEditor value={props.sql} onCommand={handleCommand} />
  }

  function renderResults() {
    if (tabs && tabs.length > 0) {
      return <Tabs tabId={tabId} tabs={tabs} onCommand={handleCommand} />
    }

    // TODO show empty state, eg empty tray icon + your results will appear here or similar
    return <>No results yet</>
  }

  return (
    <Box className="QueryPanel-root" sx={{ width: 1, height: 1, maxHeight: 1 }}>
      <Allotment vertical={true}>
        <Allotment.Pane minSize={150} maxSize={150}>
          {renderHeader()}
        </Allotment.Pane>
        <Allotment.Pane>
          <Allotment vertical={props.variant !== "right"}>
            <Allotment.Pane minSize={100}>{renderEditor()}</Allotment.Pane>
            <Allotment.Pane minSize={100}>
              <Box sx={{ height: 1, maxHeight: 1 }}>{renderResults()}</Box>
            </Allotment.Pane>
          </Allotment>
        </Allotment.Pane>
      </Allotment>
    </Box>
  )
}

/** Create a query tab in response to a sqlighter.viewQuery command */
export function createQueryTab(command: Command, connection?: DataConnection, connections?: DataConnection[]) {
  const title = `Untitled, ${format(new Date(), "LLLL d, yyyy")}`
  return (
    <QueryTab
      id={generateId("tab_")}
      title={title}
      icon={"query"}
      connection={connection}
      connections={connections}
      sql={command?.args?.sql}
    />
  )
}
