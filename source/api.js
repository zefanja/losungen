var api = {
    //DATABASE API//
    createDB: function() {
        try {
            this.db = openDatabase('ext:settings', '', 'Losungen Data', 200000);
            enyo.log("Created/Opened database");
        } catch (e) {
            enyo.log("ERROR", e);
        }

        switch (this.db.version) {
            case '':
                enyo.log("Create Tables...");
                this.dbCreateTables('', "1");
            break;
        }
    },

    dbCreateTables: function(oldVersion, newVersion) {
        try {
            var sql = "CREATE TABLE IF NOT EXISTS losungen (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT, losungsText TEXT, lehrText TEXT, losungsVers TEXT, lehrVers TEXT, wTag TEXT, sonntag TEXT, tagesText TEXT, fortlaufenderText TEXT, spruch TEXT, spruchVers TEXT, lied TEXT, predigt TEXT, psalm TEXT, farbe TEXT, monatsSpruch TEXT, monatsVers TEXT);";
            this.db.changeVersion(oldVersion, newVersion,
                enyo.bind(this,(function (transaction) {
                    transaction.executeSql(sql, [],
                        enyo.bind(this, function () {enyo.log("SUCCESS: Created data table");}),
                        enyo.bind(this,this.errorHandler)
                    );
                }))
            );
        } catch (e) {
            enyo.log("ERROR", e);
        }
    },

    importData: function (inData, inCallback) {
        enyo.log("Importing Losungen Data...");
        var z = 0;
        try {
            var sql = "";
            this.db.transaction(
                enyo.bind(this,(function (transaction) {
                    sql = "INSERT INTO losungen (key, losungsText, lehrText, losungsVers, lehrVers, wTag, sonntag, tagesText, fortlaufenderText, spruch, spruchVers, lied, predigt, psalm, farbe, monatsSpruch, monatsVers) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                    for (var i=0; i<inData.length; i++) {
                        transaction.executeSql(sql, [inData[i].key, inData[i].losungsText, inData[i].lehrText, inData[i].losungsVers, inData[i].lehrVers, inData[i].wTag, inData[i].sonntag, inData[i].tagesText, inData[i].fortlaufenderText, inData[i].spruch, inData[i].spruchVers, inData[i].lied, inData[i].predigt, inData[i].psalm, inData[i].farbe, inData[i].monatsSpruch, inData[i].monatsVers],
                            function (transaction, result) {
                                z++;
                                if (z == inData.length) {
                                    inCallback();
                                }
                            },
                            function (transaction, e) { enyo.log("ERROR:", e.message);});
                    }
                    if(inData.length === 0)
                        inCallback();
                }))
            );
        } catch (e) {
            enyo.log("ERROR", e);
        }
    },

    get: function (key, inCallback) {
        var sql = "";
        try {
            sql = "SELECT * FROM losungen WHERE key = '" + key + "'";
            this.db.transaction(
                enyo.bind(this,(function (transaction) {
                    transaction.executeSql(sql, [],
                    function (transaction, results) {
                        inCallback(results.rows.item(0));
                    },
                    function (transaction, e) { enyo.log("ERROR:", e.message);});
                }))
            );
        } catch (e) {
            enyo.log("ERROR", e);
        }
    }
};