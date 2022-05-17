
import { TreeData } from "../../components/navigation/treeview"

export const FAKE_SCHEMAS: TreeData[] = [
  {
    id: "100",
    title: "public",
    icon: "database",
    collapsibleState: "collapsed",
    children: [
      {
        id: "101",
        title: "Tables",
        icon: "table",
        counter: 3,
        collapsibleState: "expanded",
        children: [
          {
            id: "102",
            title: "city",
            children: [
              {
                title: "Columns",
                counter: 5,
                children: [
                  { id: "110", title: "id", tags: ["primary key", "integer"] },
                  { id: "111", title: "name", tags: ["not null", "text"] },
                  { id: "112", title: "country_code", tags: ["not null", "character(3)"] },
                  { id: "113", title: "district", tags: ["not null", "text"] },
                  { id: "114", title: "population", tags: ["not null", "integer"] },
                ],
              },
              { id: "120", title: "Indexes", counter: 1, children: [{ title: "city_pkey" }] },
              { id: "130", title: "Triggers", counter: 0, children: [] },
            ],
          },

          {
            id: "140",
            title: "country",
            children: [
              {
                title: "Columns",
                counter: 5,
                children: [
                  { title: "code", tags: ["primary key", "character(3)"] },
                  { title: "name", tags: ["not null", "text"] },
                  { title: "continent", tags: ["not null", "text"] },
                  { title: "region", tags: ["not null", "text"] },
                  { title: "surface_area", tags: ["not null", "real"] },
                  { title: "indep_year", tags: ["smallint"] },
                  { title: "population", tags: ["not null", "integer"] },
                  { title: "life_expectancy", tags: ["real"] },
                  { title: "gnp", tags: ["numeric(10,2)"] },
                  { title: "gnp_old", tags: ["numeric(10,2)"] },
                  { title: "local_name", tags: ["not null", "text"] },
                  { title: "government_form", tags: ["not null", "text"] },
                  { title: "head_of_state", tags: ["text"] },
                  { title: "capital", tags: ["integer"] },
                  { title: "code2", tags: ["not null", "character(2)"] },
                ],
              },
              {
                title: "Indexes",
                counter: 1,
                children: [{ title: "country_pkey" }],
              },
              {
                title: "Triggers",
                counter: 0,
                children: []
              },
            ],
          },
          {
            title: "country_language",
            children: [
              {
                title: "Columns",
                counter: 4,
                children: [
                  { title: "country_code", tags: ["primary key", "character(3)"] },
                  { title: "langage", tags: ["primary key", "text"] },
                  { title: "is_official", tags: ["not null", "boolean"] },
                  { title: "percentage", tags: ["not null", "real"] },
                ],
              },
              {
                title: "Indexes",
                counter: 1,
                children: [{ title: "country_language_pkey" }],
              },
              {
                title: "Triggers",
                counter: 0,
              },
            ],
          },
        ],
      },
      {
        title: "Views",
        counter: 0,
        children: null,
      },
      {
        title: "Functions",
        counter: 0,
        children: null,
      },
      {
        title: "Procedures",
        counter: 0,
      },
    ],
  },
]
