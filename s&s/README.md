I have implemented both the methods,
1. Interaction with array in memory
2. Data in a file system

All the code for operation on array in memory is in box.js
All the code for write file system is in boxes.js

To run the code
1. Extract the code
2. On the terminal navigate to the extracted folder & execute the command "node server.js" and the application will start.

The application can be best tested using the Postman extension for Chrome. 

## 1: END POINTS for array in memory method
GET /box 
Returns all the items in the array

GET /box?id=1
Parameter(optional):
id: number
Return the specific item from the array

POST /box
Parameters expected while doing a POST: 
customerName: 'Name of Customer'
address: 'Address of user'
items: 'Item 1 / Item 2'

Adds another item to the array.

DELETE /box?id=1
Deletes the specific item from the array.


GET /find?sort=fieldName&sortDirection=A
Parameters:
sort = (id || createdAt || customerName || address || items)
sortDirection = (A || D)



## 2: END POINTS for file system method
GET /boxes 
Returns all the items in the array

GET /boxes?id=1
Parameter(optional):
id: number
Returns the specific item from the array

POST /boxes
Parameters expected while doing a POST: 
customerName: 'Name of Customer'
address: 'Address of user'
items: 'Item 1 / Item 2'

Adds another item to the array.

DELETE /boxes?id=1
Deletes the specific item from the array.


GET /findBoxes?sort=fieldName&sortDirection=A
Parameters:
sort = (id || createdAt || customerName || address || items)
sortDirection = (A || D)