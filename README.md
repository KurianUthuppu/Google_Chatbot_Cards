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
```
