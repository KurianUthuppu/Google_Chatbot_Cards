# Google_Chatbot_Cards (Work-In-Progress)
Interacting via interactive cards in google chat and integrating with google sheets, gmail via app-script

### Requirements
* Valid Google account
* Browser - Chrome / Firefox

### Resources
- Google chat login - https://mail.google.com/chat/u/1/#chat/welcome  
- Big-Query/GCP platform login - https://cloud.google.com/?authuser=1  
- Google scripts - https://script.google.com/u/1/home/start  
- Oauth2 library - https://github.com/googleworkspace/apps-script-oauth2.git
- Useful docs (Chatbot) - https://developers.google.com/chat/api/guides/message-formats/events
                        - https://developers.google.com/chat/how-tos/get-attachment?hl=en
                        - https://developers.google.com/chat/how-tos/cards-onclick

### Setup
- Setup your project in GCP and link it to appropriate billing account
- Create a new project in Apps script and then create a new script file
  Give appropriate name to the project and the file

### Chatbot code
#### Editing appscript json
- Modify the code in appsscript.json tab with the highlighted code in the box below:
```
{
  "timeZone": "Asia/Kolkata",
  "dependencies": {
    "enabledAdvancedServices": [
      {
        "userSymbol": "Drive",
        "serviceId": "drive",
        "version": "v2"
      }
    ],
    "libraries": [
      {
        "userSymbol": "OAuth2",
        "version": "41",
        "libraryId": "1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF"
      }
    ]
  },
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "chat": {}
}
```
#### Adding OAuth2 library to apps script
- Click on the '+' button next to the libraries on the left pane
- Copy paste '1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF' in the script-id box and click look up
- Apps script will fetch the version no. (which is 41 at the time of this writing) and identifier
- Click add and you will see that the library is added on the left pane

#### The main functions in the code
- As discussed in my earlier project -> https://github.com/KurianUthuppu/Google_Chatbot.git:
  - The basic functions include:
     a) function onAddToSpace(event) {}
        - Gets invoked when the chatbot is added to a space
     b) function onRemoveFromSpace(event) {}
        - Gets invoked when the chatbot is removed from a space
     c) function onMessage(event) {}
        - Gets invoked when the user types in a message
     d) function onCardClick(event) {}
        - Gets invoked when the user clicks a widget (button, image) on the interactive card

#### Creating Interactive cards
- A card mainly consists of:
  - Header with title, sub-title and an imageurl
  - Widgets with paragraph, images, and buttons

The code towards creating the final card is as below:
```
function createCardResponse(widgets) {
  return {
    cards: [HEADER, {
      sections: [{
        widgets: widgets
      }]
    }]
  };
}
```
Header style could be defined, designed as below:
```
var DEFAULT_IMAGE_URL = 'https://goo.gl/bMqzYS';
var HEADER = {
  header: {
    title : 'mU ChatBot',
    subtitle : 'Welcome to mooOn ChatBot',
    imageUrl : DEFAULT_IMAGE_URL
  }
};
```
Widgets could be defined, designed in the onMessage event function as below;  
The below code creates 2 buttons namely - '(a) New Requirement' & '(b) Issues'
```
function onMessage(event) {
var widgets = [{
        textParagraph: {
          text: 'Hello ' + name + ',<br/>Please choose the category:'
        }
      }, {
        buttons: [{
          textButton: {
            text: '(a) New Requirement',
            onClick: {
              action: {
                actionMethodName: 'new_requirement',
              }
            }
          }
        }, {
          textButton: {
            text: '(b) Issues',
            onClick: {
              action: {
                actionMethodName: 'issues',
              }
            }
          }
        }]
      }];
    return createCardResponse(widgets);
 } 

```
#### Card Response
Sample code for a card-response is given below:
```
function onCardClick(event) {
  var message = '';
  if (event.action.actionMethodName === 'new_requirement') {
  return { text: "Category entered as 'New Requirement'" };
  } else if (event.action.actionMethodName === 'issues') {
  return { text: "Category entered as 'Issues'" };
  }
```
#### Writing values to an excel sheet
- Here the excel sheet is to be identified by it's id
- You can the id of the sheet from the webaddress when you are viewin the same
  - It will be between https://docs.google.com/spreadsheets/d/ & /edit#gid=0
  - An example is shown below for your reference; in this the sheet's id is __1zAOgTSgqTz1hm58tOZvcHA7jm2Cbuy9F7nZAB23DaUM__
```
https://docs.google.com/spreadsheets/d/1zAOgTSgqTz1hm58tOZvcHA7jm2Cbuy9F7nZAB23DaUM/edit#gid=0
```
- One can access the excel sheet and get the last row and column using code below
- The last row and last column value (that contains values) will be stored in the variables lr & lc
- Note: In case there are no values stored in the sheet, both lr & lc will contain value 1
```
wb = SpreadsheetApp.openById("1zAOgTSgqTz1hm58tOZvcHA7jm2Cbuy9F7nZAB23DaUM");
lr = wb.getActiveSheet().getLastRow();
lc = wb.getActiveSheet().getLastColumn();
```
- One can get and set the values of/to a particular cell using the below code
```
// Getting value
value_cell = wb.getActiveSheet().getRange(lr, 9).getValue();

// Setting value
user_cell = wb.getActiveSheet().getRange(lr+1, 3);
user_cell.setValue(name);

// Setting value with formatting
userid_cell = wb.getActiveSheet().getRange(lr+1, 2); 
userid_cell.setValue(1).setNumberFormat("000000");
```
#### Sending email using app script
- Emails could be sent by invoking MailApp
- Example code is given below:
```
var name = event.user.displayName;
var email = event.user.email;

recipients = email;
subject = "Test Email";
body = "Hello "+name+",<br/>This is a test email !.<br/><br/>Thanks & Regards,<br/>Customer-Care";
MailApp.sendEmail({to: recipients, subject: subject, htmlBody: body});
```
#### Converting name to proper case
- The following function will convert strings such as names to proper format
- For example if the input is 'KURIAN UTHPUPU', then the output would be 'Kurian Uthuppu'
- Sample code shown below:
```
function PROPER_CASE(str) {
  if (typeof str != "string")
    throw `Expected string but got a ${typeof str} value.`;
  
  str = str.toLowerCase();

  var arr = str.split(" ");

  return arr.reduce(function(val, current) {
    return val += (current.charAt(0).toUpperCase() + current.slice(1))+" ";
  }, "");
}
```
#### Getting an attachment and storing in google drive

```
// Get the attachment name
var image_uploaded = event.message.attachment[0].name;

// Extract the attachment
var image_uploaded_attachment = getAttachment(image_uploaded);

// Store the attachment in the requisite drive folder and get the filename
output = getByteStream(image_uploaded_attachment.attachmentDataRef.resourceName, name);
```
##### Getting private key and client-id
- One needs to get the private key and client-id to access the data from the rest-api

```
var PRIVATE_KEY =
    '-----BEGIN PRIVATE KEY-----\nUAIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCnBRbLUjPIZDiZ\nFxhRC1UDk4mzGnwOJYick9NzmYZgHk68gAthdMv6466Qga+9DWzMQBI8vgfnnVXY\n1LgN9vJhhZEMol8BVoOmoupWcNxS0rTCN5YYb5Jf8KIbkgM54vtw8sa3w6/R7TwN\nKSC5/W/qxwAbMStiF+fmzFQWS6iWSx5eToSKhMytrLaf6Fask5r/nzPk1UAZiU5k\ncyvYHrGb2YvCs1B1/icPcBIiA1hxpTro9laZrbEpsX6btwRA6TFBNrlR/tyOQZlc\nH5mzewpO5EUPZV9bdbMBoIWwmfJ1BqBesOygUG5tP/ntQYFUmi/elrPBWqC4DfGG\neq8QuNJTAgMBAAECggEADEifiIyfKlnUn83HCA7jqEOtmPKVtSSli36Dyri73U3d\nVJfGPoCsj+M274HaPvlByzPbI4SGaE52BeB/OOe0o9+C737xpdOLEzJgMcNTMPQ2\nPyJ/c4ShK1UzVvvCKPu8qm3wl4tY3wOnqwd6JNla5dWE+HsBSdGgSKU2ef1OhN8b\nDSbpyyuZRn+orAdICBVKe7ZHOFTZ+W9KXEIiyklygKjHou87topj6FrzKiBKml/T\ntmoAyEib190alNYUbtOtClJr8GDqfdRgeAZf0c8DOfJzaDePYWj1EODQgC22w+/k\nlBuM11MfUsRv9b2wV3jaQKCaoTPRv7k5y6CjsjusgQKBgQDSMJY54+LAX1dInYFK\nWTak779iZm5e+AYPJmaSwL4X1ih4IvzpCq0UQQw02yWSemlT8c9qkW5XRabdthLk\nr+KdVxue68M/e9o9pTZG9XFcgJ5ungteBxaOHBQX05LQSScMigUvceyHl1JN9ty3\nA0p7ihMKC5ivdZYLJcO0viNSUQKBgQDLa9zmhL5HrhkjdOogHffpeWuqeiYsN1Ph\nygazMzIIGIgO9xa2/jgWRaJQgHf4z81RftC18u3DqjSQORkdZNSo1zoAHpep4qm7\ngdxfRF33Qwe7G5PP/XZhxZTalYcVVjjHPkAwma2xaSrspLnfE2zuP/ey9jY1DgxS\nCzHPDmvtYwKBgGRSLGAkm+WVm+Ncycjiq+ItS/t7SFUrrrisa2i/9fsKjGZKzMut\n/M4d/enIHza6lmsqjwUeRLwC0pIfxQTBrjfKy7QecyJpytCBelaD74dnHDdP170Z\nZPqvDCgTI4+mWqzxc2ghx/Mvlmj/2ni/aV1tmYjB4C5ewS6w56fs2I8BAoGARdgl\nIqkVRDtMulXcRWbExk9AXmpOTQQ6Mt5Q6pp7ZTg3Dxxbmj0zOMJz9rwFdVK0JnUq\naC6e4H3CSnqwWt1R/x7W9U+Lt3Lx4EW4SqWItes37lCLsfBPA0b50wtgND1EhXSk\nSYuajb2UVWhBwYxD7JHeFH5hIlpOdKUPVw6WlA0CgYATrK+VVcNaLXrIuzXyXc/m\nbznVS2mg7WZM/yUzo6CT4Pq96y1P+6oz/XnGQYhR979QuOlbDC3Xmmlamkd7pLhN\nX4BYVK6nzAufJFtGoo41brWmMsQGHBERF/4FsgYNf4XkSvPQOJVN750uXRYc8A5o\nadxQkXRHv9ikdPNlMQEiZW==\n-----END PRIVATE KEY-----\n';
var CLIENT_EMAIL = 'krapht-zanctur-913439@appspot.gserviceaccount.com';
```
PS: Don't worry, I am not that dump to give you my actual private key and client-id :wink:  
    The above are just samples
##### getAttachment(image_uploaded)
```
/**
 * Authorize the user
 */
function getOAuth2Service() {
  return OAuth2.createService('MyChatBot')
      // Set the endpoint URL.
      .setTokenUrl('https://oauth2.googleapis.com/token')

      // Set the private key and issuer.
      .setPrivateKey(PRIVATE_KEY)
      .setIssuer(CLIENT_EMAIL)

      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getScriptProperties())

      // Set the scope.
      .setScope('https://www.googleapis.com/auth/chat.bot');
}

/**
 * Gets message attachment and returns it
 */
function getAttachment(attachmentName) {
  var attachment = {};
  var url = "https://chat.googleapis.com/v1/" + attachmentName;

  var service = getOAuth2Service(); 
  
  var response = UrlFetchApp.fetch(url, {
    method: 'get',
    headers: {
      'Authorization': 'Bearer ' + service.getAccessToken()
    },
    muteHttpExceptions:true,
  });

  if(response.getResponseCode() != 200){
    return "Failed to get attachment with error code: " + response.getResponseCode();
  }
  attachment = JSON.parse(response)
  return attachment;
}
```
##### getByteStream(image_uploaded_attachment.attachmentDataRef.resourceName, name)
```

/**
 * Calls Media api to read data. dataRef is the reference to the uploaded
 * file to be read, found in the attachment.
 */
function getByteStream(dataRef, username) {
 var blob = "";
 var driveFileName = "";
 var url = "https://chat.googleapis.com/v1/media/"+ dataRef +"?alt=media"

 var service = getOAuth2Service();
 var response = UrlFetchApp.fetch(url, {
   headers: {
     'Authorization': 'Bearer ' + service.getAccessToken(),
   },
   'muteHttpExceptions': true,
 });

 if(response.getResponseCode() != 200){
   return "Failed to get file content with error code: " + response.getResponseCode();
 }
 
  wb = SpreadsheetApp.openById("1wAOgTMgqTz1hm35tOZvcHA7jm2Cbuy9F7nZAB91DaUM");
  lr = wb.getActiveSheet().getLastRow();
  lc = wb.getActiveSheet().getLastColumn();

  srrid = wb.getActiveSheet().getRange(lr, 2).getValue();   
 
 // Storing to requisite folder and returning the filename
 blob = response.getBlob();
 driveFileName = DriveApp.getFolderById('1FGOsBXofYYcsJC0nqtIzHbfAslhLK-P2').createFile(blob).setName('SR_'+srrid+'-'+username);
 return driveFileName;
}
```
#### Getting private key and client-id
- Go to https://console.cloud.google.com/ and login with your user-id and password
- Go to IAM & Admin > Service Accounts
- Select the associated project (chatbot) service account
- Go to the section keys and then click 'Add Key' > Create new key 
- Private key will be generated and you could save them to the local disk 
- Copy the private key which which begins like "-----BEGIN PRIVATE KEY-----\nMI and ends like v3U=\n-----END PRIVATE KEY-----\n"
- Copy the client_email as well 
- Store the above two to the variables PRIVATE_KEY & CLIENT_EMAIL (and yes, please don't share the same with anyone :wink:)

The full code has been uploaded to this folder under the filename Google_Chatbot.ts.  
You could also view the relevant pics as well that have been uploaded to this folder.
