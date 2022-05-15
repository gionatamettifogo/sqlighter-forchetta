//
// layouts.tsx - shared layout components for app and website pages
//

import Head from "next/head"
import { useRouter } from "next/router"
import { useState, useEffect, useRef } from "react"

// https://www.npmjs.com/package/allotment
import { Allotment } from "allotment"
import "allotment/dist/style.css"

import Tab from "@mui/material/Tab"
import TabContext from "@mui/lab/TabContext"
import TabList from "@mui/lab/TabList"
import TabPanel from "@mui/lab/TabPanel"

import Container from "@mui/material/Container"
import { Theme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Toolbar from "@mui/material/Toolbar"
import SearchIcon from "@mui/icons-material/SearchOutlined"
import ArrowBackIcon from "@mui/icons-material/ArrowBackOutlined"
import CloseIcon from "@mui/icons-material/CloseOutlined"
import Typography from "@mui/material/Typography"

import { ActivityBar, ACTIVITYBAR_WIDTH } from "./activitybar"
import { SideBar, SIDEBAR_MIN_WIDTH } from "./sidebar"
import { Panel, PanelProps } from "./panel"

import { Menu } from "../menu"
import { Footer } from "../footer"
import { SearchResults } from "../search"
import { PropaneSharp } from "@mui/icons-material"
import { ta } from "date-fns/locale"

export const TITLE = "SQLighter"
export const HEADER_SMALL_HEIGHT = 64
export const HEADER_LARGE_HEIGHT = 128
export const DRAWER_WIDTH = 280

export function useSearch(search?: string) {
  const router = useRouter()
  useEffect(() => {
    if (search != undefined) {
      router.query.search = search
      router.replace(router)
    }
  }, [router])

  return [router.query.search as string]
}

interface TabsLayoutProps {
  /** Page title */
  title?: string

  /** Brief subtitle shown in page's header */
  description?: string

  /** Layout contents */
  children: React.ReactNode

  /** True if back icon should be shown */
  showBack?: boolean

  /** Additional actions to be placed on the right hand side of the toolbar */
  actions?: any

  /** Activities shown as icons in activity bar and as panels in side bar */
  activities: PanelProps[]

  tabs?: PanelProps[]
  tabValue?: string
  onTabChange?: (event: React.SyntheticEvent, tabId: any) => void

  /** Signed in user (or null) */
  user?: object
}

/** A shared layout for tab based applications pages, includes: menu drawer, header, footer, basic actions */
export function TabsLayout({
  children,
  title,
  description: subtitle,
  showBack,
  actions,

  activities,
  tabs,
  ...props
}: TabsLayoutProps) {
  // sibar with activities panel is visible?
  const [sidebarVisibile, setSidebarVisible] = useState(false)

  // search query entered in header if any
  const [query] = useSearch()

  // layout changes on medium and large screens
  const isMediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"))

  // use ?search= to drive search box
  const router = useRouter()

  // open or close navigation drawer
  const [open, setDrawer] = useState(false)

  const [activityId, setActivityId] = useState(activities[0].id)

  // input field showing search query
  const searchRef = useRef(0)

  // search is a controlled text field and is also shown in query as ?search=
  const [search, setSearch] = useState(router.query.search)
  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  // just route is updated, update local state, focuse on search box
  useEffect(() => {
    setSearch(router.query.search)
    if (search != undefined && searchRef.current) {
      ;(searchRef.current as HTMLButtonElement).focus()
    }
  }, [router])

  // when search text typed by user changes, update ?search= in query string
  useEffect(() => {
    if (search != undefined) {
      router.query.search = search
    } else {
      delete router.query.search
    }
    router.replace(router)
  }, [search])

  function getSearchToolbar() {
    return (
      <Stack sx={{ display: "flex", flexGrow: 1, marginTop: 1 }}>
        <Box sx={{ display: "flex", flexGrow: 1, marginBottom: 1 }}>
          <IconButton color="inherit" edge="start" onClick={(e) => setSearch("")}>
            <SearchIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}></Box>
          <Box>
            <IconButton onClick={(e) => setSearch(undefined)} color="inherit" edge="end">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        <TextField
          id="search-field"
          type="search"
          variant="standard"
          placeholder="Search"
          value={search}
          onChange={onSearchChange}
          inputRef={searchRef}
          autoFocus={true}
          InputProps={{ disableUnderline: true, style: { fontSize: "2rem", fontWeight: 700 } }}
          fullWidth
        />
      </Stack>
    )
  }

  function getHeaderToolbar() {
    return (
      <Stack sx={{ display: "flex", flexGrow: 1, marginTop: 1 }}>
        <Box sx={{ display: "flex", flexGrow: 1, marginBottom: 1 }}>
          {showBack ? (
            <IconButton onClick={(e) => router.back()} color="inherit" edge="start">
              <ArrowBackIcon />
            </IconButton>
          ) : (
            !isMediumScreen && (
              <IconButton onClick={(e) => setDrawer(true)} color="inherit" edge="start">
                <MenuIcon />
              </IconButton>
            )
          )}
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="inherit" edge={actions ? undefined : "end"} onClick={(e) => setSearch("")}>
            <SearchIcon />
          </IconButton>
          {actions}
        </Box>
        <Typography variant="h3" color="text.primary" noWrap={true}>
          {title || "\xa0"}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap={true}>
          {subtitle || "\xa0"}
        </Typography>
      </Stack>
    )
  }

  //
  // handlers
  //

  /** Track when a different activity icon is selected */
  function handleActivityChange(e, clickedActivityId) {
    setActivityId(clickedActivityId)
    setSidebarVisible(true)
  }

  /** Clicking currently selected activity icon will toggle sidebar open/close */
  function handleActivityClick(e, clickedActivityId) {
    if (clickedActivityId == activityId) {
      // console.debug(`handleActivityClick - clickedActivityId: ${clickedActivityId}, sidebarVisible: ${sidebarVisibile}`)
      setSidebarVisible(!sidebarVisibile)
    }
  }

  /** Track sidebar visibility change when user snaps panel shut */
  function handleSidebarVisibilityChange(index, visible) {
    // console.debug(`handleSidebarVisibilityChange - index: ${index}, visible: ${visible}`)
    if (index == 1) {
      setSidebarVisible(visible)
    }
  }

  const pageTitle = title ? `${title} | ${TITLE}` : TITLE
  title = title || TITLE

  //console.debug(`TabsLayout - props.user: ${props.user}`, props.user)

  //
  // render
  //

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Biomarkers" />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            title
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={title} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Box sx={{ width: "100%", height: "100%" }}>
        <Allotment onVisibleChange={handleSidebarVisibilityChange}>
          <Allotment.Pane maxSize={ACTIVITYBAR_WIDTH} minSize={ACTIVITYBAR_WIDTH} visible>
            <ActivityBar
              activities={activities}
              activityId={activityId}
              user={props.user}
              onClick={handleActivityClick}
              onChange={handleActivityChange}
            />
          </Allotment.Pane>
          <Allotment.Pane minSize={SIDEBAR_MIN_WIDTH} preferredSize={SIDEBAR_MIN_WIDTH} visible={sidebarVisibile} snap>
            <SideBar activities={activities} activityId={activityId} />
          </Allotment.Pane>
          <Allotment.Pane>
            {tabs && (
              <TabContext value={props.tabValue}>
                <TabList onChange={props.onTabChange} scrollButtons="auto">
                  {tabs &&
                    tabs.map((tab: any) => (
                      <Tab key={tab.id} label={title} value={tab.id} icon={tab.icon} iconPosition="start" />
                    ))}
                </TabList>
                {tabs.map((tab: any) => (
                  <TabPanel key={tab.id} id={tab.id} value={tab.id} sx={{ padding: 0, width: "100%", height: "100%" }}>
                    <Panel {...tab} />
                  </TabPanel>
                ))}
              </TabContext>
            )}
          </Allotment.Pane>
        </Allotment>
      </Box>
    </>
  )
}
