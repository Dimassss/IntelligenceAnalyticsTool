Architecture of the app
===========================

Files storing:
    [id, type, created, meta_data]
    type in ["%name of views which process corresponding file type%"]
    meta_data is any information which is connected to the file. For example, url, where we can find that file.
    File is not downloaded on localmachine until it is required by me. Else http request on url are used.
    If file is downloaded, so will be used that file.


App:
    collectors:
        handmade_data_collector:
            files storing: [id, type, created, meta_data]
                // file is not downloaded on localmachine until it is required by me. Else http request on url are used.
                If file is downloaded this file will be stored on path "collector_name/year/month/day/hour/minute/timestamp.filetype"
                default way.
                Saving by form.
            timeseries:
                Timesiries groups: [id, group_name, description, values_table_name]
                    - group_name is string made by me, or generated automaticly.
                    - values_table_name is name of table from which will
                        be taken values for timeseries
                Timesiries: [id, timestamp, time, value_id]
                    time in timesiries can be different, so to solve this problem there will be two
                    columns for time.
                    time column is for storing as string time, which is from this timesiries.
                    timestamp is timestamp which was given as a convertation time column
                    into timestamp.
                Structurized data: is stored in WebTables
                    - WebTables: [id, table_name]
                    - WebTableColumns: [id, table_id, column_name, type]
                    - WebTableRow: [id, table_id, data: json]
                    - WebTableData: [id, row_id, col_id, value: json] // this table is for cache and
                        is used in analyzing process. This table must be empty by default.
                        We are taking data from WebTableRow and proceed this data into WebTableData,
                        so we can analyze in using SQL methods.
                Objects:
                    Those objects can be stored in the following way:
                        - Objects: [id, created: timestamp, object: json]
                    Also objects can be stored in NoSQL database.

        %source%_data_collector:
            files storing:
                primarely in default way.
            any other data:
                depends on problem and data we are storing.
                must be created graphql interface
    Statements:
        - Statements: [id, report_id, type]
            report_id is id of md file in database
            type is value from list [assertion, estimation, conclusion]
        - StatementDataLinking: [id, statemnt_id, query]
    Workspace:
        Database:
            - Workspaces: [id, workspace_name, created, last_update, aim]
            - WorkspaceAttrs: [id, workspace_id, attr_name, value]
            - WorkspaceSummaries: [id, workspace_id, summary: json]
                // summary can have a lot of queries to data lake
            - WorkspaceDataLinking: [id, workspace_id, query]
            - WorkspaceStatements: [id, workspace_id, statement_id]

    app_instance:
        context:
            workspace_id

















