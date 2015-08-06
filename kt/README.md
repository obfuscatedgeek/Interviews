## * Inorder to run the app

1. Extract the zip attached.
2. On the terminal, navigate to the extracted folder
3. Run command npm install
4. Make sure you have MongoDB running, create a database kreditech.
5. Run the command ** *node server.js* **
5. On your browser, enter the url http://localhost:3000/

### * The best way to test the **ENDPOINT /markdown/save**
1. You will see a html page, enter your markdown content in the textarea under I/P Markdown Text
2.Submit and you will see the adjacent boxes fill up.
3. The JSON box will contain the necessary JSON as requested in the assignment.

### * The best way to test **ENDPOINT /markdown/get** navigate to url http://localhost:3000/markdown/get/{id}

Replace {id} in the aforementioned with a valid id. You will get the result JSON


## * Rules implemented
As requested this is the markdown parser created. The various rules it applies to parsing, as requested in the assignment are as follows

# H1 *With italics*
## H2
### H3
#### H4
##### H5
###### H6

Some really **Bold** Tags as well as *emphasized* ones, just to make sure ** *bolds can be emphasized* **

All this is made using [hapi.js](http://hapijs.com/), [NodeJS](https://nodejs.org) & uses [MongoDB](https://www.mongodb.org/) to store everything.