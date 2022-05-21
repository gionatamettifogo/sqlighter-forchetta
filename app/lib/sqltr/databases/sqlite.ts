//
// sqlite.ts - DataSource for SQLite databases
//

import initSqlJs, { Database, QueryExecResult } from "sql.js"
import sqliteParser from "sqlite-parser"
import { Tree } from "../../data/tree"
import { DataConnection, DataConnectionConfigs, DataSchema } from "../connections"

export class SqliteDataConnection extends DataConnection {
  /** SQLite database connection */
  private _database: Database

  /** Database scheme abstract syntax tree (AST) */
  private _schema: DataSchema[]

  protected constructor(configs: DataConnectionConfigs) {
    super(configs)
  }

  public static async create(configs: DataConnectionConfigs, engine): Promise<SqliteDataConnection> {
    try {
      if (typeof configs.connection === "string") {
        throw new Error("Not implemented yet")
      }

      // TODO open sqlite from filename, url, etc.
      if (configs.client !== "sqlite3" || !configs.connection.buffer) {
        throw new Error("SqliteDataConnection.connect - can only create in memory connections from buffer data")
      }
/*
      const engine = await initSqlJs({
        // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
        // You can omit locateFile completely when running in node
        // locateFile: file => `https://sql.js.org/dist/${file}`
      })
*/

      // create database from memory buffer
      const connection = new SqliteDataConnection(configs)
      connection._database = new engine.Database(configs.connection.buffer)

/*
      try {
        if (window) {
          // @ts-ignore
          if (window.loadSQL) {
            console.log("Should try initSQLJS")
            // @ts-ignore
            const SQL = await window.loadSQL()
            connection._database = SQL(configs.connection.buffer)
          }
        }
      } catch (exception) {
        const SQL = await initSqlJs({
          // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
          // You can omit locateFile completely when running in node
          // locateFile: file => `https://sql.js.org/dist/${file}`
        })
        connection._database = new SQL.Database(configs.connection.buffer)
      }
*/
      // register connection in
      DataConnection._connections.push(connection)

      return connection
    } catch (exception) {
      console.error(`SqliteDataConnection.create - exception: ${exception}`, exception)
      throw exception
    }
  }

  //
  // schema
  //

  /**
   * This method will run a query on 'sqlite_schema' to retrieve the SQL create statements for all
   * the tables, indexes, triggers and views in the database. It will then parse the SQL statements
   * and create an abstract syntax tree (AST) for each entity. These ASTs will then be used to quickly
   * retrieve information like table's column, indexes constraints and so on.
   * @param refresh True if schema should be refreshed (default is using cached version if available)
   * @returns An array of abstract syntax tree definitions of the database schema
   * @see https://www.sqlite.org/schematab.html
   * @see https://www.npmjs.com/package/sqlite-parser
   */
  public async getSchema(refresh: boolean = false): Promise<DataSchema[]> {
    if (refresh || !this._schema) {
      const query = "select type, tbl_name, sql from sqlite_schema where tbl_name not like 'sqlite_%'"
      const result = await this.getResult(query)

      const schema: DataSchema[] = []
      for (const value of result.values) {
        const entity = value[0] as string,
          name = value[1] as string,
          sql = value[2] as string
        if (sql) {
          try {
            console.log(sql)
            let ast = sqliteParser(sql)
            ast = ast.statement[0] // remove statement list wrapper
            const name = ast.name?.name || ast.target?.name
            schema.push({ type: ast.format, name, sql, ast })
          } catch (exception) {
            console.error(
              `SqliteDataConnection.getSchema - ${entity}: ${name}, exception: ${exception}`,
              sql,
              exception
            )
            throw exception
          }
        } else {
          console.warn(`SqliteDataConnection.getSchema - ${entity}: ${name} doesn't have a SQL schema`)
        }
      }

      // sort entities
      schema.sort((a, b) => {
        if (a.type != b.type) {
          const order = { table: 0, index: 1, view: 2, trigger: 3 }
          return order[a.type as string] < order[b.type as string] ? -1 : 1
        }
        return a.name < b.name ? -1 : 1
      })

      this._schema = schema
    }
    return this._schema
  }

  //
  // tree
  //

  public async getTree(refresh: boolean = false): Promise<Tree> {


    return null
  }

  //
  // data
  //

  /** Run a SQL query and return zero o more results from it */
  public async getResults(sql: string): Promise<QueryExecResult[]> {
    try {
      return this._database.exec(sql)
    } catch (exception) {
      console.error(`SqliteDataConnection.getResults - sql: ${sql}, exception: ${exception}`, exception)
      throw exception
    }
  }

  /** Run a SQL query that generates a single result set */
  public async getResult(sql: string): Promise<QueryExecResult> {
    const results = await this.getResults(sql)
    if (results.length != 1) {
      throw new Error(`SqliteDataConnection.getResult - sql: '${sql}' returned ${results.length} results`)
    }
    return results[0]
  }
}

// class also acts as default export for module
export default SqliteDataConnection
