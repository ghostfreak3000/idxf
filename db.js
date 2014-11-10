/* 
 * This is a simple facade for indexedDb created by me (Bishaka Samuel).
 * https://www.facebook.com/bishaka.samuel
 * https://www.twitter.com/sbishaka
 * 
 * Just use it, change it, destroy it(I got a copy....:)....).
 */

var db = (function(_dbname,_version){
    
    var dbname = _dbname;
    var version = _version;
    var _db = {};
    
    
    /**
     * 
     * @param {String} _name
     * @returns {null}
     */
    _db.addStore = function(_name){                
        pvt_cron(function(db){           
            pvt_addStore(db,_name);                        
        });                
    };
    
    
    /**
     * 
     * @param {String} _store
     * @param {Object} _data
     * @returns {null}
     */
    _db.addData = function(_store,_data){
        pvt_cron(function(db){            
            pvt_addData(db,_store,_data);            
        });           
    };
    
    
    /**
     * 
     * @param {String} _store
     * @param {int} _id
     * @returns {null}
     */
    _db.delDataOnId = function(_store,_id)
    {
        pvt_cron(function(db){
            pvt_delDataOnId(db, _store, _id); 
        });
    };


    /**
     * 
     * @param {String} _store
     * @param {int} _id
     * @param {function} callback
     * @returns {null}
     */
    _db.getDataOnId = function(_store, _id, callback){
        pvt_cron(function(db){
            pvt_getDataOnId(db,_store,_id,callback); 
        });
    };

    /**
     * 
     * @param {String} _store
     * @param {function} callback
     * @returns {null}
     */
    _db.getData = function(_store, callback){
        pvt_cron(function(db){
            pvt_getData(db,_store,callback); 
        });
    };
    
    /**
     * 
     * @param {String} _store
     * The name of the object store where the data will be set
     * @param {int} _id
     * @param {Object} _data
     * @returns {null}
     */
    _db.setDataOnId = function(_store, _id, _data){
        pvt_cron(function(db){
            pvt_setDataOnId(db,_store,_id,_data); 
        });        
    };
    
    function pvt_cron( callback ){
      
        var request = window.indexedDB.open(dbname, version);            
        
        request.onsuccess = function(event){
            var db = request.result;
            if( typeof callback === "function" )
            {
                callback(db);
            }            
        };
        
        request.onupgradeneeded = function(event){  
            var db = event.target.result;
            if( typeof callback === "function" )
            {
                callback(db);
            }        
        };
      
        
    };
    
    function pvt_addStore(db,_name){
        try{
            db.createObjectStore(_name, { autoIncrement : true });
        }
        catch(e)
        {
            //To do, handle these interesting errors
            switch(e.code)
            {
                case e.INVALID_STATE_ERR:
                break;
            }
        }
    };
    
    //Adds data to an object store, takes db, store name and object data
    function pvt_addData(db,_store,_data)
    {
       var tx = db.transaction([_store], "readwrite");
       var oSt = tx.objectStore(_store);
       oSt.add(_data);
    };
    
    function pvt_delDataOnId(db,_store,_id)
    {
            db.transaction([_store], "readwrite")
                             .objectStore(_store)
                                     .delete(_id);  
    };
    
    function pvt_getDataOnId(db,_store,_id,callback)
    {
        var request =   db.transaction([_store], "readwrite")
                        .objectStore(_store)
                        .get(_id);  

        request.onsuccess = function(event) {
            request.result;
            if( typeof callback === "function" )
            {
                callback(request.result);
            }
            
        };                             
    };
    
    function pvt_getData(db,_store,callback)
    {
        var entries = [];
        
        var request =   db.transaction([_store])
                        .objectStore(_store)
                        .openCursor();  

        request.onsuccess = function(event) {
            var cursor = event.target.result;
            if(cursor)
            {
                entries.push({key:cursor.key, value:cursor.value});
                cursor.continue();
            }
            else
            {
                if( typeof callback === "function" )
                {
                    callback(entries);
                }                
            }
            
        };                             
    };
        
    function pvt_setDataOnId(db,_store,_id, _data)
    {
        var objectStore     =       db.transaction([_store], "readwrite")
                                    .objectStore(_store);
                    
        var request         =       objectStore 
                                    .get(_id);
                      
        request.onerror = function(event) {
          // Handle errors!
          return false;
        };
        
        request.onsuccess = function(event) {
          // Get the old value that we want to update
          var data = request.result;

          // update the value(s) in the object that you want to change
          data = _data;

          // Put this updated object back into the database.
          var requestUpdate = objectStore.put(_data,_id);
           requestUpdate.onerror = function(event) {
             return false;
           };
           
           requestUpdate.onsuccess = function(event) {             
             return true;  
           };
           
        };        
    }
       
    return _db;   
});

//##############
//    USAGE
//##############
//
//  CREATE DATABASE
//
//      var testDb= db("Test_Database",1);
//
//  ADD DATASTORE
//
//      testDb.addStore("Test_Store")

