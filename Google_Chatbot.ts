
/**
 * Chatbot for getting inputs from the chatbot user including attachments &
 * Store the entered data in an excel file &
 * Emailing the requisite data to the respective personnel
 */
 
/**
 * Create the header for the chabot interactive card
 * This will include the title, subtitle and image icon to be used
 */
var DEFAULT_IMAGE_URL = 'https://goo.gl/bMqzYS';
var HEADER = {
  header: {
    title : 'mU - mooOn',
    subtitle : 'Welcome to mooOn Service Request Bot',
    imageUrl : DEFAULT_IMAGE_URL
  }
};
 
/**
 * Create the card with requisite header and widgets - Style-1
 */
function createCardResponse(widgets) {
  return {
    cards: [HEADER, {
      sections: [{
        widgets: widgets
      }]
    }]
  };
}
 
/**
 * Create the card with requisite header and widgets - Style-2
 */
function createCardResponse_2(widgets) {
  return {
    cards: [{
      sections: [{
        widgets: widgets
      }]
    }]
  };
}
 
 
/**
 * Update the category column in the excel sheet
 */
function update_sr_cat(input) {
  
  wb = SpreadsheetApp.openById("1zAOgTSgqTz1hm58tOZvcHA7jm2Cbuy9F7nZAB23DaUM");
  lr = wb.getActiveSheet().getLastRow();
  lc = wb.getActiveSheet().getLastColumn();
  
  category_cell = wb.getActiveSheet().getRange(lr, 5);
  category_cell.setValue(input);
 
}
 
/**
 * Update the platform column in the excel sheet
 */
function update_sr_plat(input) {
  
  wb = SpreadsheetApp.openById("1zAOgTSgqTz1hm58tOZvcHA7jm2Cbuy9F7nZAB23DaUM");
  lr = wb.getActiveSheet().getLastRow();
  lc = wb.getActiveSheet().getLastColumn();
    
  platform_cell = wb.getActiveSheet().getRange(lr, 6);     
  platform_cell.setValue(input);
}
 
/**
 * Update the attachment status column in the excel sheet
 */
function upload_attach(input) {
  
  wb = SpreadsheetApp.openById("1zAOgTSgqTz1hm58tOZvcHA7jm2Cbuy9F7nZAB23DaUM");
  lr = wb.getActiveSheet().getLastRow();
  lc = wb.getActiveSheet().getLastColumn();
    
  image_cell = wb.getActiveSheet().getRange(lr, 8);     
  image_cell.setValue(input);
  if (input == "No") {
  image_link_cell = wb.getActiveSheet().getRange(lr, 10);    
  image_link_cell.setValue("NA");
 
  status_cell = wb.getActiveSheet().getRange(lr, 9);    
  status_cell.setValue("Pending");   
  }
}
 
/**
 * To be executed on invoking the chatbot with message
 */
function onMessage(event) {
  var name = event.user.displayName;
 
  // Get the user-name in appropriate style
  name = PROPER_CASE(name);
  var userMessage = event.message.text;
  var email = event.user.email;
  
  // Invoke the chatbot using SR command
  if (event.message.text.includes("@mU SR") || event.message.text.includes('SR')) {
    wb = SpreadsheetApp.openById("1zAOgTSgqTz1hm58tOZvcHA7jm2Cbuy9F7nZAB23DaUM");
    lr = wb.getActiveSheet().getLastRow();
    lc = wb.getActiveSheet().getLastColumn();
    
    status_cell = wb.getActiveSheet().getRange(lr, 9).getValue();
 
    // Check whether the last row is complete, if not complete overwrite the same
    if (status_cell != ""){
    lr = lr;
    lc = lc;
    } else {
      lr = lr-1;
      lc = lc-1;
    }
 
    // Write the timestamp value to the requisite cell
    timestamp_cell = wb.getActiveSheet().getRange(lr+1, 1);
    timestamp_cell.setValue(new Date()).setNumberFormat("dd-MM-yyyy hh:mm");
    
    // Get the last SR-id value, if this is the first entry, set it to zero
    if (lr > 1) {
    srrid_cell_hist = wb.getActiveSheet().getRange(lr, 2);
    srrid_cell = wb.getActiveSheet().getRange(lr+1, 2); 
    srrid_cell.setValue(srrid_cell_hist.getValue()+1).setNumberFormat("000000");
    } else {
    srrid_cell = wb.getActiveSheet().getRange(lr+1, 2); 
    srrid_cell.setValue(1).setNumberFormat("000000");
    }     
 
    // Write the user- name & email to the respective cells 
    user_cell = wb.getActiveSheet().getRange(lr+1, 3);
    user_cell.setValue(name);
      
    user_email = wb.getActiveSheet().getRange(lr+1, 4);
    user_email.setValue(email);
 
    /* Design the widget for welcome + category  
    * 2 buttons are created for better visibility in mobile view
    */
 
      var widgets_1 = [{
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
                /*
                parameters: [{
                  key: 'input',
                  value: input
                }]
                */
              }
            }
          }
        }, {
          textButton: {
            text: '(b) Issues',
            onClick: {
              action: {
                actionMethodName: 'issues',
                /*
                parameters: [{
                  key: 'input',
                  value: input
                }]
                */
              }
            }
          }
        }]
      },{
        buttons: [{
          textButton: {
            text: '(c) Correct Data',
            onClick: {
              action: {
                actionMethodName: 'data_change',
                /*
                parameters: [{
                  key: 'input',
                  value: input
                }]
                */
              }
            }
          }
        },{
          textButton: {
            text: '(d) Support',
            onClick: {
              action: {
                actionMethodName: 'support',
                /*
                parameters: [{
                  key: 'input',
                  value: input
                }]
                */
              }
            }
          }
        }]
      }];
    return createCardResponse(widgets_1);
 
 } 
 
 // Invoke when the user is about to enter the short note using the command SN
 else if (event.message.text.includes("@mU SN") || event.message.text.includes('SN')) {
     
      var description = userMessage.substring(userMessage.indexOf("SN")+3, userMessage.length)
      
      wb = SpreadsheetApp.openById("1zAOgTSgqTz1hm58tOZvcHA7jm2Cbuy9F7nZAB23DaUM");
      lr = wb.getActiveSheet().getLastRow();
      lc = wb.getActiveSheet().getLastColumn();
      
      srrid = wb.getActiveSheet().getRange(lr, 2).getValue().toString();
      platform = wb.getActiveSheet().getRange(lr, 6).getValue();
 
      /* Allow entry of short note only if the srrid and the platoform columns are already filled in  
      * Exceptional scenario: incomplete row till platoform from previous entry from another user
      * & User trying to enter directly the short note
      */
      if (srrid != "" && platform != ""){
      description_cell = wb.getActiveSheet().getRange(lr, 7);    
      description_cell.setValue(description);
      
      srrid = wb.getActiveSheet().getRange(lr, 2).getValue().toString();
      category = wb.getActiveSheet().getRange(lr, 5).getValue();
      platform = wb.getActiveSheet().getRange(lr, 6).getValue(); 
      image_attached = wb.getActiveSheet().getRange(lr, 8).getValue();
     
     // Design the card for updating the attachment status towards upload
      var widgets_3 = [{
        textParagraph: {
          text: 'Do you want to upload relevant attachments (pics, videos, pdfs)?'
        }
      }, {
        buttons: [{
          textButton: {
            text: '(a) Yes',
            onClick: {
              action: {
                actionMethodName: 'yes',
                /*
                parameters: [{
                  key: 'input',
                  value: input
                }]
                */
              }
            }
          }
        }, {
          textButton: {
            text: '(b) No',
            onClick: {
              action: {
                actionMethodName: 'no',
                /*
                parameters: [{
                  key: 'input',
                  value: input
                }]
                */
              }
            }
          }
        }]
      }];
 
    return createCardResponse_2(widgets_3);
    } else {
      message = "Please select the platform first!";
      return { text: message };
    }
 } 
 
 // Invoke when the user is about to upload the attachment using the command 'ATT'
 else if(event.message.text.includes("@mU ATT") || event.message.text.includes('ATT')) {
    wb = SpreadsheetApp.openById("1zAOgTSgqTz1hm58tOZvcHA7jm2Cbuy9F7nZAB23DaUM");
    lr = wb.getActiveSheet().getLastRow();
    lc = wb.getActiveSheet().getLastColumn();
      
    srrid = wb.getActiveSheet().getRange(lr, 2).getValue().toString();
    imag_stat = wb.getActiveSheet().getRange(lr, 8).getValue();
 
  /* Allow entry of short note only if the srrid and the platoform columns are already filled in  
  * Exceptional scenario: incomplete row till platoform from previous entry from another user
  * & User trying to enter directly the short note
  */
  if (srrid != "" && imag_stat != ""){
 
  // Get the attachment name
  var image_uploaded = event.message.attachment[0].name;
 
  // Extract the attachment
  var image_uploaded_attachment = getAttachment(image_uploaded);
 
  // Store the attachment in the requisite drive folder and get the filename
  output = getByteStream(image_uploaded_attachment.attachmentDataRef.resourceName, name);
 
  wb = SpreadsheetApp.openById("1zAOgTSgqTz1hm58tOZvcHA7jm2Cbuy9F7nZAB23DaUM");
  lr = wb.getActiveSheet().getLastRow();
  lc = wb.getActiveSheet().getLastColumn();
  
  srrid = wb.getActiveSheet().getRange(lr, 2).getValue().toString();
 
  files = DriveApp.getFolderById('1FGOsBXofYYcsJC0nqtIzHbfAslhLK-P2').getFilesByName(output);
 
  // Get the id of the saved attachment
  while (files.hasNext()) {
    var file = files.next();
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    image_file_id = file.getId();
  };
 
  // Generate the image link and store the value
  image_link = 'https://drive.google.com/file/d/'+image_file_id+'/view';
 
  image_link_cell = wb.getActiveSheet().getRange(lr, 10);    
  image_link_cell.setValue(image_link);  
 
  // Update the status cell
  status_cell = wb.getActiveSheet().getRange(lr, 9);    
  status_cell.setValue("Pending");    
 
  category = wb.getActiveSheet().getRange(lr, 5).getValue();
  platform = wb.getActiveSheet().getRange(lr, 6).getValue(); 
  description = wb.getActiveSheet().getRange(lr, 7).getValue();
 
  // Send email using requisite data
  recipients = email;
  subject = "mooOn SR Update: " + Utilities.formatString("%06d", srrid);
  body = "Hello "+name+",<br/>We have recieved your SR with the below details: <br/><br/><b>SR-ID</b>: "+Utilities.formatString("%06d", srrid)
  +"<br/><b>Category</b>: "+category+"<br/><b>Platform</b>: "+platform+"<br/><b>Description</b>: "
  +description+"<br/><b>Image Attachment</b>: Yes"+"<br/><b>Image Link</b>: "+image_link
  +"<br/><br/>If you have any further queries, please feel free to contact us.<br/><br/>Thanks & Regards,<br/>mooOn Support<br/>Mob: 81479 19971";
  MailApp.sendEmail({to: recipients, subject: subject, htmlBody: body});
 
 
  // Output requisite message
  return {text: "The uploaded image has been saved in the requisite Google Drive folder.\n\nThankyou for submitting the SR.\nThe SR has been created and your SR-Id is "+Utilities.formatString("%06d", srrid)+".Please keep this SR-Id for all future correspondence.\nThe SR details have been emailed to your registered email-id as well."};
 } else {
      message = "Please choose whether you want to attach image first!";
      return { text: message };
    } 
  } else {
   return {text: "Enter the correct code. Ex: @mU SR or @mU ATT"}
 }
}
 
// Function that gets invoked on clicking the card
function onCardClick(event) {
  console.log(event)
  var message = '';
  var option_1 = '';
  var value_1 = '';
  var option_2 = '';
  var value_2 = '';
  var option_3 = '';
  var value_3 = '';
 
  var name = event.user.displayName;
  name = PROPER_CASE(name);
  var email = event.user.email;
  // var input = event.action.parameters[0].value;
 
  wb = SpreadsheetApp.openById("1zAOgTSgqTz1hm58tOZvcHA7jm2Cbuy9F7nZAB23DaUM");
  lr = wb.getActiveSheet().getLastRow();
  lc = wb.getActiveSheet().getLastColumn();
  
  srrid = wb.getActiveSheet().getRange(lr, 2).getValue().toString();
  category = wb.getActiveSheet().getRange(lr, 5).getValue();
  description = wb.getActiveSheet().getRange(lr, 7).getValue();
  status_cell = wb.getActiveSheet().getRange(lr, 9).getValue();
  platform = wb.getActiveSheet().getRange(lr, 6).getValue(); 
 
  // Execute if the respective response is clicked on the card  
  if (event.action.actionMethodName === 'new_requirement') {
    // Check whether the card is clicked directly without typing in SR 
    if (status_cell == ""){
    option_1 = '(a) Portal';
    value_1 = 'mooon_portal';
    option_2 = '(b) App';
    value_2 = 'mooon_app';
    option_3 = '(c) Device';
    value_3 = 'mooon_device';
    message = "Category entered as 'New Requirement'";
    update_sr_cat("New Requirement");
    } else {
      message = "Please raise a fresh SR!";
      return { text: message };
    }   
  } else if (event.action.actionMethodName === 'issues') {
    // Check whether the card is clicked directly without typing in SR
    if (status_cell == ""){
    option_1 = '(a) Portal';
    value_1 = 'mooon_portal';
    option_2 = '(b) App';
    value_2 = 'mooon_app';
    option_3 = '(c) Device';
    value_3 = 'mooon_device';
    message = "Category entered as 'Issues'(Or Bugs)";
    update_sr_cat("Issues");
    } else {
      message = "Please raise a fresh SR!";
      return { text: message };
    }
  } else if (event.action.actionMethodName === 'data_change') {
    // Check whether the card is clicked directly without typing in SR
    if (status_cell == ""){
    message = "Category entered as 'Data Correction'\n\nPlease enter 'SN' followed by a short note on the raised SR.\nExample: 'SN Please change VLCC code from V0301 to VARE0301 for all entries'";
    update_sr_cat("Correct Data");
    update_sr_plat("NA");
    return { text: message };
    } else {
      message = "Please raise a fresh SR!";
      return { text: message };
    }
  } else if (event.action.actionMethodName === 'support') {
    // Check whether the card is clicked directly without typing in SR
    if (status_cell == ""){
    message = "Category entered as 'Support'\n\nPlease enter 'SN' followed by a short note on the raised SR.\nExample: 'SN Please created the mooOn login for new joined FITC Mr.X'";
    update_sr_cat("Support");
    update_sr_plat("NA");
    return { text: message };
    } else {
      message = "Please raise a fresh SR!";
      return { text: message };
    }
  } else if (event.action.actionMethodName === 'mooon_portal') {
    // Check whether the card is clicked directly without typing in SR
    if (srrid != "" && category != "" && status_cell == ""){      
    message = "Platform selected as 'Portal'\n\nPlease enter 'SN' followed by a short note on the raised SR.\nExample: 'SN Not able to see cattle details in mooOn portal'";
    update_sr_plat("mooOn Portal");
    return { text: message };} else {
      message = "Please select the category first!";
      return { text: message };
    }
  } else if (event.action.actionMethodName === 'mooon_app') {
    // Check whether the card is clicked directly without typing in SR
    if (srrid != "" && category != "" && status_cell == ""){   
    message = "Platform selected as 'App'\n\nPlease enter 'SN' followed by a short note on the raised SR.\nExample: 'SN Not able to capture cattle pic in mooOn app'";
    update_sr_plat("mooOn App");
    return { text: message };} else {
      message = "Please select the category first!";
      return { text: message };
    }
  } else if (event.action.actionMethodName === 'mooon_device') {
    // Check whether the card is clicked directly without typing in SR
    if (srrid != "" && category != "" && status_cell == ""){
    message = "Platform selected as 'Device'\n\nPlease enter 'SN' followed by a short note on the raised SR.\nExample: 'SN Not able to get SMS for farmer V00100015'";
    update_sr_plat("mooOn Device");
    return { text: message };} else {
      message = "Please select the category first!";
      return { text: message };
    }
  } else if (event.action.actionMethodName === 'yes') {
    // Check whether the card is clicked directly without typing in SR
    if (srrid != "" && description != "" && status_cell == ""){ 
    message = "You selected 'Yes'; please upload the pic after typing ATT.\nEx:ATT <select the pic to be uploaded>";
    upload_attach("Yes");
    return { text: message };} else {
      message = "Please add short note first!";
      return { text: message };
    }
  } else if (event.action.actionMethodName === 'no') {
    // Check whether the card is clicked directly without typing in SR
    if (srrid != "" && description != "" && status_cell == ""){ 
    message = "You selected 'No'.\n\nThankyou for submitting the SR.\nThe SR has been created and your SR-Id is "+Utilities.formatString("%06d", srrid)+".Please keep this SR-Id for all future correspondence.\nThe SR details have been emailed to your registered email-id as well.";
    upload_attach("No");
  
  recipients = email;
  subject = "mooOn SR Update: " + Utilities.formatString("%06d", srrid);
  body = "Hello "+name+",<br/>We have recieved your SR with the below details: <br/><br/><b>SR-ID</b>: "+Utilities.formatString("%06d", srrid)
  +"<br/><b>Category</b>: "+category+"<br/><b>Platform</b>: "+platform+"<br/><b>Description</b>: "
  +description+"<br/><b>Image Attachment</b>: No"+"<br/><b>Image Link</b>: NA"
  +"<br/><br/>If you have any further queries, please feel free to contact us.<br/><br/>Thanks & Regards,<br/>mooOn Support<br/>Mob: 81479 19971";
  MailApp.sendEmail({to: recipients, subject: subject, htmlBody: body});
  
  return { text: message };} else {
      message = "Please add short note first!";
      return { text: message };
    }
  } else {
    message = "I'm sorry; I'm not sure which button you clicked.";
    return { text: message };
  }
  
  // Design wedget 2 for entering category option
    var widgets_2 = [{
        textParagraph: {
          text: message+'<br>Please choose the requisite option:'
        }
      }, {
        buttons: [{
          textButton: {
            text: '(a) Portal',
            onClick: {
              action: {
                actionMethodName: 'mooon_portal',
                /*
                parameters: [{
                  key: 'input',
                  value: input
                }]
                */
              }
            }
          }
        }, {
          textButton: {
            text: '(b) App',
            onClick: {
              action: {
                actionMethodName: 'mooon_app',
                /*
                parameters: [{
                  key: 'input',
                  value: input
                }]
                */
              }
            }
          }
        }, {
          textButton: {
            text: '(c) Device',
            onClick: {
              action: {
                actionMethodName: 'mooon_device',
                /*
                parameters: [{
                  key: 'input',
                  value: input
                }]
                */
              }
            }
          }
        }]
      }];
  
  return createCardResponse_2(widgets_2);
}
 
// Saving private key and client email
var PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\nUAIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCnBRbLUjPIZDiZ\nFxhRC1UDk4mzGnwOJYick9NzmYZgHk68gAthdMv6466Qga+9DWzMQBI8vgfnnVXY\n1LgN9vJhhZEMol8BVoOmoupWcNxS0rTCN5YYb5Jf8KIbkgM54vtw8sa3w6/R7TwN\nKSC5/W/qxwAbMStiF+fmzFQWS6iWSx5eToSKhMytrLaf6Fask5r/nzPk1UAZiU5k\ncyvYHrGb2YvCs1B1/icPcBIiA1hxpTro9laZrbEpsX6btwRA6TFBNrlR/tyOQZlc\nH5mzewpO5EUPZV9bdbMBoIWwmfJ1BqBesOygUG5tP/ntQYFUmi/elrPBWqC4DfGG\neq8QuNJTAgMBAAECggEADEifiIyfKlnUn83HCA7jqEOtmPKVtSSli36Dyri73U3d\nVJfGPoCsj+M274HaPvlByzPbI4SGaE52BeB/OOe0o9+C737xpdOLEzJgMcNTMPQ2\nPyJ/c4ShK1UzVvvCKPu8qm3wl4tY3wOnqwd6JNla5dWE+HsBSdGgSKU2ef1OhN8b\nDSbpyyuZRn+orAdICBVKe7ZHOFTZ+W9KXEIiyklygKjHou87topj6FrzKiBKml/T\ntmoAyEib190alNYUbtOtClJr8GDqfdRgeAZf0c8DOfJzaDePYWj1EODQgC22w+/k\nlBuM11MfUsRv9b2wV3jaQKCaoTPRv7k5y6CjsjusgQKBgQDSMJY54+LAX1dInYFK\nWTak779iZm5e+AYPJmaSwL4X1ih4IvzpCq0UQQw02yWSemlT8c9qkW5XRabdthLk\nr+KdVxue68M/e9o9pTZG9XFcgJ5ungteBxaOHBQX05LQSScMigUvceyHl1JN9ty3\nA0p7ihMKC5ivdZYLJcO0viNSUQKBgQDLa9zmhL5HrhkjdOogHffpeWuqeiYsN1Ph\nygazMzIIGIgO9xa2/jgWRaJQgHf4z81RftC18u3DqjSQORkdZNSo1zoAHpep4qm7\ngdxfRF33Qwe7G5PP/XZhxZTalYcVVjjHPkAwma2xaSrspLnfE2zuP/ey9jY1DgxS\nCzHPDmvtYwKBgGRSLGAkm+WVm+Ncycjiq+ItS/t7SFUrrrisa2i/9fsKjGZKzMut\n/M4d/enIHza6lmsqjwUeRLwC0pIfxQTBrjfKy7QecyJpytCBelaD74dnHDdP170Z\nZPqvDCgTI4+mWqzxc2ghx/Mvlmj/2ni/aV1tmYjB4C5ewS6w56fs2I8BAoGARdgl\nIqkVRDtMulXcRWbExk9AXmpOTQQ6Mt5Q6pp7ZTg3Dxxbmj0zOMJz9rwFdVK0JnUq\naC6e4H3CSnqwWt1R/x7W9U+Lt3Lx4EW4SqWItes37lCLsfBPA0b50wtgND1EhXSk\nSYuajb2UVWhBwYxD7JHeFH5hIlpOdKUPVw6WlA0CgYATrK+VVcNaLXrIuzXyXc/m\nbznVS2mg7WZM/yUzo6CT4Pq96y1P+6oz/XnGQYhR979QuOlbDC3Xmmlamkd7pLhN\nX4BYVK6nzAufJFtGoo41brWmMsQGHBERF/4FsgYNf4XkSvPQOJVN750uXRYc8A5o\nadxQkXRHv9ikdPNlMQEiZW==\n-----END PRIVATE KEY-----\n';
var CLIENT_EMAIL = 'krapht-zanctur-913439@appspot.gserviceaccount.com';
 
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
 
  wb = SpreadsheetApp.openById("1zAOgTSgqTz1hm58tOZvcHA7jm2Cbuy9F7nZAB23DaUM");
  lr = wb.getActiveSheet().getLastRow();
  lc = wb.getActiveSheet().getLastColumn();
 
  srrid = wb.getActiveSheet().getRange(lr, 2).getValue();   
 
 // Storing to requisite folder and returning the filename
 blob = response.getBlob();
 driveFileName = DriveApp.getFolderById('1BGOsAXofZZcsJC0nqtIzHbfBslhLK-P9').createFile(blob).setName('SR_'+srrid+'-'+username);
 return driveFileName;
}
 
/**
 * Convert a string to Proper case.
 
 * @param {string} str The string value to be converted.
 * @return The string value in Proper case.
 * @customfunction
*/
function PROPER_CASE(str) {
  if (typeof str != "string")
    throw `Expected string but got a ${typeof str} value.`;
  
  str = str.toLowerCase();
 
  var arr = str.split(" ");
 
  return arr.reduce(function(val, current) {
    return val += (current.charAt(0).toUpperCase() + current.slice(1))+" ";
  }, "");
}
 
function onAddToSpace(event) {
  var message = "";
 
  if (event.space.singleUserBotDm) {
    message = "Thank you for adding me to a DM, " + event.user.displayName + "!";
  } else {
    message = "Thank you for adding me to " +
        (event.space.displayName ? event.space.displayName : "this chat");
  }
 
  if (event.message) {
    // Bot added through @mention.
    message = message + " and you said: \"" + event.message.text + "\"";
  }
 
  return { "text": message };
}
 
function onRemoveFromSpace(event) {
  console.info("Bot removed from ",
      (event.space.name ? event.space.name : "this chat"));
}
