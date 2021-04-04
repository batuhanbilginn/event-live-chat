MemberStack.onReady.then(function (member) {

    var user = {
        id: member["id"],
        firstName: member["first-name"],
        lastName: member["last-name"],
        email: member["email"],
        city: member["city"],
        title: member["title"],
        type: member["member-type"]
    };
	
	if(user.city){} else { user.city = ""};
	if(user.title){} else { user.title = ""};
    
    // Joining Chat Function

    $('#joinChat').click(function joinChat() {

        var users = database.ref().child('users');
        users.child(user.id).get().then(function (snapshot) {
            var userData = snapshot.val()
            if (snapshot.exists()) {

                var bannedStatus = userData.ban

                if (bannedStatus) {
                    $(".embed-live-start-chat-block").hide();
                    loadChat();
                    loadPeople();
                    loadQuestion();
                } else {
                    toastr.error('Eğer bir hata olduğunu düşünüyorsanız aşağıdaki canlı yardımdan destek alabilirsiniz.', 'Sohbete erişiminiz kısıtlanmış.')
                }
            } else {
                database.ref("users/" + user.id).set({
                    username: user.firstName + ' ' + user.lastName,
                    userid: user.id,
                    usercity: user.city,
                    usertitle: user.title,
                    type: user.type,
                    ban: true,
                    number: 1
                });
                $(".embed-live-start-chat-block").hide();

                loadChat();
                loadPeople();
                loadQuestion();

            }
        }).catch(function (error) {
            console.error(error);
        });




    });

// Loading Chat Function
    function loadChat() {
        var query = database.ref("chats");
        query.on('value', function (snapshot) {
            $("#live-chat-message-area").html("");
            snapshot.forEach(function (childSnapshot) {
                var data = childSnapshot.val();
                if (user.type == 'Mod') {
                    // Mod View
                    if (data.senderid == user.id) {
                        //Current Mod Message
                        var loadedMessage = `<div data-id="` + data.messageid + `" class="event-live-chat-message-box"><div class="event-live-chat-message-sender-container"><div class="event-live-chat-message-sender-wrapper"><div class="message-sender-text">` + data.sender + `</div><div class="message-sender-tag moderator"><div>MODERATÖR</div><div class="message-sender-icn"></div></div></div><div class="message-sender-city">` + data.sendercity + ` - ` + data.sendertitle + `</div></div><div class="message-container"><div id="message-` + data.messageid + `">` + data.message + `</div></div><div class="message-functional-container"><div data-id="` + data.messageid + `" onclick="deleteMessage(this);" class="message-functional-text">Mesajı&nbsp;Sil</div><div class="message-date-text">` + data.date + `</div></div></div>`;
                        $("#live-chat-message-area").append(loadedMessage);
                    } else {
                        //Other Message
                        var loadedMessage = `<div data-id="` + data.messageid + `" class="event-live-chat-message-box"><div class="event-live-chat-message-sender-container"><div class="event-live-chat-message-sender-wrapper"><div class="message-sender-text">` + data.sender + `</div></div><div class="message-sender-city">` + data.sendercity + ` - ` + data.sendertitle + `</div></div><div class="message-container"><div id="message-` + data.messageid + `">` + data.message + `</div></div><div class="message-functional-container"><div data-id="` + data.senderid + `"  onclick="banUser(this);" class="message-functional-text red">Kullanıcıyı Yasakla</div><div data-id="` + data.messageid + `" onclick="deleteMessage(this);" class="message-functional-text">Mesajı&nbsp;Sil</div><div class="message-date-text">` + data.date + `</div></div></div>`;
                        $("#live-chat-message-area").append(loadedMessage);
                    }

                } else {
                    // Regular View
                    if (data.senderid == user.id) {
                        //Current User Message
                        var loadedMessage = `<div data-id="` + data.messageid + `" class="event-live-chat-message-box"><div class="event-live-chat-message-sender-container"><div class="event-live-chat-message-sender-wrapper"><div class="message-sender-text">` + data.sender + `</div><div class="message-sender-tag current-member"><div>SEN</div></div></div><div class="message-sender-city">` + data.sendercity + ` - ` + data.sendertitle + `</div></div><div class="message-container"><div id="message-` + data.messageid + `" >` + data.message + `</div></div><div class="message-functional-container"><div data-id="` + data.messageid + `" onclick="deleteMessage(this);" class="message-functional-text">Mesajı&nbsp;Sil</div><div class="message-date-text">` + data.date + `</div></div></div>`;
                        $("#live-chat-message-area").append(loadedMessage);
                    } else if (data.sendertype == 'Mod') {
                        //Mod Message
                        var loadedMessage = `<div data-id="` + data.messageid + `" class="event-live-chat-message-box"><div class="event-live-chat-message-sender-container"><div class="event-live-chat-message-sender-wrapper"><div class="message-sender-text">` + data.sender + `</div><div class="message-sender-tag moderator"><div>MODERATÖR</div><div class="message-sender-icn"></div></div></div><div class="message-sender-city">` + data.sendercity + ` - ` + data.sendertitle + `</div></div><div class="message-container"><div id="message-` + data.messageid + `">` + data.message + `</div></div><div class="message-functional-container"><div class="message-date-text">` + data.date + `</div></div></div>`;
                        $("#live-chat-message-area").append(loadedMessage);
                    } else {
                        //Other Message
                        var loadedMessage = `<div data-id="` + data.messageid + `" class="event-live-chat-message-box"><div class="event-live-chat-message-sender-container"><div class="event-live-chat-message-sender-wrapper"><div class="message-sender-text">` + data.sender + `</div></div><div class="message-sender-city">` + data.sendercity + ` - ` + data.sendertitle + `</div></div><div class="message-container"><div id="message-` + data.messageid + `">` + data.message + `</div></div><div class="message-functional-container"><div class="message-date-text">` + data.date + `</div></div></div>`;
                        $("#live-chat-message-area").append(loadedMessage);
                    }

                }

                $("#live-chat-message-area").scrollTop($('#live-chat-message-area')[0].scrollHeight - $('#live-chat-message-area')[0].clientHeight);
            });

        });
    }


// Loading People Function
    function loadPeople() {
        var query = database.ref("users").orderByChild('number');
        query.on('value', function (snapshot) {
            $("#live-chat-people-area").html("");
            var userNumber = 0
            snapshot.forEach(function (childSnapshot) {
                var data = childSnapshot.val();
                userNumber = userNumber + 1
                if (user.type == 'Mod') {
                    // Mod View
                    if (data.userid == user.id) {
                        //Current Mod
                        var loadedPeople = `<div class="event-live-chat-people-box"><div class="event-live-chat-pp-container mod"><div>` + data.username.slice(0, 2) + `</div></div><div class="event-live-chat-message-sender-container"><div class="event-live-chat-message-sender-wrapper"><div class="message-sender-text">` + data.username + `</div><div class="message-sender-tag moderator"><div>MOD</div><div class="message-sender-icn"></div></div></div><div class="message-sender-city">` + data.usercity + ` - ` + data.usertitle + `</div></div></div>`;
                        $("#live-chat-people-area").append(loadedPeople);
                    } else if (data.type == 'Mod') {
                    var loadedPeople = `<div class="event-live-chat-people-box"><div class="event-live-chat-pp-container mod"><div>` + data.username.slice(0, 2) + `</div></div><div class="event-live-chat-message-sender-container"><div class="event-live-chat-message-sender-wrapper"><div class="message-sender-text">` + data.username + `</div><div class="message-sender-tag moderator"><div>MOD</div><div class="message-sender-icn"></div></div></div><div class="message-sender-city">` + data.usercity + ` - ` + data.usertitle + `</div></div></div>`;
                        $("#live-chat-people-area").append(loadedPeople);
                   
                    } else {
                        //Others
                        var loadedPeople = `<div class="event-live-chat-people-box"><div class="event-live-chat-pp-container"><div>` + data.username.slice(0, 2) + `</div></div><div class="event-live-chat-message-sender-container"><div class="event-live-chat-message-sender-wrapper"><div class="message-sender-text">` + data.username + `</div></div><div class="message-sender-city">` + data.usercity + ` - ` + data.usertitle + `</div></div><div data-id="` + data.userid + `"  onclick="banUser(this);" class="message-functional-text red">Yasakla</div></div>`;
                        $("#live-chat-people-area").append(loadedPeople);
                    }

                } else {
                    // Regular View
                    if (data.userid == user.id) {
                        //Current User
                        var loadedPeople = `<div class="event-live-chat-people-box"><div class="event-live-chat-pp-container"><div>` + data.username.slice(0, 2) + `</div></div><div class="event-live-chat-message-sender-container"><div class="event-live-chat-message-sender-wrapper"><div class="message-sender-text">` + data.username + `</div><div class="message-sender-tag current-member"><div>SEN</div></div></div><div class="message-sender-city">` + data.usercity + ` - ` + data.usertitle + `</div></div></div>`;
                        $("#live-chat-people-area").append(loadedPeople);
                    } else if (data.type == 'Mod') {
                        //Mod
                        var loadedPeople = `<div class="event-live-chat-people-box"><div class="event-live-chat-pp-container mod"><div>` + data.username.slice(0, 2) + `</div></div><div class="event-live-chat-message-sender-container"><div class="event-live-chat-message-sender-wrapper"><div class="message-sender-text">` + data.username + `</div><div class="message-sender-tag moderator"><div>MOD</div><div class="message-sender-icn"></div></div></div><div class="message-sender-city">` + data.usercity + ` - ` + data.usertitle + `</div></div></div>`;
                        $("#live-chat-people-area").append(loadedPeople);
                    } else {
                        //Others
                        var loadedPeople = `<div class="event-live-chat-people-box"><div class="event-live-chat-pp-container"><div>` + data.username.slice(0, 2) + `</div></div><div class="event-live-chat-message-sender-container"><div class="event-live-chat-message-sender-wrapper"><div class="message-sender-text">` + data.username + `</div></div><div class="message-sender-city">` + data.usercity + ` - ` + data.usertitle + `</div></div></div>`;
                        $("#live-chat-people-area").append(loadedPeople);
                    }

                }

                $("#live-chat-people-area").scrollTop($('#live-chat-people-area')[0].scrollHeight - $('#live-chat-people-area')[0].clientHeight);
                $("#people-number").html('(' + userNumber + ')');
            });

        });
    }

// Loading Questions Function
    function loadQuestion() {
        var query = database.ref("questions").orderByChild('votenegative');
        query.on('value', function (snapshot) {
            $("#live-chat-question-area").html("");
            snapshot.forEach(function (childSnapshot) {
                var data = childSnapshot.val();
                if (user.type == 'Mod') {
                    // Mod View
                    if (data.listed) {
                        // Listed Question
                        var loadedQuestion = `<div class="event-live-chat-question-box"><div class="event-live-chat-message-sender-container"><div class="event-live-chat-message-sender-wrapper"><div class="message-sender-text">` + data.sender + `</div></div><div class="message-sender-city">` + data.sendercity + ` - ` + data.sendertitle + `</div></div><div class="question-wrapper"><div class="question-container listed"><div class="question-title">SORU</div><div>` + data.question + `</div></div><div class="question-score-container"><div data-id="` + data.questionid + `" class="question-up-vote" ></div><div>` + data.vote + `</div><div data-id="` + data.questionid + `" class="question-down-vote "></div></div></div><div class="message-functional-container quetion"><div data-id="` + data.questionid + `" onclick="unlistQuestion(this);" class="message-functional-text remove-from-list">Listeden Çıkar</div><div data-id="` + data.senderid + `"  onclick="banUser(this);" class="message-functional-text red">Kullanıcıyı&nbsp;Yasakla</div><div data-id="` + data.questionid + `" onclick="deleteQuestion(this);" class="message-functional-text">Soruyu&nbsp;Sil</div><div class="message-date-text">` + data.date + `</div></div></div>`;
                        $("#live-chat-question-area").append(loadedQuestion);

                    } else {
                        // UnListed Question
                        var loadedQuestion = `<div class="event-live-chat-question-box"><div class="event-live-chat-message-sender-container"><div class="event-live-chat-message-sender-wrapper"><div class="message-sender-text">` + data.sender + `</div></div><div class="message-sender-city">` + data.sendercity + ` - ` + data.sendertitle + `</div></div><div class="question-wrapper"><div class="question-container"><div class="question-title">SORU</div><div>` + data.question + `</div></div><div class="question-score-container"><div data-id="` + data.questionid + `" class="question-up-vote" ></div><div>` + data.vote + `</div><div data-id="` + data.questionid + `" class="question-down-vote "></div></div></div><div class="message-functional-container quetion"><div data-id="` + data.questionid + `" onclick="listQuestion(this);" class="message-functional-text add-to-list">Listeye Ekle</div><div data-id="` + data.senderid + `"  onclick="banUser(this);" class="message-functional-text red">Kullanıcıyı&nbsp;Yasakla</div><div data-id="` + data.questionid + `" onclick="deleteQuestion(this);" class="message-functional-text">Soruyu&nbsp;Sil</div><div class="message-date-text">` + data.date + `</div></div></div>`;
                        $("#live-chat-question-area").append(loadedQuestion);

                    }

                } else {
                    // Regular View
                    if (data.senderid == user.id) {
                        //Current User
                        if (data.listed) {
                            //Listed Question
                            var loadedQuestion = `<div class="event-live-chat-question-box"><div class="event-live-chat-message-sender-container"><div class="event-live-chat-message-sender-wrapper"><div class="message-sender-text">` + data.sender + `</div><div class="message-sender-tag current-member"><div>SEN</div></div></div><div class="message-sender-city">` + data.sendercity + ` - ` + data.sendertitle + `</div></div><div class="question-wrapper"><div class="question-container listed"><div class="question-title">SORU</div><div>` + data.question + `</div></div><div class="question-score-container"><div data-id="` + data.questionid + `" class="question-up-vote"  }></div><div>` + data.vote + `</div><div data-id="` + data.questionid + `" class="question-down-vote "></div></div></div><div class="message-functional-container quetion"><div data-id="` + data.questionid + `" onclick="deleteQuestion(this);" class="message-functional-text">Soruyu&nbsp;Sil</div><div class="message-date-text">` + data.date + `</div><div class="message-functional-text listed-question">Soru yayında cevaplanacak.</div></div></div>`;
                            $("#live-chat-question-area").append(loadedQuestion);
                        } else {
                            //UnListed Question
                            var loadedQuestion = `<div class="event-live-chat-question-box"><div class="event-live-chat-message-sender-container"><div class="event-live-chat-message-sender-wrapper"><div class="message-sender-text">` + data.sender + `</div><div class="message-sender-tag current-member"><div>SEN</div></div></div><div class="message-sender-city">` + data.sendercity + ` - ` + data.sendertitle + `</div></div><div class="question-wrapper"><div class="question-container"><div class="question-title">SORU</div><div>` + data.question + `</div></div><div class="question-score-container"><div data-id="` + data.questionid + `" class="question-up-vote" ></div><div>` + data.vote + `</div><div data-id="` + data.questionid + `" class="question-down-vote "></div></div></div><div class="message-functional-container quetion"><div data-id="` + data.questionid + `" onclick="deleteQuestion(this);" class="message-functional-text">Soruyu&nbsp;Sil</div><div class="message-date-text">` + data.date + `</div></div></div>`;
                            $("#live-chat-question-area").append(loadedQuestion);

                        }
                    } else {
                        //Others 
                        if (data.listed) {
                            //Listed Question
                            var loadedQuestion = `<div class="event-live-chat-question-box"><div class="event-live-chat-message-sender-container"><div class="event-live-chat-message-sender-wrapper"><div class="message-sender-text">` + data.sender + `</div></div><div class="message-sender-city">` + data.sendercity + ` - ` + data.sendertitle + `</div></div><div class="question-wrapper"><div class="question-container listed"><div class="question-title">SORU</div><div>` + data.question + `</div></div><div class="question-score-container"><div data-id="` + data.questionid + `" class="question-up-vote" ></div><div>` + data.vote + `</div><div data-id="` + data.questionid + `" class="question-down-vote "></div></div></div><div class="message-functional-container quetion"><div class="message-date-text">` + data.date + `</div><div class="message-functional-text listed-question">Soru yayında cevaplanacak.</div></div></div>`;
                            $("#live-chat-question-area").append(loadedQuestion);
                        } else {
                            //UnListed Question
                            var loadedQuestion = `<div class="event-live-chat-question-box"><div class="event-live-chat-message-sender-container"><div class="event-live-chat-message-sender-wrapper"><div class="message-sender-text">` + data.sender + `</div></div><div class="message-sender-city">` + data.sendercity + ` - ` + data.sendertitle + `</div></div><div class="question-wrapper"><div class="question-container"><div class="question-title">SORU</div><div>` + data.question + `</div></div><div class="question-score-container"><div data-id="` + data.questionid + `" class="question-up-vote" ></div><div>` + data.vote + `</div><div data-id="` + data.questionid + `" class="question-down-vote "></div></div></div><div class="message-functional-container quetion"><div class="message-date-text">` + data.date + `</div></div></div>`;
                            $("#live-chat-question-area").append(loadedQuestion);

                        }
                    }

                }

                $("#live-chat-message-area").scrollTop($('#live-chat-message-area')[0].scrollHeight - $('#live-chat-message-area')[0].clientHeight);
            });

        });
    }


// Send Message Function
    $('#live-chat-form').submit(function sendMessage() {

        event.preventDefault();

        var message = $("#live-chat-input").val();
        if (user.firstName + ' ' + user.lastName != "" && message != "") {
            var date = new Date();
            var messageKey = database.ref("chats/").push().key; //Rastgele bir mesaj keyi gönderir.
            database.ref("chats/" + messageKey).set({
                message: message,
                messageid: messageKey,
                sender: user.firstName + ' ' + user.lastName,
                senderid: user.id,
                sendertype: user.type,
                sendercity: user.city,
                sendertitle: user.title,
                date: date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
            });
            //Clear input
            $("#live-chat-input").val('');

            return false;
        } else {
            toastr.warning('Mesaj gönderebilmek için bir metin girin.', 'Lütfen boş alan bırakmayınız.');
        }
    })

    // Ask Question Fucntion

    $('#live-question-form').submit(function askQuestion() {

        event.preventDefault();

        var question = $("#live-question-input").val();
        if (user.firstName + ' ' + user.lastName != "" && question != "") {
            var date = new Date();
            var questionKey = database.ref("questions/").push().key; //Rastgele bir mesaj keyi gönderir.
            database.ref("questions/" + questionKey).set({
                question: question,
                questionid: questionKey,
                vote: 1,
                votenegative: 1,
                listed: false,
                sender: user.firstName + ' ' + user.lastName,
                senderid: user.id,
                sendertype: user.type,
                sendercity: user.city,
                sendertitle: user.title,
                date: date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
            });
            
            database.ref("voters/" + questionKey + "/" + user.id).set({
            
            upvote: true,
            downvote: false,
            
            })
            
            //Clear input
            $("#live-question-input").val('');

            return false;
        } else {
            toastr.warning('Soru sorabilmek için bir metin girin.', 'Lütfen boş alan bırakmayınız.');
        }
    })

    // Attach Listenere for Banned Users
    database.ref("users").on('child_changed', (data) => {

        var messages = database.ref("chats");
        messages.once('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                var messagesData = childSnapshot.val();
                if (messagesData.senderid == data.val().userid) {

                    database.ref("chats/" + messagesData.messageid).remove()
                }

            });

        });

        if (data.val().ban == false) {
        
        		// Notify Current User When They're Banned
            if (user.id == data.val().userid)

            {
                toastr.error('Eğer bir hata olduğunu düşünüyorsanız aşağıdaki canlı yardımdan destek alabilirsiniz.', 'Sohbete erişiminiz kısıtlanmış.')
                $(".embed-live-start-chat-block").show();
            }

        }

    });
    
    // VoteUp Function
$(document).on('click', '.question-up-vote', function voteUp () {


 
  			var userId = user.id
        var questionId = this.getAttribute("data-id");
        
        var questions = database.ref().child('questions');
        questions.child(questionId).get().then(function (snapshot) {
        var question = snapshot.val() 
    		
        // Current User View

        if (userId == question.senderid) {

            toastr.error('Soruyu sorduğunuzda otomatik olarak oyunuz da eklenmiş olur. Bunun haricinde oy vermek mümkün değildir.', 'Kendi sorunuzu oylayamazsınız.')
				// Mod View
        } else if (user.type == 'Mod') {


            database.ref("questions/" + questionId).update({

                vote: question.vote + 1,
                votenegative: question.votenegative - 1,

            })

				// Other View
        } else {

             var voters = database.ref().child("voters/" + questionId);
        voters.child(user.id).get().then(function (snapshot) {
            var votersData = snapshot.val()
            if (snapshot.exists()) {
            
            // Already Voted
            if(votersData.upvote) {toastr.error('Her soruya yalnızca bir artı ya da bir eksi oy verebilirsiniz.', 'Zaten oy vermişsiniz.')} 
            // Negative Voter
            else if (votersData.downvote == true) {
            
            database.ref("questions/" + questionId).update({

                    vote: question.vote + 1,
                    votenegative: question.votenegative - 1,

                });
                
                voters.child(user.id).update({upvote:true, downvote:false})
            
            }
            
            
            
            
            } else {
               
							// First time voter
                database.ref("questions/" + questionId).update({

                    vote: question.vote + 1,
                    votenegative: question.votenegative - 1,

                });
                
          	database.ref("voters/" + questionId + "/" + user.id).set({
            
            upvote: true,
            downvote: false,
            
            })

            }})

        }
        
        
        
        });
            
        

    });
    
    // VoteDown Function
    
    $(document).on('click', '.question-down-vote', function voteDown () {


 
  			var userId = user.id
        var questionId = this.getAttribute("data-id");
        
        var questions = database.ref().child('questions');
        questions.child(questionId).get().then(function (snapshot) {
        var question = snapshot.val() 
    		
        // Current User View

        if (userId == question.senderid) {

            toastr.error('Soruyu sorduğunuzda otomatik olarak oyunuz da eklenmiş olur. Bunun haricinde oy vermek mümkün değildir.', 'Kendi sorunuzu oylayamazsınız.')
				// Mod View
        } else if (user.type == 'Mod') {


            database.ref("questions/" + questionId).update({

                vote: question.vote - 1,
                votenegative: question.votenegative + 1,

            })

				// Other View
        } else {

             var voters = database.ref().child("voters/" + questionId);
        voters.child(user.id).get().then(function (snapshot) {
            var votersData = snapshot.val()
            if (snapshot.exists()) {
            
            // Already Voted
            if(votersData.downvote) {toastr.error('Her soruya yalnızca bir artı ya da bir eksi oy verebilirsiniz.', 'Zaten oy vermişsiniz.')} 
            // Positive Voter
            else if (votersData.upvote == true) {
            
            database.ref("questions/" + questionId).update({

                    vote: question.vote - 1,
                    votenegative: question.votenegative + 1,

                });
                
                voters.child(user.id).update({upvote:false, downvote:true})
            
            }
            
            
            
            
            } else {
               
							// First time voter
                database.ref("questions/" + questionId).update({

                    vote: question.vote - 1,
                    votenegative: question.votenegative + 1,

                });
                
          	database.ref("voters/" + questionId + "/" + user.id).set({
            
            upvote: false,
            downvote: true,
            
            })

            }})

        }
        
        
        
        });
            
        

    });

       
})
