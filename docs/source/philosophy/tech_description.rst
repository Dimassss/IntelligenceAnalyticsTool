
Description of App
==================

Aim: analyze description to understand how to build an app architecture.

Data Lake
---------

First of all there must be data lake.
Data lake is the place, where is collected all the data I get.
Sources of data: technologies; real life

Let analyze, which data I can get from eah source.

Real life:
    That can be own notices and thoughts or somebody told me somethings and so on.
    Each such data can be described as simple note in txt file or something like that.
    So this data can be stored as text.

    Summary:
        data from real life can be stored in text format as notes.

Technologies:
    file: photo, video, docx, txt, audio, html, ...;
    timeline: person's geolocation, social media activity, achivements; with respect to time;
    data which can be stored in relation database.

There must be mechanism of collection, storing and interaction with data (CRUD)

How to collect data?
     - If this data from real life, so I will simply collect it in the app in special form there.
        Form for my notes in relation DB:  [time, note]
     - If this data has technical character:
        This data can be entered by me or collected automaticly.

        So there might be special forms to enter that data by myself in app.
            Loading files, creating timelines and storing datasets or objects.
            Storing datasets an objects can be done as web tables and forms, which
            I constract by myslef or can be stored as xml, json or other type of file.

        As well, there might be possibility to write new collectors and manage them in app.
            Each collector is submodule, so could have its own system of tables and folder
            for storing files.

How to store data?
    - real life data will be simply stored in realtion database as table [time:timestamp, note: string]
    - technical data:
        - file
            file will be stored in file system or it will be url of file in internet.
            also, information about file will be stored in DB in table [id, path, type, created, url]
            If there is no need, file must not be downloaded. Only link saved. But there in app must
            be a button for downloading a file on local system.
            Of course, there can be updates of file, but I will assume, that this updated file
            is in fact new file.
        - hand-entered data (in fact this is special form of collector)
            - timeseries
                This type of data will be stored in DB in two tables:
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
            - files can be uploaded by button
            - urls on files and pages can be saved in files table
            - I might be able to create web-tables, where I will store structurized data.
                Such web-tables will be stored in several tables in DB.
                    - WebTables: [id, table_name]
                    - WebTableColumns: [id, table_id, column_name, type]
                    - WebTableRow: [id, table_id, data: json]
                    - WebTableData: [id, row_id, col_id, value: json] // this table is for cache and
                        is used in analyzing process. This table must be empty by default.
                        We are taking data from WebTableRow and proceed this data into WebTableData,
                        so we can analyze in using SQL methods.
            - Creating forms for storing objects.
                Those objects can be stored in the following way:
                    - Objects: [id, created: timestamp, object: json]
                Also objects can be stored in NoSQL database.
        - Collectors
            File storing architecture is the same for each collector.
            Data, which is stored in DB: this architecture is built personaly for each collector.

How to interact with data?
    In fact, all this app is collector system: collector of handmade data and auto-collectors.
    So each collector might give its own graphql api to interact with this collector.


App working space
-----------------

Working space is separate place, where achiving specific aim.
Such workplaces will be stored in DB as following:
    - Workspaces: [id, workspace_name, created, last_update, aim]
    - WorkspaceAttrs: [id, workspace_id, attr_name, value]
    - WorkspaceSummaries: [id, workspace_id, summary: json]
        // summary can have a lot of queries to data lake

Data attaching will be done by this table: [id, workspace_id, query]

Statemnts:
    Statements can be separaated from workspace, this is why we should not connect
    statement strictly to workspace, so it will be easier to use it in other
    workspaces.
    Each statement can be done as report in md file =: proof + summary
    This means each stateent can be stored as set {data, proof + summary}
    So I will write my statemnts in md files.
    In database statement will be stored as follows:
        - Statements: [id, report_id, type]
            report_id is id of md file in database
            type is value from list [assertion, estimation, conclusion]
        - StatementDataLinking: [id, statemnt_id, query]
        - WorkspaceStatements: [id, workspace_id, statement_id]

App instance
------------

There might be stored variable workspace_id, so it will be clear which workspace context is now.
This variable might be set at the begining. Otherwise, it will be impossible to attach
data, for example.















