# idxf

idxf ( which stands for IndexedDb  Facade) is a small javascript library that is aimed at providing an easy-to-use interface
to the indexedDb API

## Install

idxf is written in pure javascript and does not depend on any 3rd party libraries.
Just include following code into the `<head>` tag of your HTML:

```html
<!-- include db.js-->
<script src="db.js"></script>
```

## API

`Create` a database.
```javascript
var newdb = db("database_name", database_version:int );
```

`Add` a store.
```javascript
newdb.addStore("store_name");
-or-
newdb.addStore(["store_name_1","store_name_2"...]);
```
NB: The add store routine can only be called once per browser load.

`Add` data to a store.
```javascript
newdb.addData("store_name", data:object );
```
