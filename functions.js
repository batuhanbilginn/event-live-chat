 function banUser(self) {
// Get user ID
var userId = self.getAttribute("data-id");
// Ban user
database.ref("users/" + userId).update({

	ban: false,

})

}

    function listQuestion(self) {
// Get question ID
var questionId = self.getAttribute("data-id");
// Add to list
database.ref("questions/" + questionId).update({

	listed: true,

})

}

    function unlistQuestion(self) {
// Get question ID
var questionId = self.getAttribute("data-id");
// Remove from list
database.ref("questions/" + questionId).update({

	listed: false,

})

}
	
 function deleteMessage(self) {
    // Get message ID
    var messageId = self.getAttribute("data-id");
    // Delete message
    database.ref("chats/" + messageId).remove();
}

function deleteQuestion(self) {
    // Get question ID
    var questionId = self.getAttribute("data-id");
    // Delete question
    database.ref("questions/" + questionId).remove();
}
