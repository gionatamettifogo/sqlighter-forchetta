//
// index.tsx - home page
//

import Link from "@mui/material/Link"
import Stack from "@mui/material/Stack"

import { SiteLayout } from "../components/layouts"
import { Empty } from "../components/ui/empty"
import homeImage from "../public/images/empty2.jpg"

export default function Home({ props }) {
  return (
    <SiteLayout description="Lighter, mightier.">
      <Empty title="SQLighter" description="Lighter, mightier" image={homeImage} variant="fancy" />
      <Stack alignItems="center" justifyContent="center" mt={4}>
        <Link
          variant="subtitle2"
          href="mailto:info@sqlighter.com"
          underline="hover"
          sx={{
            cursor: "pointer",
            position: "absolute",
            bottom: 32,
            "@media (max-height: 480px)": {
              visibility: "hidden",
            },
          }}
        >
          info@sqlighter.com
        </Link>
      </Stack>
    </SiteLayout>
  )
}
