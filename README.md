# Google_Chatbot_Cards
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

#### Interactive cards
- A card mainly consists of:
  - Header with title, sub-title and an imageurl
  - Widgets with paragraph, images, and buttons

The code towards creating the final card is as below:
```
function createCardResponse_2(widgets) {
  return {
    cards: [{
      sections: [{
        widgets: widgets
      }]
    }]
  };
}
```
