var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

// Create connection to database
var config =
    {
        userName: 'wateruser', // update me
        password: 'x{kqVK?9rsr?]xfcpxx?a2vxURB6dcvf', // update me
        server: 'zetacomzorgtotaal.database.windows.net' // update me
        // options:
        //     {
        //         database: 'somedb' //update me
        //         , encrypt: true
        //     }
    }
var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err)
    {
        if (err)
        {
            console.log(err)
        }
        else
        {
            queryDatabase()
        }
    }
);

function queryDatabase()
{ console.log('Reading rows from the Table...');

    // Read all rows from table
    request = new Request(
        "SELECT TOP 20 pc.Name as CategoryName, p.name as ProductName FROM [SalesLT].[ProductCategory] pc JOIN [SalesLT].[Product] p ON pc.productcategoryid = p.productcategoryid",
        function(err, rowCount, rows)
        {
            console.log(rowCount + ' row(s) returned');
            process.exit();
        }
    );

    request.on('row', function(columns) {
        columns.forEach(function(column) {
            console.log("%s\t%s", column.metadata.colName, column.value);
        });
    });
    connection.execSql(request);
}