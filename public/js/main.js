const app = {

  rooms() {
    const socket = io('/rooms', { transports: ['websocket'] });

    // When socket connects, get a list of chatrooms
    socket.on('connect', () => {
      // Update rooms list upon emitting updateRoomsList event
      socket.on('updateRoomsList', (room) => {
        // Display an error message upon a user error(i.e. creating a room with an existing title)
        $('.room-create p.message').remove();
        if (room.error != null) {
          $('.room-create').append(`<p class="message error">${room.error}</p>`);
        } else {
          app.helpers.updateRoomsList(room);
        }
      });

      // Whenever the user hits the create button, emit createRoom event.
      $('.room-create button').on('click', (e) => {
        const inputEle = $("input[name='title']");
        const roomTitle = inputEle.val().trim();
        if (roomTitle !== '') {
          socket.emit('createRoom', roomTitle);
          inputEle.val('');
        }
      });
    });
  },

  chat(roomId, username, msgs) {
    const socket = io('/chatroom', { transports: ['websocket'] });
    const messages = JSON.parse(msgs);
    // When socket connects, join the current chatroom
    socket.on('connect', () => {
      socket.emit('join', roomId);
      for (let i = 0; i < messages.length; i += 1) {
        app.helpers.addMessage(messages[i]);
      }

      // Whenever the user hits the save button, emit newMessage event.
      $('.chat-message button').on('click', (e) => {
        const textareaEle = $("textarea[name='message']");
        const messageContent = textareaEle.val().trim();
        if (messageContent !== '') {
          const message = {
            content: messageContent,
            username,
            roomId,
            createdAt: Date.now(),
          };

          socket.emit('newMessage', roomId, message);
          textareaEle.val('');
          app.helpers.addMessage(message);
        }
      });

      // Append a new message
      socket.on('addMessage', (message) => {
        app.helpers.addMessage(message);
      });
    });
  },

  helpers: {

    encodeHTML(str) {
      return $('<div />').text(str).html();
    },

    // Update rooms list
    updateRoomsList(room) {
      room.title = this.encodeHTML(room.title);
      room.title = room.title.length > 25 ? `${room.title.substr(0, 25)}...` : room.title;
      const html = `<a href="/rooms/${room._id}"><li class="room-item border border-primary">${room.title}</li></a>`;

      if (html === '') { return; }

      if ($('.room-list ul li').length > 0) {
        $('.room-list ul').prepend(html);
      } else {
        $('.room-list ul').html('').html(html);
      }

      this.updateNumOfRooms();
    },

    // Adding a new message to chat history
    addMessage(message) {
      message.createdAt = (new Date(message.createdAt)).toLocaleString();
      message.username = this.encodeHTML(message.username);
      message.content = this.encodeHTML(message.content);

      const html = `<li>
                    <div class="message-data">
                      <span class="message-data-name">${message.username}</span>
                      <span class="message-data-time">${message.createdAt}</span>
                    </div>
                    <div class="message my-message" dir="auto">${message.content}</div>
                  </li>`;
      $(html).hide().appendTo('.chat-history ul').slideDown(200);
    },

    // Update number of rooms
    // This method MUST be called after adding a new room
    updateNumOfRooms() {
      const num = $('.room-list ul li').length;
      $('.room-num-rooms').text(`${num} Room(s)`);
    },
  },
};
