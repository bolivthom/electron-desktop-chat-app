import React, { Component } from 'react'
import { ChatManager, TokenProvider } from '@pusher/chatkit'
import MessageList from './MessageList'
import SendMessageForm from './SendMessageForm'

class Chat extends Component {
  state = {
    currentUser: null,
    currentRoom: {},
    messages: []
  }

  componentDidMount() {
    const chatkit = new ChatManager({
      instanceLocator: 'v1:us1:24bc357f-5927-4784-96d9-f077d6987ccf',
      userId: this.props.currentId,
      tokenProvider: new TokenProvider({
        url:
          'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/24bc357f-5927-4784-96d9-f077d6987ccf/token'
      })
    })

    chatkit
      .connect()
      .then(currentUser => {
        this.setState({ currentUser })
        console.log('Bleep bloop 🤖 You are connected to Chatkit')
        return currentUser.subscribeToRoom({
                 roomId: 19379232, // Replace with YOUR ROOM ID
                 messageLimit: 100,
                 hooks: {
                   onNewMessage: message => {
                     this.setState({
                      messages: [...this.state.messages, message]
                   })
                 }
               }
             })
           })
           .then(currentRoom => {
             this.setState({ currentRoom })
    })
      .catch(error => console.error('error', error))
  }

  onSend = text => {
        this.state.currentUser.sendMessage({
        text,
        roomId: this.state.currentRoom.id
       })
     }

  render() {
    return (
        <div className="wrapper">
        <div className="chat">
          <MessageList messages={this.state.messages} />
          <SendMessageForm onSend={this.onSend} />
        </div>
      </div>
    )
  }
}

export default Chat